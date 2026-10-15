const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../pages');

const HEADER_CONFIGS = {
    'produits-services.html': {
        headerClass: 'page-header page-header-produits',
        badge: {
            icon: 'fa-solid fa-gas-pump',
            text: 'Distribution Pétrolière & Industrielle · Côte d\'Ivoire'
        },
        title: 'Nos Produits & <span class="text-gradient-flame">Services</span>',
        lead: 'Carburants certifiés, lubrifiants haute performance et solutions énergétiques complètes pour flottes, particuliers et industries.',
        highlights: [
            { icon: 'fa-solid fa-droplet', title: 'Carburants Certifiés', subtitle: 'Super & Gasoil contrôlés en continu' },
            { icon: 'fa-solid fa-truck-fast', title: 'Logistique Sécurisée', subtitle: 'Livraison & approvisionnement 24/7' },
            { icon: 'fa-solid fa-shield-halved', title: 'Norme ISO 9001', subtitle: 'Contrôle qualité en temps réel' }
        ]
    },
    'stations.html': {
        headerClass: 'page-header page-header-stations',
        badge: {
            icon: 'fa-solid fa-location-dot',
            text: 'Réseau National · Ouvert 24h/24 & 7j/7'
        },
        title: 'Nos Stations <span class="text-gradient-flame">en Côte d\'Ivoire</span>',
        lead: 'Découvrez notre réseau national de stations-service modernes, performantes et sécurisées, prêtes à vous servir partout.',
        highlights: [
            { icon: 'fa-solid fa-store', title: '+10 Stations-Service', subtitle: 'Abidjan et intérieur du pays' },
            { icon: 'fa-solid fa-clock', title: 'Service 24h/24', subtitle: 'Carburants, boutiques & entretien' },
            { icon: 'fa-solid fa-credit-card', title: 'Espace Fidélité', subtitle: 'Gestion de flotte connectée' }
        ]
    },
    'apropos.html': {
        headerClass: 'page-header page-header-apropos',
        badge: {
            icon: 'fa-solid fa-landmark',
            text: 'Histoire & Valeurs d\'Excellence · Depuis 1998'
        },
        title: 'À Propos de la <span class="text-gradient-flame">SIP</span>',
        lead: 'Société Ivoirienne de Pétrole : plus de 25 ans d\'engagement, d\'expertise industrielle et d\'énergie au cœur de la route.',
        highlights: [
            { icon: 'fa-solid fa-calendar-check', title: 'Fondée en 1998', subtitle: 'Plus de 25 ans d\'expérience reconnue' },
            { icon: 'fa-solid fa-award', title: 'Triple Certification', subtitle: 'ISO 9001 · 14001 · 45001' },
            { icon: 'fa-solid fa-users', title: 'Capital 100% Ivoirien', subtitle: 'Engagement citoyen et proximité locale' }
        ]
    },
    'actualites.html': {
        headerClass: 'page-header page-header-actualites',
        badge: {
            icon: 'fa-solid fa-newspaper',
            text: 'Espace Presse & Vie du Réseau'
        },
        title: 'Actualités & <span class="text-gradient-flame">Événements</span>',
        lead: 'Restez informés des dernières innovations, inaugurations de stations et actualités énergétiques de la Société Ivoirienne de Pétrole.',
        highlights: [
            { icon: 'fa-solid fa-bell', title: 'Publications 2026', subtitle: 'Communiqués et vie du réseau' },
            { icon: 'fa-solid fa-chart-line', title: 'Prix Officiels', subtitle: 'Barèmes et cours mensuels' },
            { icon: 'fa-solid fa-handshake', title: 'Expansion Continue', subtitle: 'Nouveaux sites et partenariats' }
        ]
    },
    'contact.html': {
        headerClass: 'page-header page-header-contact',
        badge: {
            icon: 'fa-solid fa-headset',
            text: 'Service Client & Support Dédié'
        },
        title: 'Contactez <span class="text-gradient-flame">Nos Équipes</span>',
        lead: 'Une question, un partenariat, une demande de devis ou un projet de franchise ? Nos conseillers sont à votre écoute.',
        highlights: [
            { icon: 'fa-solid fa-phone', title: '27 21 39 55 01', subtitle: 'Du lundi au vendredi 8h-18h' },
            { icon: 'fa-solid fa-envelope', title: 'commercial@sip-ci.com', subtitle: 'Réponse et devis sous 24h' },
            { icon: 'fa-solid fa-location-dot', title: 'Treichville, Abidjan', subtitle: 'Boulevard Félix Houphouët Boigny' }
        ]
    },
    'certifications.html': {
        headerClass: 'page-header page-header-certifications',
        badge: {
            icon: 'fa-solid fa-award',
            text: 'Standards Internationaux & Conformité'
        },
        title: 'Certifications & <span class="text-gradient-flame">Normes Qualité</span>',
        lead: 'Notre engagement d\'excellence pour la qualité des produits, la sécurité des personnes et la préservation de l\'environnement.',
        highlights: [
            { icon: 'fa-solid fa-certificate', title: 'ISO 9001:2015', subtitle: 'Système de management qualité' },
            { icon: 'fa-solid fa-leaf', title: 'ISO 14001:2015', subtitle: 'Management environnemental audité' },
            { icon: 'fa-solid fa-shield-halved', title: 'ISO 45001:2018', subtitle: 'Santé et sécurité au travail' }
        ]
    },
    'rse.html': {
        headerClass: 'page-header page-header-rse',
        badge: {
            icon: 'fa-solid fa-seedling',
            text: 'Développement Durable & Citoyenneté'
        },
        title: 'Notre Démarche & <span class="text-gradient-flame">Charte RSE</span>',
        lead: 'Construire une énergie plus propre, plus sûre et plus solidaire en intégrant les enjeux sociétaux au cœur de chaque station SIP.',
        highlights: [
            { icon: 'fa-solid fa-list-check', title: 'Charte en 5 Étapes', subtitle: 'Feuille de route stratégique claire' },
            { icon: 'fa-solid fa-earth-africa', title: 'Impact Local Positif', subtitle: 'Actions concrètes de proximité' },
            { icon: 'fa-solid fa-shield-virus', title: 'Sécurité Maximale', subtitle: 'Équipements et protocoles stricts' }
        ]
    },
    'devis.html': {
        headerClass: 'page-header page-header-devis',
        badge: {
            icon: 'fa-solid fa-file-invoice',
            text: 'Offres Commerciales & Tarifs B2B'
        },
        title: 'Demande de <span class="text-gradient-flame">Devis sur Mesure</span>',
        lead: 'Flottes d\'entreprises, transporteurs, industriels et revendeurs : bénéficiez d\'une tarification dégressive et d\'un approvisionnement sécurisé.',
        highlights: [
            { icon: 'fa-solid fa-bolt', title: 'Réponse Rapide', subtitle: 'Proposition chiffrée sous 24 à 48h' },
            { icon: 'fa-solid fa-tags', title: 'Tarifs Dégressifs', subtitle: 'Volumes carburants & lubrifiants' },
            { icon: 'fa-solid fa-truck', title: 'Livraison sur Site', subtitle: 'Flotte logistique dédiée SIP' }
        ]
    },
    'recrutement.html': {
        headerClass: 'page-header page-header-recrutement',
        badge: {
            icon: 'fa-solid fa-user-plus',
            text: 'Carrières & Talents Pétroliers'
        },
        title: 'Rejoindre <span class="text-gradient-flame">Nos Équipes</span>',
        lead: 'Développez votre carrière au sein d\'un acteur énergétique de référence : formation continue, opportunités et culture d\'excellence.',
        highlights: [
            { icon: 'fa-solid fa-briefcase', title: 'Postes Diversifiés', subtitle: 'Opérations, stations et siège' },
            { icon: 'fa-solid fa-graduation-cap', title: 'Formation Continue', subtitle: 'Développement des compétences' },
            { icon: 'fa-solid fa-heart-pulse', title: 'Norme ISO 45001', subtitle: 'Environnement de travail protégé' }
        ]
    }
};

function generateBannerHtml(config) {
    const highlightsHtml = config.highlights.map(h => `
                    <div class="header-highlight-item">
                        <i class="${h.icon}"></i>
                        <div>
                            <strong>${h.title}</strong>
                            <span>${h.subtitle}</span>
                        </div>
                    </div>`).join('');

    return `<section class="${config.headerClass}">
            <div class="page-main">
                <h1>${config.title}</h1>
                <p>${config.lead}</p>
                <div class="page-header-highlights">${highlightsHtml}
                </div>
            </div>
        </section>`;
}

for (const [filename, config] of Object.entries(HEADER_CONFIGS)) {
    const filePath = path.join(PAGES_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping missing file: ${filename}`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace existing page-header section
    const bannerRegex = /<section class="page-header[\s\S]*?<\/section>/;
    if (bannerRegex.test(content)) {
        content = content.replace(bannerRegex, generateBannerHtml(config));
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated page banner in: ${filename}`);
    } else {
        console.log(`Could not find <section class="page-header"> in: ${filename}`);
    }
}

console.log("All page headers updated successfully!");
