import re

# 1. Update certifications.html
with open('pages/certifications.html', 'r', encoding='utf-8') as f:
    cert_content = f.read()

# Update header logo
cert_content = re.sub(
    r'<div class="logo">[\s\S]*?<span>SIP</span>\s*</div>',
    '''<div class="logo">
                <a href="../index.html">
                    <img src="../assets/images/LOGOSIP2.png" alt="Logo SIP">
                </a>
            </div>''',
    cert_content
)

# Update nav-menu
cert_content = re.sub(
    r'<ul class="nav-menu">[\s\S]*?</ul>',
    '''<ul class="nav-menu">
                <li><a href="../index.html#accueil">Accueil</a></li>
                <li><a href="produits-services.html">Produits & Services</a></li>
                <li><a href="stations.html">Nos Stations</a></li>
                <li><a href="actualites.html">Actualités</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>''',
    cert_content
)

# Update hero section to standard page-header
cert_content = re.sub(
    r'<section class="cert-hero">[\s\S]*?</section>',
    '''<section class="page-header">
            <div class="page-main">
                <h1>Certifications & Normes</h1>
                <p>Notre engagement certifié pour la qualité, la sécurité et l'environnement</p>
            </div>
        </section>''',
    cert_content
)

# Update the cert-grid to modern card-grid with images
old_cert_grid_pattern = r'<div class="cert-grid">[\s\S]*?</div>\s*</div>\s*</section>'
new_cert_grid = '''<div class="card-grid card-grid-4" style="margin-top: 3rem;">
                    <div class="card" style="text-align: center;">
                        <div class="cert-badge-wrapper">
                            <img src="../assets/images/ISO9001.png" alt="Certification ISO 9001">
                        </div>
                        <h3>ISO 9001:2015</h3>
                        <p>Système de management de la qualité certifié, garantissant la conformité rigoureuse de nos processus et l'amélioration continue.</p>
                        <small style="display: block; margin-top: 0.8rem; font-weight: 600; color: var(--sip-red);">Certification Qualité Internationale</small>
                    </div>
                    
                    <div class="card" style="text-align: center;">
                        <div class="cert-badge-wrapper">
                            <img src="../assets/images/ISO14001.png" alt="Certification ISO 14001">
                        </div>
                        <h3>ISO 14001:2015</h3>
                        <p>Management environnemental audité. Maîtrise des impacts écologiques et engagement pour une distribution responsable.</p>
                        <small style="display: block; margin-top: 0.8rem; font-weight: 600; color: var(--sip-red);">Management Environnemental</small>
                    </div>
                    
                    <div class="card" style="text-align: center;">
                        <div class="cert-badge-wrapper">
                            <img src="../assets/images/ISO45001.png" alt="Certification ISO 45001">
                        </div>
                        <h3>ISO 45001:2018</h3>
                        <p>Santé et sécurité au travail certifiées. Protection optimale de nos collaborateurs, partenaires et clients sur chaque site.</p>
                        <small style="display: block; margin-top: 0.8rem; font-weight: 600; color: var(--sip-red);">Santé & Sécurité au Travail</small>
                    </div>
                    
                    <div class="card" style="text-align: center;">
                        <div class="cert-badge-wrapper">
                            <img src="../assets/images/RSE.png" alt="Charte RSE">
                        </div>
                        <h3>Charte RSE</h3>
                        <p>Cadre stratégique en 5 étapes articulant gouvernance éthique, impact sociétal positif et transition énergétique durable.</p>
                        <small style="display: block; margin-top: 0.8rem; font-weight: 600; color: var(--sip-red);">Démarche Responsable 2026</small>
                    </div>
                </div>

                <!-- Vitrine Détaillée Charte RSE -->
                <div class="rse-showcase-card">
                    <div class="rse-showcase-image">
                        <img src="../assets/images/RSE.png" alt="Cycle en 5 étapes de la Charte RSE SIP">
                    </div>
                    <div class="rse-showcase-content">
                        <span class="rse-showcase-badge"><i class="fa-solid fa-seedling"></i> Démarche Responsable</span>
                        <h3>Élaborer une charte RSE en 5 étapes</h3>
                        <p class="rse-lead">Notre feuille de route sociétale guide l'ensemble de nos équipes et partenaires vers une énergie responsable, sûre et solidaire.</p>
                        <ul class="rse-showcase-steps">
                            <li>
                                <span class="rse-step-number">1</span>
                                <div><strong>Identifiez les valeurs et enjeux :</strong> Sécurité, intégrité, transparence et impact environnemental.</div>
                            </li>
                            <li>
                                <span class="rse-step-number">2</span>
                                <div><strong>Impliquez les parties prenantes :</strong> Écoute active de nos clients, équipes de station et communautés.</div>
                            </li>
                            <li>
                                <span class="rse-step-number">3</span>
                                <div><strong>Définissez des objectifs SMART :</strong> Réduction des émissions, zéro incident et qualité irréprochable.</div>
                            </li>
                            <li>
                                <span class="rse-step-number">4</span>
                                <div><strong>Rédigez la charte :</strong> Engagements clairs et transparents partagés à tous les niveaux.</div>
                            </li>
                            <li>
                                <span class="rse-step-number">5</span>
                                <div><strong>Faites signer la charte :</strong> Adhésion formelle et application sur chaque site du réseau SIP.</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>'''

