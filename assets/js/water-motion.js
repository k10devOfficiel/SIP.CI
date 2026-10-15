/**
 * ==========================================================================
 * SIP WATER MOTION ENGINE (Flaque d'eau & Gouttes d'eau interactives)
 * ==========================================================================
 * Moteur haute performance de simulation hydrodynamique sur Canvas 2D :
 * 1. Flaque d'eau au défilement / déplacement de la souris (ondes liquides,
 *    sillages concentriques avec réfraction et dispersion soyeuse).
 * 2. Goutte d'eau au clic sur élément cliquable (impact de gouttelette,
 *    4 anneaux d'ondes de choc concentriques, micro-éclaboussures
 *    balistiques et synthèse sonore "plop" organique par Web Audio).
 * 3. Respect du 60/120fps, limitation de charge GPU, neutralité tactile.
 * ==========================================================================
 */

(function () {
    'use strict';

    // Sécurité et détection des préférences
    if (window.sipWaterEngineLoaded) return;
    window.sipWaterEngineLoaded = true;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // --------------------------------------------------------------------------
    // 1. Initialisation du Canvas Fullscreen en surimpression
    // --------------------------------------------------------------------------
    var canvas = document.createElement('canvas');
    canvas.id = 'sip-water-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99998';
    canvas.style.mixBlendMode = 'screen'; // Rendu lumineux et réfractif liquide
    document.documentElement.appendChild(canvas);

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var width = window.innerWidth;
    var height = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // --------------------------------------------------------------------------
    // 2. Moteur Audio Synthétisé (Goutte d'eau "Plop" réaliste)
    // --------------------------------------------------------------------------
    var audioCtx = null;
    function playWaterDropSound() {
        try {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            if (!audioCtx) audioCtx = new AudioContextClass();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            var now = audioCtx.currentTime;
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            var filter = audioCtx.createBiquadFilter();

            // Balayage fréquentiel caractéristique de la goutte d'eau tombant dans un liquide
            var baseFreq = 700 + Math.random() * 250;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.85, now + 0.06);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, now + 0.11);

            // Filtre résonant liquide
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(baseFreq * 1.4, now);
            filter.Q.setValueAtTime(4.5, now);

            // Enveloppe d'amplitude ultra-rapide (impact & amortissement)
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.13);
        } catch (e) {
            // Audio silencieux si non autorisé
        }
    }

    // --------------------------------------------------------------------------
    // 3. Pool de Particules et Ondes Hydrodynamiques
    // --------------------------------------------------------------------------
    var ripples = [];
    var droplets = [];
    var splashes = [];
    var MAX_RIPPLES = 120;
    var MAX_DROPLETS = 70;

    /**
     * Onde de flaque d'eau (crête lumineuse + ombre liquide réfractive)
     */
    function Ripple(x, y, maxRadius, speed, intensity, isDropImpact) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = maxRadius || 80;
        this.speed = speed || 2.4;
        this.intensity = intensity || 1;
        this.alpha = 1;
        this.lineWidth = isDropImpact ? 3.5 : 2;
        this.isDropImpact = !!isDropImpact;
        // Légère variation de teinte pétrole / eau pure
        this.hueShift = Math.random() > 0.6 ? 'amber' : 'pure';
    }

    Ripple.prototype.update = function () {
        this.radius += this.speed;
        this.speed *= 0.965; // Amortissement fluide réaliste
        var progress = this.radius / this.maxRadius;
        this.alpha = Math.max(0, (1 - progress) * this.intensity);
        return this.alpha > 0.01 && this.radius < this.maxRadius;
    };

    Ripple.prototype.draw = function (context) {
        if (this.alpha <= 0.01) return;

        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Crête lumineuse supérieure
        var strokeAlpha = this.alpha * (this.isDropImpact ? 0.75 : 0.45);
        if (this.hueShift === 'amber') {
            context.strokeStyle = 'rgba(245, 158, 11, ' + (strokeAlpha * 0.7) + ')';
        } else {
            context.strokeStyle = 'rgba(255, 255, 255, ' + strokeAlpha + ')';
        }
        context.lineWidth = Math.max(0.7, this.lineWidth * (1 - this.radius / this.maxRadius));
        context.stroke();

        // Deuxième onde de réfraction concentrique intérieure
        if (this.radius > 8) {
            context.beginPath();
            context.arc(this.x, this.y, Math.max(1, this.radius - 4), 0, Math.PI * 2);
            context.strokeStyle = 'rgba(120, 180, 240, ' + (strokeAlpha * 0.35) + ')';
            context.lineWidth = Math.max(0.5, context.lineWidth * 0.6);
            context.stroke();
        }

        context.restore();
    };

    /**
     * Micro-éclaboussure de goutte d'eau (Splash Bead)
     */
    function SplashBead(x, y, vx, vy, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size || (1.5 + Math.random() * 2);
        this.alpha = 1;
        this.gravity = 0.12;
        this.decay = 0.022 + Math.random() * 0.015;
    }

    SplashBead.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.alpha -= this.decay;
        return this.alpha > 0;
    };

    SplashBead.prototype.draw = function (context) {
        if (this.alpha <= 0) return;
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 255, 255, ' + (this.alpha * 0.85) + ')';
        context.fill();

        // Halo d'eau brillante
        context.beginPath();
        context.arc(this.x, this.y, this.size * 1.8, 0, Math.PI * 2);
        context.fillStyle = 'rgba(200, 230, 255, ' + (this.alpha * 0.25) + ')';
        context.fill();
        context.restore();
    };

    /**
     * Flash central de goutte d'eau à l'impact
     */
    function DropletFlash(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = 14;
        this.alpha = 1;
    }

    DropletFlash.prototype.update = function () {
        this.radius += 1.8;
        this.alpha -= 0.08;
        return this.alpha > 0;
    };

    DropletFlash.prototype.draw = function (context) {
        if (this.alpha <= 0) return;
        context.save();
        var grad = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, 'rgba(255, 255, 255, ' + (this.alpha * 0.9) + ')');
        grad.addColorStop(0.5, 'rgba(215, 25, 32, ' + (this.alpha * 0.35) + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = grad;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
    };

    // --------------------------------------------------------------------------
    // 4. Déclencheurs Hydrodynamiques : Impact de Goutte d'Eau au Clic
    // --------------------------------------------------------------------------
    // Note : Aucun cercle ni onde ne suit le curseur de la souris (supprimé).
    // Seul l'impact de goutte d'eau réaliste se produit lors d'un clic interactif.


    // C. Clic sur n'importe quel élément cliquable -> Impact de Goutte d'Eau ("Water Drop")
    var CLICKABLE_SELECTORS = 'a, button, [role="button"], input, select, textarea, .btn, .service-card, .news-card, .stat-card, .slider-btn, .dot, .widget-toggle, .faq-question';

    function spawnWaterDropImpact(x, y, isClickable) {
        // Son de la goutte d'eau
        playWaterDropSound();

        // 1. Flash d'impact central
        droplets.push(new DropletFlash(x, y));

        // 2. Série de 4 ondes concentriques avec retards cadencés
        var maxWaveRadius = isClickable ? 160 : 100;
        var waveSpeed = isClickable ? 3.8 : 2.8;

        ripples.push(new Ripple(x, y, maxWaveRadius, waveSpeed, 1.0, true));

        setTimeout(function () {
            ripples.push(new Ripple(x, y, maxWaveRadius * 0.85, waveSpeed * 0.9, 0.85, true));
        }, 65);

        setTimeout(function () {
            ripples.push(new Ripple(x, y, maxWaveRadius * 0.65, waveSpeed * 0.8, 0.65, true));
        }, 130);

        setTimeout(function () {
            ripples.push(new Ripple(x, y, maxWaveRadius * 0.45, waveSpeed * 0.7, 0.45, true));
        }, 210);

        // 3. Éclaboussures radiales de micro-gouttelettes
        var dropCount = isClickable ? 14 : 8;
        for (var i = 0; i < dropCount; i++) {
            var angle = (Math.PI * 2 / dropCount) * i + (Math.random() - 0.5) * 0.5;
            var velocity = 2.2 + Math.random() * 3.4;
            splashes.push(new SplashBead(
                x,
                y,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity - 1.5, // Impulsion légèrement ascendante
                1.4 + Math.random() * 1.8
            ));
        }
    }

    document.addEventListener('click', function (e) {
        var x = e.clientX;
        var y = e.clientY;
        var target = e.target;
        var isClickable = target.closest && target.closest(CLICKABLE_SELECTORS);

        spawnWaterDropImpact(x, y, !!isClickable);

        // Effet d'ondulation liquide sur l'élément cible
        if (isClickable) {
            var clickableEl = target.closest(CLICKABLE_SELECTORS);
            clickableEl.classList.remove('sip-water-clicked');
            // Forcer le reflow pour relancer l'animation
            void clickableEl.offsetWidth;
            clickableEl.classList.add('sip-water-clicked');
            setTimeout(function () {
                clickableEl.classList.remove('sip-water-clicked');
            }, 600);
        }
    }, true);

    // --------------------------------------------------------------------------
    // 5. Boucle d'Animation 60 FPS Optimisée
    // --------------------------------------------------------------------------
    var isRunning = true;

    function animate() {
        if (!isRunning) return;

        ctx.clearRect(0, 0, width, height);

        // Mise à jour et dessin des ondes de flaque
        var i;
        for (i = ripples.length - 1; i >= 0; i--) {
            var r = ripples[i];
            if (r.update()) {
                r.draw(ctx);
            } else {
                ripples.splice(i, 1);
            }
        }

        // Mise à jour et dessin des impacts de gouttelettes
        for (i = droplets.length - 1; i >= 0; i--) {
            var d = droplets[i];
            if (d.update()) {
                d.draw(ctx);
            } else {
                droplets.splice(i, 1);
            }
        }

        // Mise à jour et dessin des éclaboussures
        for (i = splashes.length - 1; i >= 0; i--) {
            var s = splashes[i];
            if (s.update()) {
                s.draw(ctx);
            } else {
                splashes.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Mettre en pause si l'onglet est masqué (économie processeur/batterie)
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            isRunning = false;
        } else {
            isRunning = true;
            requestAnimationFrame(animate);
        }
    });

})();
