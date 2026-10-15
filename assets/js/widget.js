/**
 * Widget Prix Carburants — SIP
 *
 * Source des montants : fichier `data/fuel-prices.json` à la racine du site
 * (`/data/fuel-prices.json` depuis l’accueil, `../data/fuel-prices.json` depuis /pages/).
 *
 * Mise à jour mensuelle : modifier uniquement ce JSON (super, gasoil, petrole, date).
 * Aucune modification du JavaScript ni des pages HTML n’est nécessaire.
 */

const DEFAULT_FUEL_PRICES = {
    super: 820,
    gasoil: 675,
    petrole: 720,
    date: 'Mai 2026'
};

function getWebsiteDataBasePath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    return path.includes('/pages/') ? '../' : '';
}

function formatPriceLabel(value) {
    if (value == null || value === '') return '—';
    const n = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
    if (Number.isNaN(n)) return String(value);
    return Number.isInteger(n)
        ? String(n)
        : n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function toggleWidget() {
    const widget = document.getElementById('fuel-widget');
    if (!widget) return;

    const icon = widget.querySelector('.toggle-icon');
    widget.classList.toggle('minimized');

    if (icon) {
        icon.textContent = widget.classList.contains('minimized') ? '+' : '−';
    }

    const isMinimized = widget.classList.contains('minimized');
    localStorage.setItem('fuelWidgetMinimized', isMinimized ? 'true' : 'false');
}

function createFuelWidget(prices) {
    const p = { ...DEFAULT_FUEL_PRICES, ...prices };

    if (document.getElementById('fuel-widget')) {
        updateFuelPrices(p);
        return;
    }

    const widgetHTML = `
        <div id="fuel-widget" class="fuel-widget">
            <div class="widget-header">
                <h4>Prix Carburants</h4>
                <button type="button" class="widget-toggle" onclick="toggleWidget()" aria-label="Réduire ou agrandir le widget">
                    <span class="toggle-icon">−</span>
                </button>
            </div>
            <div class="widget-content">
                <div class="widget-item">
                    <span class="widget-fuel">Super</span>
                    <span class="widget-price">${formatPriceLabel(p.super)} <small>FCFA/L</small></span>
                </div>
                <div class="widget-item">
                    <span class="widget-fuel">Gasoil</span>
                    <span class="widget-price">${formatPriceLabel(p.gasoil)} <small>FCFA/L</small></span>
                </div>
                <div class="widget-item">
                    <span class="widget-fuel">Pétrole</span>
                    <span class="widget-price">${formatPriceLabel(p.petrole)} <small>FCFA/L</small></span>
                </div>
                <p class="widget-date">${escapeHtml(String(p.date || ''))}</p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateFuelPrices(prices) {
    const widget = document.getElementById('fuel-widget');
    if (!widget) return;

    const items = widget.querySelectorAll('.widget-item');

    if (prices.super != null && items[0]) {
        items[0].querySelector('.widget-price').innerHTML = `${formatPriceLabel(prices.super)} <small>FCFA/L</small>`;
    }
    if (prices.gasoil != null && items[1]) {
        items[1].querySelector('.widget-price').innerHTML = `${formatPriceLabel(prices.gasoil)} <small>FCFA/L</small>`;
    }
    if (prices.petrole != null && items[2]) {
        items[2].querySelector('.widget-price').innerHTML = `${formatPriceLabel(prices.petrole)} <small>FCFA/L</small>`;
    }
    if (prices.date != null) {
        const dateEl = widget.querySelector('.widget-date');
        if (dateEl) dateEl.textContent = prices.date;
    }
}

function applyMinimizedState() {
    const widget = document.getElementById('fuel-widget');
    if (!widget) return;

    const isMinimized = localStorage.getItem('fuelWidgetMinimized') === 'true';
    if (isMinimized) {
        widget.classList.add('minimized');
        const icon = widget.querySelector('.toggle-icon');
        if (icon) icon.textContent = '+';
    }
}

async function loadFuelPricesJson() {
    const url = `${getWebsiteDataBasePath()}data/fuel-prices.json`;
    try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn('[fuel-widget] Lecture des prix impossible, valeurs par défaut utilisées.', err);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    createFuelWidget(DEFAULT_FUEL_PRICES);
    applyMinimizedState();

    const data = await loadFuelPricesJson();
    if (data && typeof data === 'object') {
        updateFuelPrices({
            super: data.super,
            gasoil: data.gasoil,
            petrole: data.petrole,
            date: data.date
        });
    }
});
