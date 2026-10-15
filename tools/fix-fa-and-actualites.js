const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

// 1. Fix Font Awesome in all HTML files
function getHtmlFiles(dir) {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'tools') {
                results = results.concat(getHtmlFiles(fullPath));
            }
        } else if (entry.isFile() && entry.name.endsWith('.html') && !entry.name.startsWith('old_')) {
            results.push(fullPath);
        }
    }
    return results;
}

const htmlFiles = getHtmlFiles(baseDir);

const badFaRegex = /<link\s+rel=["']stylesheet["']\s+href=["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.2\/css\/all\.min\.css["'][^>]*>/gi;
const cleanFaLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">';

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    if (badFaRegex.test(content)) {
        content = content.replace(badFaRegex, cleanFaLink);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Cleaned Font Awesome in: ${path.relative(baseDir, file)}`);
    }
}

// 2. Pre-render news items directly into index.html
const indexPath = path.join(baseDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const indexArticlesHtml = `            <div
                class="news-grid"
                data-actualites-preview
                data-actualites-json="data/actualites.json"
                data-limit="3"
                aria-live="polite"
            >
                <article>
                    <p class="news-date">15 Janvier 2026</p>
                    <h3>Renforcement de la flotte de distribution</h3>
                    <p>Livraison de nouveaux camions-citernes sécurisés pour optimiser les livraisons sur la côte.</p>
                </article>
                <article>
                    <p class="news-date">08 Janvier 2026</p>
                    <h3>Programme de décarbonation</h3>
                    <p>Mise en service d'un plan d'efficacité énergétique dans nos stations pilotes.</p>
                </article>
                <article>
                    <p class="news-date">22 Décembre 2025</p>
                    <h3>Campagne solidarité</h3>
                    <p>Distribution de carburants et denrées de première nécessité aux communautés rurales.</p>
                </article>
            </div>`;

indexContent = indexContent.replace(/<div\s+class=["']news-grid["']\s+data-actualites-preview[\s\S]*?<\/div>/i, indexArticlesHtml);
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Pre-rendered actualites in index.html');

// 3. Pre-render news items directly into pages/actualites.html
const actualitesPath = path.join(baseDir, 'pages', 'actualites.html');
let actuContent = fs.readFileSync(actualitesPath, 'utf8');

const actuCardsHtml = `                <div
                    class="card-grid card-grid-3"
                    style="margin-top: 3rem;"
                    data-actualites-cards
                    data-actualites-json="../data/actualites.json"
                    aria-live="polite"
                >
                    <article class="card" style="padding: 0; overflow: hidden;">
                        <div style="height: 200px; overflow: hidden;">
                            <img src="../assets/images/sipimg2.jpg" alt="Renforcement de la flotte de distribution" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="padding: 1.5rem;">
                            <p style="color: var(--sip-red); font-size: 0.9rem; font-weight: 600;">15 Janvier 2026</p>
                            <h3 style="margin: 0.5rem 0;">Renforcement de la flotte de distribution</h3>
                            <p style="color: #4A6070;">Livraison de nouveaux camions-citernes sécurisés pour optimiser les livraisons sur la côte.</p>
                            <a href="contact.html" class="btn btn-sm btn-outline" style="margin-top: 1rem;">Lire la suite</a>
                        </div>
                    </article>
                    <article class="card" style="padding: 0; overflow: hidden;">
                        <div style="height: 200px; overflow: hidden;">
                            <img src="../assets/images/sipimg4.jpg" alt="Programme de décarbonation" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="padding: 1.5rem;">
                            <p style="color: var(--sip-red); font-size: 0.9rem; font-weight: 600;">08 Janvier 2026</p>
                            <h3 style="margin: 0.5rem 0;">Programme de décarbonation</h3>
                            <p style="color: #4A6070;">Mise en service d'un plan d'efficacité énergétique dans nos stations pilotes.</p>
                            <a href="contact.html" class="btn btn-sm btn-outline" style="margin-top: 1rem;">Lire la suite</a>
                        </div>
                    </article>
                    <article class="card" style="padding: 0; overflow: hidden;">
                        <div style="height: 200px; overflow: hidden;">
                            <img src="../assets/images/sipimg3.jpg" alt="Campagne solidarité" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="padding: 1.5rem;">
                            <p style="color: var(--sip-red); font-size: 0.9rem; font-weight: 600;">22 Décembre 2025</p>
                            <h3 style="margin: 0.5rem 0;">Campagne solidarité</h3>
                            <p style="color: #4A6070;">Distribution de carburants et denrées de première nécessité aux communautés rurales.</p>
                            <a href="contact.html" class="btn btn-sm btn-outline" style="margin-top: 1rem;">Lire la suite</a>
                        </div>
                    </article>
                </div>`;

actuContent = actuContent.replace(/<div\s+class=["']card-grid["'][^>]*data-actualites-cards[\s\S]*?<\/div>/i, actuCardsHtml);
fs.writeFileSync(actualitesPath, actuContent, 'utf8');
console.log('Pre-rendered actualites in pages/actualites.html');
