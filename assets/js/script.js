// Script principal du site web - Version améliorée avec toutes les fonctionnalités

const FIDELITY_CLIENT_URL = 'https://fidelity.sip-ci.net/';

/** Icône profil (identique au lien dans social-icons-header) */
const FIDELITY_NAV_ICON_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>' +
    '</svg>';

const MOBILE_MENU_CLOSE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
    '</svg>';

function closeMobileMenu() {
    document.querySelectorAll('.nav-menu.mobile-open').forEach(function (menu) {
        menu.classList.remove('mobile-open');
    });
    document.querySelectorAll('.mobile-menu.active').forEach(function (menu) {
        menu.classList.remove('active');
    });
    document.querySelectorAll('.menu-overlay.active').forEach(function (overlay) {
        overlay.classList.remove('active');
    });
    document.body.style.overflow = '';
}

function setupMobileMenuCloseButton() {
    document.querySelectorAll('.mobile-menu, .nav-menu').forEach(function (menu) {
        if (menu.querySelector('.mobile-menu-close')) {
            return;
        }
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mobile-menu-close';
        btn.setAttribute('aria-label', 'Fermer le menu');
        btn.innerHTML = MOBILE_MENU_CLOSE_SVG;
        btn.addEventListener('click', closeMobileMenu);
        menu.insertBefore(btn, menu.firstChild);
    });
}

function setupEspaceClientNavigation() {
    document.querySelectorAll('.nav-menu').forEach(function (navMenu) {
        navMenu.querySelectorAll('.nav-espace-client-item').forEach(function (li) {
            li.remove();
        });

        var navEl = navMenu.closest('nav');
        var fidelityIconInBar =
            navEl &&
            navEl.querySelector('.social-icons-header a[href*="fidelity"]');

        if (fidelityIconInBar) {
            return;
        }

        var li = document.createElement('li');
        li.className = 'nav-espace-client-item';
        var link = document.createElement('a');
        link.href = FIDELITY_CLIENT_URL;
        link.className = 'nav-espace-client';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Espace client — connexion Fidelity');
        link.innerHTML =
            '<span class="nav-espace-client-icon">' +
            FIDELITY_NAV_ICON_SVG +
            '</span><span class="nav-espace-client-label">Espace client</span>';
        li.appendChild(link);
        navMenu.appendChild(li);
    });

    document.querySelectorAll('.mobile-menu').forEach(function (mobileMenu) {
        if (mobileMenu.querySelector('.mobile-menu-espace-client')) {
            return;
        }
        var link = document.createElement('a');
        link.href = FIDELITY_CLIENT_URL;
        link.className = 'mobile-menu-espace-client';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Espace client';
        mobileMenu.appendChild(link);
    });

    if (document.querySelector('.mobile-menu')) {
        document.body.classList.add('sip-has-mobile-drawer');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupEspaceClientNavigation();
    setupMobileMenuCloseButton();

    // ========================================
    // MENU MOBILE AMÉLIORÉ
    // ========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle') || document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuPanel = document.querySelector('.mobile-menu');

    let menuOverlay = document.querySelector('.menu-overlay');
    if (!menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }

    function openMobileMenu() {
        if (mobileMenuPanel) {
            mobileMenuPanel.classList.add('active');
        } else if (navMenu) {
            navMenu.classList.add('mobile-open');
        }
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function isMobileMenuOpen() {
        return (mobileMenuPanel && mobileMenuPanel.classList.contains('active')) ||
            (navMenu && navMenu.classList.contains('mobile-open'));
    }

    if (mobileMenuToggle && (navMenu || mobileMenuPanel)) {
        mobileMenuToggle.addEventListener('click', function () {
            if (isMobileMenuOpen()) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        menuOverlay.addEventListener('click', closeMobileMenu);

        document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    // ========================================
    // SMOOTH SCROLL POUR LES LIENS DE NAVIGATION
    // ========================================
    const allNavLinks = document.querySelectorAll('.nav-menu a, a[href^="#"]');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ========================================
    // ANIMATIONS AU SCROLL (MICRO-INTERACTIONS)
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer les sections avec animation
    const animateSections = document.querySelectorAll('.animate-on-scroll');
    animateSections.forEach(section => {
        observer.observe(section);
    });
    
    // Observer les conteneurs avec animation stagger
    const staggerContainers = document.querySelectorAll('.stagger-animation');
    staggerContainers.forEach(container => {
        observer.observe(container);
    });
    
    // ========================================
    // THÈME CLAIR PERMANENT (Identité SIP unifiée)
    // ========================================
    const html = document.documentElement;
    html.setAttribute('data-theme', 'light');

    /**
     * Pré-sélection du sujet sur contact.html (?sujet=franchise|devis|…).
     */
    const contactSubjectSelect = document.getElementById('sujet');
    if (contactSubjectSelect) {
        const subjectParam = new URLSearchParams(window.location.search).get('sujet');
        if (subjectParam) {
            const hasOption = Array.from(contactSubjectSelect.options).some(
                (opt) => opt.value === subjectParam
            );
            if (hasOption) {
                contactSubjectSelect.value = subjectParam;
            }
        }
    }

    if (window.location.hash === '#candidature-spontanee') {
        const candidatureBlock = document.getElementById('candidature-spontanee');
        if (candidatureBlock) {
            candidatureBlock.classList.add('candidature-spontanee-highlight');
            candidatureBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // ========================================
    // BANDEAU COOKIES RGPD
    // ========================================
    const cookiesBanner = document.querySelector('.cookies-banner');
    const cookiesAccept = document.querySelector('.cookies-btn-accept');
    const cookiesReject = document.querySelector('.cookies-btn-reject');
    
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookiesChoice = localStorage.getItem('cookiesChoice');
    
    if (cookiesBanner && !cookiesChoice) {
        // Afficher le bandeau après 2 secondes
        setTimeout(() => {
            cookiesBanner.classList.add('show');
        }, 2000);
    }
    
    if (cookiesAccept) {
        cookiesAccept.addEventListener('click', function() {
            localStorage.setItem('cookiesChoice', 'accepted');
            cookiesBanner.classList.remove('show');
        });
    }
    
    if (cookiesReject) {
        cookiesReject.addEventListener('click', function() {
            localStorage.setItem('cookiesChoice', 'rejected');
            cookiesBanner.classList.remove('show');
        });
    }
    
    // ========================================
    // Assistant virtuel désactivé
    
    // ========================================
    // FAQ ACCORDÉON
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // Fermer les autres items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle l'item actuel
                item.classList.toggle('active');
            });
        }
    });
    
    // ========================================
    // CALCULATEUR DE PRIX INTERACTIF
    // ========================================
    const calculatorForm = document.querySelector('.calculator-form');
    const calculatorResult = document.querySelector('.calculator-price');
    
    if (calculatorForm) {
        const productSelect = calculatorForm.querySelector('#calc-product');
        const quantityInput = calculatorForm.querySelector('#calc-quantity');
        
        // Prix des produits (FCFA par litre/kg)
        const prices = {
            'super': 750,
            'gasoil': 650,
            'petrole': 550,
            'gaz-butane': 1200,
            'gaz-propane': 1500,
            'lubrifiants': 5000
        };
        
        function calculatePrice() {
            if (productSelect && quantityInput && calculatorResult) {
                const product = productSelect.value;
                const quantity = parseFloat(quantityInput.value) || 0;
                const pricePerUnit = prices[product] || 0;
                const total = quantity * pricePerUnit;
                
                calculatorResult.textContent = total.toLocaleString('fr-FR') + ' FCFA';
            }
        }
        
        if (productSelect) {
            productSelect.addEventListener('change', calculatePrice);
        }
        
        if (quantityInput) {
            quantityInput.addEventListener('input', calculatePrice);
        }
    }
    
    // ========================================
    // LAZY LOADING POUR LES IMAGES
    // ========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // ========================================
    // ANIMATIONS DES NOMBRES
    // ========================================
    function animateNumbers() {
        const numbers = document.querySelectorAll('.animate-number');
        
        numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    number.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    number.textContent = target;
                }
            };
            
            updateNumber();
        });
    }
    
    // Observer pour déclencher l'animation des nombres
    const numbersObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                numbersObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        numbersObserver.observe(statsSection);
    }
});

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fonction pour initialiser la carte Google Maps (si présente sur la page)
function initMap() {
    const mapContainer = document.getElementById('stations-map');
    if (mapContainer && typeof google !== 'undefined') {
        const center = { lat: 5.3599517, lng: -4.0082563 }; // Abidjan
        const map = new google.maps.Map(mapContainer, {
            zoom: 12,
            center: center,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });
        
        // Marqueurs des stations (exemples)
        const stations = [
            { lat: 5.3599517, lng: -4.0082563, title: 'Station SIP - Treichville' },
            { lat: 5.3416, lng: -3.9923, title: 'Station SIP - Plateau' },
            { lat: 5.3723, lng: -4.0012, title: 'Station SIP - Cocody' },
            { lat: 5.3189, lng: -4.0156, title: 'Station SIP - Marcory' }
        ];
        
        stations.forEach(station => {
            new google.maps.Marker({
                position: { lat: station.lat, lng: station.lng },
                map: map,
                title: station.title,
                icon: {
                    url: 'assets/images/marker.png',
                    scaledSize: new google.maps.Size(40, 40)
                }
            });
        });
    }
}

