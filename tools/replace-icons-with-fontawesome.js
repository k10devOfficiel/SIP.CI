const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const pagesDir = path.join(rootDir, 'pages');

// Helper to replace all occurrences in a file
function updateFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const [search, replace] of replacements) {
        if (typeof search === 'string') {
            content = content.split(search).join(replace);
        } else if (search instanceof RegExp) {
            content = content.replace(search, replace);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated icons in: ${path.basename(filePath)}`);
    } else {
        console.log(`No icon changes needed in: ${path.basename(filePath)}`);
    }
}

// 1. Universal Chatbot Widget replacements across all pages
const chatbotReplacements = [
    [ '<h4>🤖 Assistant SIP</h4>', '<h4><i class="fa-solid fa-headset" style="margin-right: 0.5rem;"></i> Assistant SIP</h4>' ],
    [ '<button class="chatbot-send" aria-label="Envoyer">➤</button>', '<button class="chatbot-send" aria-label="Envoyer"><i class="fa-solid fa-paper-plane"></i></button>' ],
    [ '<button class="chatbot-toggle" aria-label="Ouvrir le chat">💬</button>', '<button class="chatbot-toggle" aria-label="Ouvrir le chat"><i class="fa-solid fa-comment-dots"></i></button>' ],
    [ '<button class="chatbot-close" aria-label="Fermer">×</button>', '<button class="chatbot-close" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>' ]
];

// Apply chatbot replacements to all files in pages/ and index.html
const allHtmlFiles = [
    path.join(rootDir, 'index.html'),
    ...fs.readdirSync(pagesDir).filter(f => f.endsWith('.html') && !f.startsWith('old_')).map(f => path.join(pagesDir, f))
];

allHtmlFiles.forEach(f => updateFile(f, chatbotReplacements));

// 2. index.html Slider Buttons
updateFile(path.join(rootDir, 'index.html'), [
    [ '<button class="slider-btn prev" onclick="changeSlide(-1)">❮</button>', '<button class="slider-btn prev" onclick="changeSlide(-1)" aria-label="Précédent"><i class="fa-solid fa-chevron-left"></i></button>' ],
    [ '<button class="slider-btn next" onclick="changeSlide(1)">❯</button>', '<button class="slider-btn next" onclick="changeSlide(1)" aria-label="Suivant"><i class="fa-solid fa-chevron-right"></i></button>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 3. contact.html
updateFile(path.join(pagesDir, 'contact.html'), [
    [ '<h3>📞 Nos coordonnées</h3>', '<h3><i class="fa-solid fa-address-book" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Nos coordonnées</h3>' ],
    [ '<span class="contact-icon">📱</span>', '<span class="contact-icon"><i class="fa-solid fa-phone"></i></span>' ],
    [ '<span class="contact-icon">✉️</span>', '<span class="contact-icon"><i class="fa-solid fa-envelope"></i></span>' ],
    [ '<span class="contact-icon">📍</span>', '<span class="contact-icon"><i class="fa-solid fa-location-dot"></i></span>' ],
    [ '<h3>📍 Localisation du siège</h3>', '<h3><i class="fa-solid fa-map-location-dot" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Localisation du siège</h3>' ],
    [ 'Envoyer le message →', 'Envoyer le message <i class="fa-solid fa-paper-plane" style="margin-left: 0.5rem;"></i>' ],
    [ 'Accéder à l’espace client →', 'Accéder à l’espace client <i class="fa-solid fa-arrow-right" style="margin-left: 0.5rem;"></i>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 4. apropos.html
updateFile(path.join(pagesDir, 'apropos.html'), [
    [ '<div class="value-icon">🛡️</div>', '<div class="value-icon"><i class="fa-solid fa-shield-halved"></i></div>' ],
    [ '<div class="value-icon">✅</div>', '<div class="value-icon"><i class="fa-solid fa-circle-check"></i></div>' ],
    [ '<div class="value-icon">🤝</div>', '<div class="value-icon"><i class="fa-solid fa-handshake"></i></div>' ],
    [ '<div class="value-icon">🌱</div>', '<div class="value-icon"><i class="fa-solid fa-leaf"></i></div>' ],
    [ '<div class="value-icon">💡</div>', '<div class="value-icon"><i class="fa-solid fa-lightbulb"></i></div>' ],
    [ '<div class="value-icon">⭐</div>', '<div class="value-icon"><i class="fa-solid fa-star"></i></div>' ],
    [ '<div class="cert-icon">🏆</div>', '<div class="cert-icon"><i class="fa-solid fa-trophy"></i></div>' ],
    [ '<div class="cert-icon">🌿</div>', '<div class="cert-icon"><i class="fa-solid fa-leaf"></i></div>' ],
    [ '<div class="cert-icon">⚡</div>', '<div class="cert-icon"><i class="fa-solid fa-bolt"></i></div>' ],
    [ '<div class="cert-icon">🤝</div>', '<div class="cert-icon"><i class="fa-solid fa-handshake-angle"></i></div>' ],
    [ 'Rejoindre le réseau SIP →', 'Rejoindre le réseau SIP <i class="fa-solid fa-arrow-right" style="margin-left: 0.5rem;"></i>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 5. actualites.html
updateFile(path.join(pagesDir, 'actualites.html'), [
    [ '<div style="font-size: 3rem; margin-bottom: 1rem;">📢</div>', '<div class="feature-icon" style="font-size: 2.5rem; color: var(--sip-red); margin-bottom: 1rem;"><i class="fa-solid fa-bullhorn"></i></div>' ],
    [ '<div style="font-size: 3rem; margin-bottom: 1rem;">🌱</div>', '<div class="feature-icon" style="font-size: 2.5rem; color: var(--sip-red); margin-bottom: 1rem;"><i class="fa-solid fa-seedling"></i></div>' ],
    [ '<div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>', '<div class="feature-icon" style="font-size: 2.5rem; color: var(--sip-red); margin-bottom: 1rem;"><i class="fa-solid fa-users"></i></div>' ],
    [ 'Nous contacter →', 'Nous contacter <i class="fa-solid fa-arrow-right" style="margin-left: 0.5rem;"></i>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 6. certifications.html
updateFile(path.join(pagesDir, 'certifications.html'), [
    [ '<div class="cert-icon">🏆</div>', '<div class="cert-icon"><i class="fa-solid fa-award"></i></div>' ],
    [ '<div class="cert-icon">🛡️</div>', '<div class="cert-icon"><i class="fa-solid fa-shield-halved"></i></div>' ],
    [ '<div class="cert-icon">⚡</div>', '<div class="cert-icon"><i class="fa-solid fa-bolt"></i></div>' ],
    [ '<div class="cert-icon">📊</div>', '<div class="cert-icon"><i class="fa-solid fa-chart-line"></i></div>' ],
    [ '<div class="cert-icon">✅</div>', '<div class="cert-icon"><i class="fa-solid fa-circle-check"></i></div>' ],
    [ '<div class="cert-icon">🔒</div>', '<div class="cert-icon"><i class="fa-solid fa-lock"></i></div>' ],
    [ '<h4>✓ Traçabilité totale</h4>', '<h4><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Traçabilité totale</h4>' ],
    [ '<h4>✓ Analyses en laboratoire</h4>', '<h4><i class="fa-solid fa-flask" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Analyses en laboratoire</h4>' ],
    [ '<h4>✓ Formation continue</h4>', '<h4><i class="fa-solid fa-graduation-cap" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Formation continue</h4>' ],
    [ '<h4>✓ Audits internes</h4>', '<h4><i class="fa-solid fa-clipboard-check" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Audits internes</h4>' ],
    [ '<h4>✓ Équipement certifié</h4>', '<h4><i class="fa-solid fa-certificate" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Équipement certifié</h4>' ],
    [ '<h4>✓ Gestion des risques</h4>', '<h4><i class="fa-solid fa-shield-virus" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Gestion des risques</h4>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 7. calculateur.html
updateFile(path.join(pagesDir, 'calculateur.html'), [
    [ '<h2>🧮 Calculateur Interactif</h2>', '<h2><i class="fa-solid fa-calculator" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Calculateur Interactif</h2>' ],
    [ '<h4>💡 Bon à savoir</h4>', '<h4><i class="fa-solid fa-lightbulb" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Bon à savoir</h4>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 8. devis.html
updateFile(path.join(pagesDir, 'devis.html'), [
    [ 'Envoyer ma demande →', 'Envoyer ma demande <i class="fa-solid fa-paper-plane" style="margin-left: 0.5rem;"></i>' ],
    [ '<h3>📞 Besoin d\'aide ?</h3>', '<h3><i class="fa-solid fa-headset" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Besoin d\'aide ?</h3>' ],
    [ '<p style="font-weight: 600; margin-bottom: 0.5rem;">📞 Par téléphone</p>', '<p style="font-weight: 600; margin-bottom: 0.5rem;"><i class="fa-solid fa-phone" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Par téléphone</p>' ],
    [ '<p style="font-weight: 600; margin-bottom: 0.5rem;">✉️ Par email</p>', '<p style="font-weight: 600; margin-bottom: 0.5rem;"><i class="fa-solid fa-envelope" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Par email</p>' ],
    [ '<span style="color: var(--gold);">✓</span>', '<i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 9. stations.html
updateFile(path.join(pagesDir, 'stations.html'), [
    [ '<h3>🗺️ Trouvez votre station la plus proche</h3>', '<h3><i class="fa-solid fa-map-location-dot" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Trouvez votre station la plus proche</h3>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 10. 404.html
updateFile(path.join(pagesDir, '404.html'), [
    [ '<div class="error-404-icon">⛽</div>', '<div class="error-404-icon" style="color: var(--sip-red);"><i class="fa-solid fa-gas-pump"></i></div>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 11. accessibilite.html
updateFile(path.join(pagesDir, 'accessibilite.html'), [
    [ '<h4>🌙 Mode sombre</h4>', '<h4><i class="fa-solid fa-moon" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Mode sombre</h4>' ],
    [ '<h4>⌨️ Navigation clavier</h4>', '<h4><i class="fa-solid fa-keyboard" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Navigation clavier</h4>' ],
    [ '<h4>🔍 Zoom</h4>', '<h4><i class="fa-solid fa-magnifying-glass-plus" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Zoom</h4>' ],
    [ '<h4>📱 Responsive</h4>', '<h4><i class="fa-solid fa-mobile-screen" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Responsive</h4>' ],
    [ '<h4>🤖 Chatbot accessible</h4>', '<h4><i class="fa-solid fa-robot" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Chatbot accessible</h4>' ],
    [ '<h4>🎯 Structure sémantique</h4>', '<h4><i class="fa-solid fa-bullseye" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Structure sémantique</h4>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 12. produits-services.html
updateFile(path.join(pagesDir, 'produits-services.html'), [
    [ '<li>✓ Distribution 24h/24</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Distribution 24h/24</li>' ],
    [ '<li>✓ Contrôle qualité en temps réel</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Contrôle qualité en temps réel</li>' ],
    [ '<li>✓ Prix transparent</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Prix transparent</li>' ],
    [ '<li>✓ Logistique sécurisée</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Logistique sécurisée</li>' ],
    [ '<li>✓ Compatible Euro 5/6</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Compatible Euro 5/6</li>' ],
    [ '<li>✓ Stockage ISO 9001</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Stockage ISO 9001</li>' ],
    [ '<li>✓ Support technique dédié</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Support technique dédié</li>' ],
    [ '<li>✓ Formations partenaires</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Formations partenaires</li>' ],
    [ '<li>✓ Livraison Express</li>', '<li><i class="fa-solid fa-circle-check" style="color: var(--sip-red); margin-right: 0.4rem;"></i> Livraison Express</li>' ],
    [ 'Demander un devis →', 'Demander un devis <i class="fa-solid fa-arrow-right" style="margin-left: 0.5rem;"></i>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 13. recrutement.html
updateFile(path.join(pagesDir, 'recrutement.html'), [
    [ '<h3>Pompiste / vendeur station</h3>', '<h3><i class="fa-solid fa-gas-pump" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Pompiste / vendeur station</h3>' ],
    [ '<h3>Chef de station</h3>', '<h3><i class="fa-solid fa-user-tie" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Chef de station</h3>' ],
    [ '<h3>Technicien maintenance</h3>', '<h3><i class="fa-solid fa-wrench" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Technicien maintenance</h3>' ],
    [ '<h3>Logistique &amp; approvisionnement</h3>', '<h3><i class="fa-solid fa-truck-moving" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Logistique &amp; approvisionnement</h3>' ],
    [ '<h3>Commercial &amp; relation client</h3>', '<h3><i class="fa-solid fa-briefcase" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Commercial &amp; relation client</h3>' ],
    [ '<h3>Administration &amp; support</h3>', '<h3><i class="fa-solid fa-building" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Administration &amp; support</h3>' ],
    [ 'Envoyer ma candidature par e-mail', 'Envoyer ma candidature par e-mail <i class="fa-solid fa-paper-plane" style="margin-left: 0.5rem;"></i>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

// 14. faq.html
updateFile(path.join(pagesDir, 'faq.html'), [
    [ '<button class="btn btn-primary" onclick="searchFAQ()">Rechercher</button>', '<button class="btn btn-primary" onclick="searchFAQ()"><i class="fa-solid fa-magnifying-glass" style="margin-right: 0.4rem;"></i> Rechercher</button>' ],
    [ '<button class="faq-category-btn active" data-category="all">Toutes</button>', '<button class="faq-category-btn active" data-category="all"><i class="fa-solid fa-layer-group" style="margin-right: 0.4rem;"></i> Toutes</button>' ],
    [ '<button class="faq-category-btn" data-category="produits">Produits</button>', '<button class="faq-category-btn" data-category="produits"><i class="fa-solid fa-gas-pump" style="margin-right: 0.4rem;"></i> Produits</button>' ],
    [ '<button class="faq-category-btn" data-category="stations">Stations</button>', '<button class="faq-category-btn" data-category="stations"><i class="fa-solid fa-location-dot" style="margin-right: 0.4rem;"></i> Stations</button>' ],
    [ '<button class="faq-category-btn" data-category="livraison">Livraison</button>', '<button class="faq-category-btn" data-category="livraison"><i class="fa-solid fa-truck-fast" style="margin-right: 0.4rem;"></i> Livraison</button>' ],
    [ '<button class="faq-category-btn" data-category="paiement">Paiement</button>', '<button class="faq-category-btn" data-category="paiement"><i class="fa-solid fa-credit-card" style="margin-right: 0.4rem;"></i> Paiement</button>' ],
    [ '<button class="faq-category-btn" data-category="fidelite">Fidélité</button>', '<button class="faq-category-btn" data-category="fidelite"><i class="fa-solid fa-star" style="margin-right: 0.4rem;"></i> Fidélité</button>' ],
    [ '<span class="toggle-icon">−</span>', '<span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>' ]
]);

console.log('Finished updating icons with Font Awesome!');
