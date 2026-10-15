const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

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
console.log(`Checking ${htmlFiles.length} HTML files...`);

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Pattern 1: Commented out chatbot in devis.html
    content = content.replace(/<!--\s*Assistant SIP \(désactivé sur cette page\)[\s\S]*?<button class="chatbot-toggle"[\s\S]*?-->/gi, '');

    // Pattern 2: Regular chatbot block with toggle button
    content = content.replace(/<!--\s*Chatbot Widget\s*-->[\s\S]*?<button class="chatbot-toggle"[^>]*>[\s\S]*?<\/button>/gi, '');

    // Pattern 3: Any remaining standalone chatbot-widget div
    content = content.replace(/<div class="chatbot-widget">[\s\S]*?<\/div>\s*<\/div>/gi, '');

    // Pattern 4: Any standalone chatbot-toggle button
    content = content.replace(/<button class="chatbot-toggle"[^>]*>[\s\S]*?<\/button>/gi, '');

    // Pattern 5: In accessibilite.html, remove or replace "Chatbot accessible"
    if (file.endsWith('accessibilite.html')) {
        content = content.replace(
            /<div class="feature-item">\s*<h4><i class="fa-solid fa-robot"[^>]*><\/i>\s*Chatbot accessible<\/h4>\s*<p>Notre assistant virtuel respecte les standards d'accessibilité\.<\/p>\s*<\/div>/gi,
            `<div class="feature-item">\n                            <h4><i class="fa-solid fa-universal-access" style="color: var(--sip-red); margin-right: 0.5rem;"></i> Standard RGAA</h4>\n                            <p>Respect des critères internationaux d'accessibilité numérique du web.</p>\n                        </div>`
        );
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Removed chatbot from: ${path.relative(baseDir, file)}`);
    } else {
        console.log(`No chatbot in: ${path.relative(baseDir, file)}`);
    }
}

console.log('Chatbot removal completed.');