// ========================================
// PAGE STATIONS — cartes depuis data/stations.json (inclus ici pour éviter un JS séparé oublié au déploiement)
// ========================================
(function () {
    /** URLs candidates pour stations.json (prod : chemins relatifs, sous-dossiers, blocages .json). */
    function stationJsonCandidates(el) {
        var urls = [];
        var seen = {};

        function add(urlStr) {
            if (!urlStr || typeof urlStr !== 'string') return;
            try {
                var abs = new URL(urlStr, window.location.href).href;
                if (!seen[abs]) {
                    seen[abs] = true;
                    urls.push(abs);
                }
            } catch (e) {
                /* ignore */
            }
        }

        var raw = el.getAttribute('data-stations-json');
        add(raw || '../data/stations.json');
        add('../data/stations.json');

        var path = (window.location.pathname || '').replace(/\\/g, '/');
        var pagesIdx = path.indexOf('/pages/');
        if (pagesIdx !== -1) {
            var base = path.slice(0, pagesIdx + 1);
            add(window.location.origin + base + 'data/stations.json');
        }

        add(window.location.origin + '/data/stations.json');

        return urls;
    }

    /** Essaie chaque URL jusqu'à un JSON valide. */
    function fetchStationsJson(urls, index, lastDetail) {
        index = index || 0;
        if (index >= urls.length) {
            return Promise.reject(
                lastDetail ||
                    new Error(
                        'stations.json introuvable ou invalide. URLs essayées : ' + urls.join(' | ')
                    )
            );
        }

        var u = urls[index];

        return fetch(u, { credentials: 'same-origin', cache: 'no-store' })
            .then(function (res) {
                if (!res.ok) {
                    return fetchStationsJson(
                        urls,
                        index + 1,
                        new Error(u + ' → HTTP ' + res.status)
                    );
                }
                return res.text().then(function (text) {
                    try {
                        return JSON.parse(text);
                    } catch (parseErr) {
                        var snippet = (text || '').slice(0, 120).replace(/\s+/g, ' ');
                        return fetchStationsJson(
                            urls,
                            index + 1,
                            new Error(
                                u +
                                    ' → JSON invalide (' +
                                    parseErr.message +
                                    '). Début de réponse : ' +
                                    snippet
                            )
                        );
                    }
                });
            })
            .catch(function () {
                return fetchStationsJson(
                    urls,
                    index + 1,
                    new Error(u + ' → erreur réseau ou fichier inaccessible')
                );
            });
    }

    function siteRootPrefix() {
        return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : '';
    }

    function imageSrc(filename) {
        if (!filename || typeof filename !== 'string') return '';
        var clean = filename.replace(/^\/+/, '');
        return siteRootPrefix() + 'assets/images/' + clean;
    }

    function sortStations(list) {
        return list.slice().sort(function (a, b) {
            var oa = typeof a.sortOrder === 'number' ? a.sortOrder : 999;
            var ob = typeof b.sortOrder === 'number' ? b.sortOrder : 999;
            if (oa !== ob) return oa - ob;
            var fa = a.featured === true ? 1 : 0;
            var fb = b.featured === true ? 1 : 0;
            if (fb !== fa) return fb - fa;
            var na = (a.name || '').toLocaleLowerCase('fr');
            var nb = (b.name || '').toLocaleLowerCase('fr');
            return na.localeCompare(nb, 'fr');
        });
    }

    function wantsMap(station) {
        var mt = station.mediaType;
        if (mt === 'image') return false;
        if (mt === 'map') return true;
        var c = station.coordinates;
        return !!(c && typeof c.lat === 'number' && typeof c.lng === 'number');
    }

    function hasValidCoordinates(station) {
        var c = station.coordinates;
        if (!c || c.lat == null || c.lng == null) return false;
        var lat = Number(c.lat);
        var lng = Number(c.lng);
        return !Number.isNaN(lat) && !Number.isNaN(lng);
    }

    function buildGoogleEmbedSrc(station) {
        if (hasValidCoordinates(station)) {
            var lat = Number(station.coordinates.lat);
            var lng = Number(station.coordinates.lng);
            var q = encodeURIComponent(lat + ',' + lng);
            return 'https://maps.google.com/maps?q=' + q + '&hl=fr&z=15&output=embed';
        }
        var parts = [
            station.address,
            station.city,
            station.name,
            "Côte d'Ivoire",
        ].filter(function (x) {
            return x && String(x).trim();
        });
        var query = parts.length ? parts.join(', ') : "Côte d'Ivoire";
        return (
            'https://maps.google.com/maps?q=' +
            encodeURIComponent(query) +
            '&hl=fr&z=14&output=embed'
        );
    }

    function canEmbedMap(station) {
        if (!wantsMap(station)) return false;
        return (
            hasValidCoordinates(station) ||
            !!(station.address || station.city || station.name)
        );
    }

    function appendTags(container, station) {
        var tags = container.querySelector('.station-tags');
        if (!tags || !Array.isArray(station.services)) return;
        tags.innerHTML = '';
        station.services.slice(0, 8).forEach(function (label) {
            var span = document.createElement('span');
            span.className = 'station-tag';
            span.textContent = label;
            tags.appendChild(span);
        });
    }

    function renderStationCard(station) {
        var card = document.createElement('div');
        card.className = 'card station-card';

        var media = document.createElement('div');
        media.className = 'station-image';

        if (canEmbedMap(station)) {
            var iframe = document.createElement('iframe');
            iframe.className = 'station-map-iframe';
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.title = 'Localisation - ' + (station.name || 'Station');
            iframe.src = buildGoogleEmbedSrc(station);
            media.appendChild(iframe);
        } else {
            var img = document.createElement('img');
            img.src = imageSrc(station.image || '');
            img.alt = station.name || 'Station SIP';
            media.appendChild(img);
        }

        var body = document.createElement('div');
        body.className = 'station-content';

        var h3 = document.createElement('h3');
        h3.className = 'station-title';
        h3.textContent = station.name || '';

        var addr = document.createElement('p');
        addr.className = 'station-address';
        var addrParts = [station.address, station.city].filter(Boolean);
        addr.textContent = addrParts.join(addrParts.length ? ', ' : '') || '';

        var tagsWrap = document.createElement('div');
        tagsWrap.className = 'station-tags';

        body.appendChild(h3);
        body.appendChild(addr);
        body.appendChild(tagsWrap);

        card.appendChild(media);
        card.appendChild(body);

        appendTags(card, station);

        return card;
    }

    var FALLBACK_STATIONS = [
        {
            id: 1,
            sortOrder: 1,
            name: "Station SIP Bonoua",
            address: "Route Grand-Bassam, Bonoua",
            city: "Bonoua",
            coordinates: { lat: 5.2729, lng: -3.5967 },
            services: ["Carburants", "Lavage", "Boutique"],
            image: "sipimg.jpg",
            mediaType: "map",
            status: "active"
        },
        {
            id: 2,
            sortOrder: 2,
            name: "Station SIP Andé",
            address: "Avenue Principale, Andé",
            city: "Andé",
            coordinates: { lat: 5.232, lng: -4.35 },
            services: ["Carburants", "Lavage", "Restauration"],
            image: "sipimg2.jpg",
            mediaType: "map",
            status: "active"
        },
        {
            id: 3,
            sortOrder: 3,
            name: "Station SIP Angovia",
            address: "Route de Yamoussoukro, Angovia",
            city: "Angovia",
            coordinates: { lat: 6.58, lng: -5.02 },
            services: ["Carburants", "Boutique", "Lubrifiants"],
            image: "sipimg3.jpg",
            mediaType: "map",
            status: "active"
        },
        {
            id: 4,
            sortOrder: 4,
            name: "Station SIP Yopougon Cité ADO",
            address: "Cité ADO, Yopougon",
            city: "Abidjan",
            coordinates: { lat: 5.3487, lng: -4.0789 },
            services: ["Carburants", "Lavage", "Boutique"],
            image: "sipimg4.jpg",
            mediaType: "map",
            status: "active"
        },
        {
            id: 5,
            sortOrder: 5,
            name: "Station SIP Vridi Hino",
            address: "Zone Industrielle, Vridi",
            city: "Abidjan",
            coordinates: { lat: 5.2947, lng: -3.9578 },
            services: ["Carburants", "Lavage", "Lubrifiants", "Restauration"],
            image: "sipimg5.jpg",
            mediaType: "map",
            status: "active"
        },
        {
            id: 6,
            sortOrder: 6,
            name: "Station SIP Diekolilie",
            address: "Route d'Abengourou, Djekolilie",
            city: "Djekolilie",
            coordinates: { lat: 6.737, lng: -3.483 },
            services: ["Carburants", "Boutique", "Lavage"],
            image: "slide1.png",
            mediaType: "map",
            status: "active"
        },
        {
            id: 7,
            sortOrder: 7,
            name: "Station SIP Zégata",
            address: "Zégata",
            city: "Zégata",
            coordinates: { lat: 7.555, lng: -6.053 },
            services: ["Carburants", "Lavage", "Boutique"],
            image: "slide2.png",
            mediaType: "map",
            status: "active"
        }
    ];

    function renderStationsList(mount, stations) {
        var active = (stations || []).filter(function (s) {
            return !s.status || String(s.status).toLowerCase() === 'active';
        });

        mount.innerHTML = '';

        if (!active.length) {
            var empty = document.createElement('p');
            empty.className = 'section-intro text-center';
            empty.style.gridColumn = '1 / -1';
            empty.textContent = 'Aucune station à afficher pour le moment.';
            mount.appendChild(empty);
            return;
        }

        sortStations(active).forEach(function (station) {
            mount.appendChild(renderStationCard(station));
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var mount = document.getElementById('stations-cards-mount');
        if (!mount) return;

        fetchStationsJson(stationJsonCandidates(mount), 0)
            .then(function (data) {
                var list = Array.isArray(data.stations) ? data.stations : [];
                if (list.length) {
                    renderStationsList(mount, list);
                } else {
                    renderStationsList(mount, FALLBACK_STATIONS);
                }
            })
            .catch(function (err) {
                console.warn('[stations-json] Chargement distant impossible, utilisation de la base de secours intégrée.', err);
                renderStationsList(mount, FALLBACK_STATIONS);
            });
    });
})();
/**
 * ==========================================================================
 * SIP MOTION PRO — v2 (moteur)
 * - Révélation directionnelle rejouable (bas = du haut vers le bas, haut = inverse)
 * - Déformation élastique liée à la vitesse du scroll + reformation à ressort
 * - Titres en "split words", images en volet directionnel
 * - Sons UI synthétisés (Web Audio API, 0 fichier) + bouton ON/OFF mémorisé
 * - Boutons : magnétisme, pression à ressort, onde, reflet
 * - Logo : décomposition / recomposition des lettres (S · flamme · i · p)
 * - Barre de progression, transition de sortie de page
 * Respecte prefers-reduced-motion.
 * ==========================================================================
 */
(function sipMotionPro() {
    'use strict';

    var currentScript = document.currentScript;
    var root = document.documentElement;
    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var finePointer = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);

    root.classList.add('mx-dir-down');

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    function store(method, key, value) {
        try { return method === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, value); } catch (e) { return null; }
    }

    // ----------------------------------------------------------------------
    // 0. Feuille motion-pro.css injectée en dernier (priorité dans la cascade)
    // ----------------------------------------------------------------------
    function cssHref() {
        var src = currentScript && currentScript.src ? currentScript.src : '';
        if (/js\/script\.js/.test(src)) return src.replace(/js\/script\.js(?:[?#].*)?$/, 'css/motion-pro.css');
        return (location.pathname.indexOf('/pages/') !== -1 ? '../' : '') + 'assets/css/motion-pro.css';
    }

    var cssReady = new Promise(function (resolve) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref();
        link.onload = function () { resolve(true); };
        link.onerror = function () { resolve(false); };
        document.head.appendChild(link);
        setTimeout(function () { resolve(true); }, 2500);
    });

    // ----------------------------------------------------------------------
    // 0b. Script water-motion.js injecté automatiquement sur TOUTES les pages
    // ----------------------------------------------------------------------
    function waterJsHref() {
        var src = currentScript && currentScript.src ? currentScript.src : '';
        if (/js\/script\.js/.test(src)) return src.replace(/js\/script\.js(?:[?#].*)?$/, 'js/water-motion.js');
        return (location.pathname.indexOf('/pages/') !== -1 ? '../' : '') + 'assets/js/water-motion.js';
    }

    if (!document.getElementById('sip-water-script') && !window.sipWaterEngineLoaded) {
        var wScript = document.createElement('script');
        wScript.id = 'sip-water-script';
        wScript.src = waterJsHref();
        wScript.async = true;
        (document.body || document.head || document.documentElement).appendChild(wScript);
    }

    // ----------------------------------------------------------------------
    // 1. Sons UI synthétisés (Web Audio API)
    // ----------------------------------------------------------------------
    var Sound = (function () {
        var ctx = null, master = null, noiseBuf = null;
        var muted = store('get', 'sipUiSound') === 'off';

        function ensure() {
            if (!ctx) {
                var AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return null;
                ctx = new AC();
                master = ctx.createGain();
                master.gain.value = 0.9;
                master.connect(ctx.destination);
                noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.4), ctx.sampleRate);
                var data = noiseBuf.getChannelData(0);
                for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            }
            if (ctx.state === 'suspended') ctx.resume();
            return ctx;
        }

        function tone(type, f0, f1, dur, vol, delay) {
            var t = ctx.currentTime + (delay || 0);
            var o = ctx.createOscillator();
            var g = ctx.createGain();
            o.type = type;
            o.frequency.setValueAtTime(f0, t);
            if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
            g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            o.connect(g);
            g.connect(master);
            o.start(t);
            o.stop(t + dur + 0.02);
        }

        function noise(dur, vol, fFrom, fTo, q, filterType) {
            var t = ctx.currentTime;
            var s = ctx.createBufferSource();
            s.buffer = noiseBuf;
            var f = ctx.createBiquadFilter();
            f.type = filterType || 'bandpass';
            f.Q.value = q || 1;
            f.frequency.setValueAtTime(fFrom, t);
            if (fTo) f.frequency.exponentialRampToValueAtTime(fTo, t + dur);
            var g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
            g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            s.connect(f);
            f.connect(g);
            g.connect(master);
            s.start(t);
            s.stop(t + dur + 0.02);
        }

        var presets = {
            // Bouton d'action : "tap" feutré + transitoire brillante
            click: function () { tone('sine', 640, 210, 0.07, 0.16); noise(0.025, 0.05, 3500, null, 0.8, 'highpass'); },
            // Lien / navigation : tic très léger
            tick: function () { tone('triangle', 1250, 950, 0.03, 0.05); },
            // Flèches du slider : souffle filtré
            whoosh: function () { noise(0.26, 0.09, 380, 2600, 1.2); },
            on: function () { tone('sine', 660, null, 0.09, 0.1); tone('sine', 990, null, 0.12, 0.1, 0.08); },
            off: function () { tone('sine', 880, null, 0.08, 0.08); tone('sine', 520, null, 0.12, 0.08, 0.07); }
        };

        return {
            play: function (name, force) {
                if (muted && !force) return;
                try {
                    if (!ensure()) return;
                    (presets[name] || presets.click)();
                } catch (e) { /* audio indisponible */ }
            },
            isMuted: function () { return muted; },
            setMuted: function (m) { muted = m; store('set', 'sipUiSound', m ? 'off' : 'on'); }
        };
    })();

    // ----------------------------------------------------------------------
    // 2. Boutons : magnétisme, pression, onde, reflet + sons
    // ----------------------------------------------------------------------
    var BTN_SEL = '.btn, .btn-primary, .btn-secondary, .btn-devis, .btn-ghost-white, .btn-contact, .overview-link, .cookies-btn, button[type="submit"]';
    var TAP_SEL = '.nav-menu a, .mobile-menu a, .slider-btn, .slider-dots .dot, .social-icon, .widget-toggle, .faq-question, .mobile-menu-toggle, footer a, input[type="submit"]';
    var ALL_SEL = BTN_SEL + ', ' + TAP_SEL;

    function magnet(el) {
        el.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse') return;
            var r = el.getBoundingClientRect();
            var x = clamp((e.clientX - (r.left + r.width / 2)) * 0.22, -10, 10);
            var y = clamp((e.clientY - (r.top + r.height / 2)) * 0.35, -7, 7);
            el.classList.add('mx-magnet-active');
            el.style.setProperty('--mx-tx', x.toFixed(1) + 'px');
            el.style.setProperty('--mx-ty', y.toFixed(1) + 'px');
        });
        el.addEventListener('pointerleave', function () {
            el.classList.remove('mx-magnet-active');
            el.style.setProperty('--mx-tx', '0px');
            el.style.setProperty('--mx-ty', '0px');
        });
    }

    function decorateButtons(scope) {
        (scope || document).querySelectorAll(BTN_SEL).forEach(function (el) {
            if (el.dataset.mxBtn || el.closest('.mx-sound-toggle')) return;
            el.dataset.mxBtn = '1';
            el.classList.add('mx-btn');
            if (getComputedStyle(el).position === 'static') el.classList.add('mx-btn-rel');
            var shine = document.createElement('span');
            shine.className = 'mx-btn-shine';
            shine.setAttribute('aria-hidden', 'true');
            el.appendChild(shine);
            if (finePointer && !reduceMotion) magnet(el);
        });
    }

    function ripple(el, e) {
        var r = el.getBoundingClientRect();
        var size = Math.max(r.width, r.height);
        var x = e && e.clientX ? e.clientX - r.left : r.width / 2;
        var y = e && e.clientY ? e.clientY - r.top : r.height / 2;
        var s = document.createElement('span');
        s.className = 'mx-ripple';
        s.setAttribute('aria-hidden', 'true');
        s.style.width = s.style.height = size + 'px';
        s.style.left = (x - size / 2) + 'px';
        s.style.top = (y - size / 2) + 'px';
        el.appendChild(s);
        setTimeout(function () { s.remove(); }, 700);
    }

    function bindInteractionFeedback() {
        // Son (phase de capture : joué avant toute navigation)
        document.addEventListener('click', function (e) {
            var t = e.target.closest && e.target.closest(ALL_SEL);
            if (!t || t.closest('.mx-sound-toggle')) return;
            var kind = t.matches('.slider-btn') ? 'whoosh' : (t.matches(BTN_SEL) ? 'click' : 'tick');
            Sound.play(kind);
        }, true);

        // Onde + pression à ressort (propriété `scale` indépendante de transform)
        document.addEventListener('pointerdown', function (e) {
            if (reduceMotion || e.button > 0) return;
            var t = e.target.closest && e.target.closest(ALL_SEL);
            if (!t || t.closest('.mx-sound-toggle')) return;
            if (t.classList.contains('mx-btn')) ripple(t, e);
            if (t.animate) {
                try {
                    t.animate([{ scale: '1' }, { scale: '0.93', offset: 0.35 }, { scale: '1' }],
                        { duration: 380, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
                } catch (err) { /* navigateur sans `scale` animable */ }
            }
        });
    }

    // ----------------------------------------------------------------------
    // 3. Révélation directionnelle rejouable
    // ----------------------------------------------------------------------
    var EXCLUDE = '.hero-slider, header, .page-header, .fuel-widget, .cookies-banner, .mobile-menu';
    var HEAD_SEL = 'main h2';
    var REVEAL_SEL = [
        '.about-grid > *', '.service-card', '.card', '.solution-card', '.stat-card', '.stat-item',
        '.partner-card', '.partner-stat', '.job-card', '.station-card', '.actualite-card', '.rse-pillar',
        '.feature-card', '.detail-card', '.value-card', '.cert-card', '.timeline-item', '.faq-item',
        '.news-grid > article', '.preview-content > *', '.lede', '.section-intro', '.services > p',
        '.contact-info > *', 'form .form-group', '.footer-section'
    ].join(', ');
    var SKEW_SEL = '.services-grid, .about-grid, .news-grid, .stations-grid, #stations-cards-mount, .cards-grid, .grid-2, .grid-3, .grid-4, .actualites-grid, .partners-grid, .rse-grid, .jobs-grid, .solutions-grid, .stats-grid, .values-grid';

    var dir = 'down';
    var showIO = null, hideIO = null;
    var doneTimers = new WeakMap();
    var skewTargets = [];

    function setDir(d) {
        if (d === dir) return;
        dir = d;
        root.classList.toggle('mx-dir-down', d === 'down');
        root.classList.toggle('mx-dir-up', d === 'up');
    }

    function show(el, delayMs) {
        if (el.classList.contains('mx-in')) return;
        el.classList.add('mx-in');
        clearTimeout(doneTimers.get(el));
        doneTimers.set(el, setTimeout(function () { el.classList.add('mx-done'); }, 1000 + delayMs));
    }

    function canSplit(h) {
        if (h.children.length || !h.textContent.trim()) return false;
        var cs = getComputedStyle(h);
        return cs.webkitBackgroundClip !== 'text' && cs.backgroundClip !== 'text';
    }

    function splitWords(h) {
        var text = h.textContent.trim().replace(/\s+/g, ' ');
        var words = text.split(' ');
        h.setAttribute('aria-label', text);
        h.textContent = '';
        words.forEach(function (w, i) {
            var outer = document.createElement('span');
            outer.className = 'mx-w';
            outer.setAttribute('aria-hidden', 'true');
            var inner = document.createElement('span');
            inner.textContent = w;
            inner.style.setProperty('--mx-wi', i);
            outer.appendChild(inner);
            h.appendChild(outer);
            if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
        });
        h.classList.add('mx-words');
    }

    function bind(el) {
        el.dataset.mxBound = '1';
        if (showIO) { showIO.observe(el); }
        else { el.classList.add('mx-in', 'mx-done'); }
    }

    var TITLE_SEL = 'main h2, .section-title, .page-header h1, .preview-content h2, .about-content h2, .services h2, .actualites-preview h2';
    var IMG_SEL = '.about-image, .service-image, .card-image, .station-image, .actualite-image, .news-image';
    var CARD_SEL = '.service-card, .news-card, .stat-card, .about-badge-floating, .slogan-pill';

    function initSpotlight() {
        if (!finePointer) return;
        document.addEventListener('mousemove', function (e) {
            var target = e.target.closest('[data-spotlight]');
            if (!target) return;
            var r = target.getBoundingClientRect();
            target.style.setProperty('--mouse-x', (e.clientX - r.left).toFixed(1) + 'px');
            target.style.setProperty('--mouse-y', (e.clientY - r.top).toFixed(1) + 'px');
        }, { passive: true });
    }

    function scan() {
        var altIndex = 0;

        document.querySelectorAll(TITLE_SEL).forEach(function (h) {
            if (h.dataset.mxBound || h.closest(EXCLUDE)) return;
            h.classList.add('mx-reveal-title');
            if (altIndex % 2 === 0) {
                h.classList.add('mx-from-left');
            } else {
                h.classList.add('mx-from-right');
            }
            altIndex++;
            bind(h);
        });

        document.querySelectorAll(IMG_SEL).forEach(function (imgEl) {
            if (imgEl.dataset.mxBound || imgEl.closest(EXCLUDE)) return;
            imgEl.classList.add('mx-reveal-img');
            if (altIndex % 2 === 0) {
                imgEl.classList.add('mx-from-left');
            } else {
                imgEl.classList.add('mx-from-right');
            }
            altIndex++;
            bind(imgEl);
        });

        document.querySelectorAll(CARD_SEL).forEach(function (card) {
            if (card.dataset.mxBound || card.closest(EXCLUDE)) return;
            bind(card);
        });

        decorateButtons();
    }

    function initReveal() {
        if (!('IntersectionObserver' in window) || reduceMotion) return;

        showIO = new IntersectionObserver(function (entries) {
            var batch = entries.filter(function (e) {
                return e.isIntersecting && !e.target.classList.contains('mx-in');
            }).map(function (e) {
                var r = e.target.getBoundingClientRect();
                return { el: e.target, top: Math.round(r.top / 12), left: r.left };
            });
            batch.sort(function (a, b) {
                var d = (a.top - b.top) || (a.left - b.left);
                return dir === 'down' ? d : -d;
            });
            batch.forEach(function (item, i) {
                var step = Math.min(i, 6);
                item.el.style.setProperty('--mx-d', step);
                show(item.el, step * 80);
                showIO.unobserve(item.el);
            });
        }, { threshold: [0, 0.05], rootMargin: '80px 0px 40px 0px' });
    }

    // ----------------------------------------------------------------------
    // 4. Scroll : sens, progression, déformation élastique (ressort)
    // ----------------------------------------------------------------------
    function initScroll() {
        var header = document.querySelector('header');
        var lastY = window.scrollY;
        var vel = 0, skew = 0, skewV = 0, rafId = 0;
        var MAX_SKEW = finePointer ? 3.2 : 1.6;

        function applySkew() {
            var t = skew === 0 ? '' :
                'skewY(' + (-skew).toFixed(3) + 'deg) scaleY(' + (1 + Math.abs(skew) * 0.006).toFixed(4) + ')';
            for (var i = 0; i < skewTargets.length; i++) skewTargets[i].style.transform = t;
        }

        function physics() {
            var target = clamp(vel * 0.09, -MAX_SKEW, MAX_SKEW);
            skewV += (target - skew) * 0.14;   // raideur du ressort
            skewV *= 0.74;                     // amortissement (léger rebond à l'arrêt)
            skew += skewV;
            vel *= 0.82;
            if (Math.abs(skew) < 0.005 && Math.abs(skewV) < 0.005 && Math.abs(vel) < 0.2) {
                skew = 0; skewV = 0;
                applySkew();
                rafId = 0;
                return;
            }
            applySkew();
            rafId = requestAnimationFrame(physics);
        }

        function onScroll() {
            var y = window.scrollY;
            var d = y - lastY;
            lastY = y;
            if (d > 1) setDir('down');
            else if (d < -1) setDir('up');
            vel = d;

            if (header) header.classList.toggle('header-scrolled', y > 25);

            if (!reduceMotion && !rafId && skewTargets.length) rafId = requestAnimationFrame(physics);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ----------------------------------------------------------------------
    // 5. Logo : décomposition / recomposition des lettres
    // ----------------------------------------------------------------------
    function initLogo() {
        var img = document.querySelector('header .logo img');
        if (!img || img.closest('.mx-logo') || reduceMotion || !img.animate) return;

        var wrap = document.createElement('span');
        wrap.className = 'mx-logo';
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);

        var layer = document.createElement('span');
        layer.className = 'mx-logo-layer';
        layer.setAttribute('aria-hidden', 'true');

        // Découpe calée sur LOGOSIP2.png : S | flamme | i | p
        var defs = [
            { clip: 'inset(0 66% 0 0)', origin: '17% 50%',
              burst: 'translate(-42%, 16%) rotate(-32deg) scale(0.7)', nudge: 'translate(-7%, 0) rotate(-7deg)' },
            { clip: 'inset(0 41% 65% 33%)', origin: '45% 17%',
              burst: 'translate(32%, -42%) rotate(28deg) scale(1.35)', nudge: 'translate(0, -14%) scale(1.12)' },
            { clip: 'inset(33% 42% 0 32%)', origin: '45% 66%',
              burst: 'translate(-6%, 70%) rotate(-14deg) scale(0.8)', nudge: 'translate(0, 6%)' },
            { clip: 'inset(0 0 0 57%)', origin: '78% 50%',
              burst: 'translate(46%, 18%) rotate(26deg) scale(0.75)', nudge: 'translate(7%, 0) rotate(7deg)' }
        ];
        var src = img.currentSrc || img.src;
        var pieces = defs.map(function (d) {
            var p = document.createElement('span');
            p.className = 'mx-logo-piece';
            p.style.clipPath = d.clip;
            p.style.webkitClipPath = d.clip;
            p.style.transformOrigin = d.origin;
            var copy = document.createElement('img');
            copy.src = src;
            copy.alt = '';
            p.appendChild(copy);
            layer.appendChild(p);
            return { el: p, d: d };
        });

        var shine = document.createElement('span');
        shine.className = 'mx-logo-shine';
        shine.setAttribute('aria-hidden', 'true');
        wrap.appendChild(layer);
        wrap.appendChild(shine);

        var busy = false;
        var ORDER = [1, 0, 3, 2]; // la flamme revient en premier

        function run(kind) {
            if (busy) return;
            busy = true;
            wrap.classList.add('mx-animating');

            var decompose = Promise.resolve();
            if (kind === 'full') {
                decompose = Promise.all(pieces.map(function (p, i) {
                    return p.el.animate([
                        { transform: 'none', opacity: 1, filter: 'blur(0px)' },
                        { transform: p.d.burst, opacity: 0.12, filter: 'blur(3px)' }
                    ], { duration: 620, delay: 380 + i * 45, easing: 'cubic-bezier(0.7, 0, 0.84, 0)', fill: 'forwards' }).finished;
                }));
            }

            decompose.then(function () {
                return Promise.all(pieces.map(function (p, i) {
                    var hover = kind === 'hover';
                    var frames = hover
                        ? [{ transform: 'none' }, { transform: p.d.nudge, offset: 0.35 }, { transform: 'none' }]
                        : [{ transform: p.d.burst, opacity: kind === 'full' ? 0.12 : 0, filter: 'blur(3px)' },
                           { transform: 'none', opacity: 1, filter: 'blur(0px)' }];
                    return p.el.animate(frames, {
                        duration: hover ? 650 : 950,
                        delay: (kind === 'full' ? 140 : 0) + ORDER[i] * 80,
                        easing: hover ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.34, 1.45, 0.64, 1)',
                        fill: 'both'
                    }).finished;
                }));
            }).then(function () {
                if (kind === 'hover') return null;
                return shine.animate([
                    { transform: 'translate3d(-130%, 0, 0)', opacity: 0 },
                    { opacity: 1, offset: 0.3 },
                    { transform: 'translate3d(130%, 0, 0)', opacity: 0 }
                ], { duration: 750, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }).finished;
            }).catch(function () { /* animation interrompue */ }).then(function () {
                pieces.forEach(function (p) { p.el.getAnimations().forEach(function (a) { a.cancel(); }); });
                wrap.classList.remove('mx-animating');
                busy = false;
            });
        }

        // Animation complète au rechargement / 1re visite, version courte entre pages
        var navEntry = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
        var isReload = navEntry ? navEntry.type === 'reload' : !!(performance.navigation && performance.navigation.type === 1);
        var seen = null;
        try { seen = sessionStorage.getItem('sipLogoSeen'); sessionStorage.setItem('sipLogoSeen', '1'); } catch (e) { /* stockage bloqué */ }
        var kind = (isReload || !seen) ? 'full' : 'short';

        if (img.complete) run(kind);
        else img.addEventListener('load', function () { run(kind); }, { once: true });

        var link = wrap.closest('a');
        if (finePointer && link) link.addEventListener('mouseenter', function () { run('hover'); });
    }

    // ----------------------------------------------------------------------
    // 6. Transition de sortie de page (liens internes)
    // ----------------------------------------------------------------------
    function initPageLeave() {
        if (reduceMotion) return;
        document.addEventListener('click', function (e) {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            var a = e.target.closest && e.target.closest('a[href]');
            if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
            var href = a.getAttribute('href');
            if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
            var url;
            try { url = new URL(a.href, location.href); } catch (err) { return; }
            if (url.protocol !== location.protocol || url.host !== location.host) return;
            if (url.pathname === location.pathname && url.hash) return;
            e.preventDefault();
            root.classList.add('mx-leaving');
            setTimeout(function () { location.href = a.href; }, 300);
        });
        window.addEventListener('pageshow', function () { root.classList.remove('mx-leaving'); });
    }

    // ----------------------------------------------------------------------
    // 7. Compteurs progressifs (count-up)
    // ----------------------------------------------------------------------
    function initCountUp() {
        var nodes = document.querySelectorAll('.partner-stat .number, .stat-item .stat-number, .stat-card .stat-number, .stat-card h3, [data-counter]');
        if (!nodes.length || reduceMotion || !('IntersectionObserver' in window)) return;

        function animateNumber(el) {
            var target = parseInt(el.dataset.targetNum || el.dataset.counter, 10);
            var start = performance.now();
            function frame(now) {
                var p = Math.min((now - start) / 1200, 1);
                var eased = 1 - Math.pow(1 - p, 4);
                el.textContent = (el.dataset.prefix || '') + Math.floor(eased * target) + (el.dataset.suffix || '');
                if (p < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }

        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { animateNumber(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.2 });

        nodes.forEach(function (el) {
            var raw = el.dataset.counter ? el.dataset.counter : el.textContent.trim();
            var m = raw.match(/^([^\d]*)(\d+)([^\d]*)$/);
            if (!m) return;
            el.dataset.targetNum = m[2];
            el.dataset.prefix = el.dataset.prefix || m[1] || '';
            el.dataset.suffix = el.dataset.suffix || m[3] || '';
            io.observe(el);
        });
    }

    // ----------------------------------------------------------------------
    // Démarrage
    // ----------------------------------------------------------------------
    function start() {
        if (!reduceMotion) root.classList.add('mx-ready');
        document.querySelectorAll('.mx-sound-toggle, .sip-audio-indicator').forEach(function (el) { el.remove(); });
        bindInteractionFeedback();
        initSpotlight();
        initReveal();
        scan();
        initScroll();
        initLogo();
        initPageLeave();
        initCountUp();

        // Contenus injectés plus tard (stations.json, actualités…)
        var scanTimer = 0;
        new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes.length) {
                    clearTimeout(scanTimer);
                    scanTimer = setTimeout(scan, 150);
                    return;
                }
            }
        }).observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
    }

    function onReady(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    onReady(function () { cssReady.then(start); });
})();
