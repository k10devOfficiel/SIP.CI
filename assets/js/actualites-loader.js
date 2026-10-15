/**
 * Charge les actualités depuis data/actualites.json :
 * - [data-actualites-preview] : grille compacte (accueil)
 * - [data-actualites-cards] : cartes avec image (page Actualités)
 */
(function () {
    var DEFAULT_CARD_IMAGES = [
        'assets/images/sipimg2.jpg',
        'assets/images/sipimg4.jpg',
        'assets/images/sipimg3.jpg',
    ];

    function dataBasePath() {
        return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : '';
    }

    function resolveJsonUrl(el) {
        var raw = el.getAttribute('data-actualites-json');
        if (!raw) return dataBasePath() + 'data/actualites.json';
        try {
            return new URL(raw, window.location.href).href;
        } catch (e) {
            return raw;
        }
    }

    /** Limite pour l’aperçu accueil (défaut 3). */
    function parseLimitPreview(el) {
        var n = parseInt(el.getAttribute('data-limit'), 10);
        return Number.isFinite(n) && n > 0 ? n : 3;
    }

    /** Pour les cartes : pas d’attribut data-limit ou valeur ≤ 0 = toutes les entrées. */
    function parseLimitCards(el) {
        if (!el.hasAttribute('data-limit')) return Infinity;
        var n = parseInt(el.getAttribute('data-limit'), 10);
        if (!Number.isFinite(n) || n <= 0) return Infinity;
        return n;
    }

    function sortByDateDesc(items) {
        return items.slice().sort(function (a, b) {
            var da = (a.date || '').localeCompare(b.date || '');
            return da < 0 ? 1 : da > 0 ? -1 : 0;
        });
    }

    function resolveImageSrc(item, index) {
        var img = item && typeof item.image === 'string' ? item.image.trim() : '';
        var base = dataBasePath();
        if (!img) {
            return base + DEFAULT_CARD_IMAGES[index % DEFAULT_CARD_IMAGES.length];
        }
        if (/^https?:\/\//i.test(img)) return img;
        if (img.indexOf('../') === 0) return img;
        return base + img.replace(/^\//, '');
    }

    function resolveReadMoreHref(item) {
        var u = item && typeof item.readMoreUrl === 'string' ? item.readMoreUrl.trim() : '';
        if (!u) return 'contact.html';
        if (/^https?:\/\//i.test(u)) return u;
        if (u.charAt(0) === '#' || u.indexOf('../') === 0) return u;
        return u;
    }

    function renderPreview(container, items, limit) {
        container.innerHTML = '';
        var slice = sortByDateDesc(items).slice(0, limit);
        slice.forEach(function (item) {
            var article = document.createElement('article');
            article.className = 'news-card';

            var header = document.createElement('div');
            header.className = 'news-card-header';

            var dateEl = document.createElement('p');
            dateEl.className = 'news-date';
            dateEl.innerHTML = '<i class="fa-regular fa-calendar"></i> ' + (item.dateLabel || item.date || '');

            header.appendChild(dateEl);

            var titleEl = document.createElement('h3');
            titleEl.textContent = item.title || '';

            var excerptEl = document.createElement('p');
            excerptEl.textContent = item.excerpt || '';

            var linkEl = document.createElement('a');
            linkEl.className = 'news-read-more';
            linkEl.href = dataBasePath() + (dataBasePath() ? 'actualites.html' : 'pages/actualites.html');
            linkEl.innerHTML = '<span>Lire le communiqué</span> <i class="fa-solid fa-arrow-right"></i>';

            article.appendChild(header);
            article.appendChild(titleEl);
            article.appendChild(excerptEl);
            article.appendChild(linkEl);
            container.appendChild(article);
        });
    }

    function renderCards(container, items, limit) {
        container.innerHTML = '';
        var sorted = sortByDateDesc(items);
        var slice = Number.isFinite(limit) && limit !== Infinity ? sorted.slice(0, limit) : sorted;

        slice.forEach(function (item, idx) {
            var article = document.createElement('article');
            article.className = 'card';
            article.style.padding = '0';
            article.style.overflow = 'hidden';

            var media = document.createElement('div');
            media.style.height = '200px';
            media.style.overflow = 'hidden';

            var img = document.createElement('img');
            img.src = resolveImageSrc(item, idx);
            img.alt = '';
            if (item.title) img.alt = String(item.title);
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';

            media.appendChild(img);

            var body = document.createElement('div');
            body.style.padding = '1.5rem';

            var dateEl = document.createElement('p');
            dateEl.style.color = 'var(--sky-blue)';
            dateEl.style.fontSize = '0.9rem';
            dateEl.style.fontWeight = '600';
            dateEl.textContent = item.dateLabel || item.date || '';

            var titleEl = document.createElement('h3');
            titleEl.style.margin = '0.5rem 0';
            titleEl.textContent = item.title || '';

            var excerptEl = document.createElement('p');
            excerptEl.style.color = 'var(--muted-text)';
            excerptEl.textContent = item.excerpt || '';

            var link = document.createElement('a');
            link.href = resolveReadMoreHref(item);
            link.className = 'btn btn-sm btn-outline';
            link.style.marginTop = '1rem';
            link.textContent = 'Lire la suite';

            body.appendChild(dateEl);
            body.appendChild(titleEl);
            body.appendChild(excerptEl);
            body.appendChild(link);

            article.appendChild(media);
            article.appendChild(body);
            container.appendChild(article);
        });
    }

    function showFallbackPreview(container) {
        if (container && container.children && container.children.length > 0) return;
        container.innerHTML =
            '<p class="news-date" role="status">Actualités</p>' +
            '<p>Les actualités ne peuvent pas être chargées pour le moment. Veuillez réessayer plus tard.</p>';
    }

    function showFallbackCards(container) {
        if (container && container.children && container.children.length > 0) return;
        container.innerHTML =
            '<p class="section-intro text-center" role="status" style="grid-column: 1 / -1;">Les actualités ne peuvent pas être chargées pour le moment. Veuillez réessayer plus tard.</p>';
    }

    document.addEventListener('DOMContentLoaded', function () {
        var previews = document.querySelectorAll('[data-actualites-preview]');
        previews.forEach(function (container) {
            var url = resolveJsonUrl(container);
            var limit = parseLimitPreview(container);

            fetch(url, { credentials: 'same-origin' })
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(function (data) {
                    var items = Array.isArray(data.items) ? data.items : [];
                    if (!items.length) {
                        container.innerHTML = '';
                        return;
                    }
                    renderPreview(container, items, limit);
                })
                .catch(function (err) {
                    console.error('[actualites-loader]', err);
                    showFallbackPreview(container);
                });
        });

        var cards = document.querySelectorAll('[data-actualites-cards]');
        cards.forEach(function (container) {
            var url = resolveJsonUrl(container);
            var limit = parseLimitCards(container);

            fetch(url, { credentials: 'same-origin', cache: 'no-store' })
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(function (data) {
                    var items = Array.isArray(data.items) ? data.items : [];
                    if (!items.length) {
                        container.innerHTML =
                            '<p class="section-intro text-center" style="grid-column: 1 / -1;">Aucune publication pour le moment.</p>';
                        return;
                    }
                    renderCards(container, items, limit);
                })
                .catch(function (err) {
                    console.error('[actualites-loader]', err);
                    showFallbackCards(container);
                });
        });
    });
})();