cert_content = re.sub(old_cert_grid_pattern, new_cert_grid, cert_content)

with open('pages/certifications.html', 'w', encoding='utf-8') as f:
    f.write(cert_content)
print("certifications.html updated successfully!")


# 2. Update rse.html
with open('pages/rse.html', 'r', encoding='utf-8') as f:
    rse_content = f.read()

# Replace Quality section or add the RSE showcase
rse_showcase_section = '''        <section class="section section-alt">
            <div class="container">
                <h2 class="text-center">Notre Charte RSE & Développement Durable</h2>
                <p class="section-intro text-center">Un cadre d'action structuré en 5 étapes clés pour ancrer la responsabilité sociétale et environnementale au cœur de chaque station SIP</p>
                
                <div class="rse-showcase-card">
                    <div class="rse-showcase-image">
                        <img src="../assets/images/RSE.png" alt="Cycle en 5 étapes de la Charte RSE SIP">
                    </div>
                    <div class="rse-showcase-content">
                        <span class="rse-showcase-badge"><i class="fa-solid fa-seedling"></i> Démarche Responsable</span>
                        <h3>Élaborer une charte RSE en 5 étapes</h3>
                        <p class="rse-lead">Notre feuille de route sociétale guide l'ensemble de nos équipes et partenaires vers une énergie responsable, sûre et solidaire.</p>
                        <ul class="rse-showcase-steps">
                            <li>
                                <span class="rse-step-number">1</span>
                                <div><strong>Identifiez les valeurs et enjeux :</strong> Sécurité des personnes, intégrité, transparence et réduction de l'empreinte carbone.</div>
                            </li>
                            <li>
                                <span class="rse-step-number">2</span>
                                <div><strong>Impliquez les parties prenantes :</strong> Dialogue continu avec nos clients, collaborateurs, transporteurs et partenaires.</div>
                            </li>
                            <li>
                                <span class="rse-step-number">3</span>
                                <div><strong>Définissez des objectifs SMART :</strong> Cibles concrètes de qualité de service, de recyclage et de zéro accident.</div>
                            </li>
                            <li>
                                <span class="rse-step-number">4</span>
                                <div><strong>Rédigez la charte :</strong> Formalisation d'engagements éthiques clairs et compréhensibles par tous.</div>
                            </li>
                            <li>
                                <span class="rse-step-number">5</span>
                                <div><strong>Faites signer la charte :</strong> Signature et respect scrupuleux sur l'ensemble de nos sites en Côte d'Ivoire.</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>'''

# Replace "La qualité au cœur de notre démarche" section in rse.html
rse_content = re.sub(
    r'<section class="section section-alt">\s*<div class="container">\s*<h2 class="text-center">La qualité au cœur de notre démarche[\s\S]*?</section>',
    rse_showcase_section,
    rse_content
)

# In the second section-alt (Qualité et excellence opérationnelle), update the 4 cards with cert images
rse_cards_updated = '''<div class="card-grid card-grid-4" style="margin-top: 2.5rem;">
                    <div class="card" style="text-align: center;">
                        <div class="cert-badge-wrapper">
                            <img src="../assets/images/ISO9001.png" alt="Certification ISO 9001">
                        </div>
                        <h3>ISO 9001</h3>
                        <p>Management qualité garantissant la conformité stricte et l'amélioration continue.</p>
                    </div>
                    <div class="card" style="text-align: center;">
                        <div class="cert-badge-wrapper">
                            <img src="../assets/images/ISO14001.png" alt="Certification ISO 14001">
                        </div>
                        <h3>ISO 14001</h3>
                        <p>Management environnemental certifié pour la préservation écologique et la propreté des sites.</p>
                    </div>
                    <div class="card" style="text-align: center;">
                        <div class="cert-badge-wrapper">
                            <img src="../assets/images/ISO45001.png" alt="Certification ISO 45001">
                        </div>
                        <h3>ISO 45001</h3>
                        <p>Santé et sécurité au travail certifiées, protégeant nos collaborateurs et usagers.</p>
                    </div>
                    <div class="card" style="text-align: center;">
                        <div class="cert-badge-wrapper">
                            <img src="../assets/images/RSE.png" alt="Charte RSE">
                        </div>
                        <h3>Charte RSE</h3>
                        <p>Engagement citoyen et éthique durable ancré au cœur de chaque station SIP.</p>
                    </div>
                </div>'''

rse_content = re.sub(
    r'<div class="card-grid card-grid-4" style="margin-top: 2rem;">[\s\S]*?</div>\s*<p class="engagements-prose text-center"',
    rse_cards_updated + '\n                <p class="engagements-prose text-center"',
    rse_content
)

with open('pages/rse.html', 'w', encoding='utf-8') as f:
    f.write(rse_content)
print("rse.html updated successfully!")
