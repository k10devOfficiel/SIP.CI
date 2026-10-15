const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

const modernFontLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`;

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
console.log(`Found ${htmlFiles.length} HTML files to inspect.`);

for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Pattern 1: Replace existing Google Fonts blocks (Inter / Barlow Condensed / Montserrat / Open Sans)
    // Remove any secondary google fonts link tags first
    content = content.replace(/<link\s+rel=["']preconnect["']\s+href=["']https:\/\/fonts\.googleapis\.com["']>\s*/gi, '');
    content = content.replace(/<link\s+rel=["']preconnect["']\s+href=["']https:\/\/fonts\.gstatic\.com["']\s+crossorigin>\s*/gi, '');
    content = content.replace(/<link\s+href=["']https:\/\/fonts\.googleapis\.com\/css2\?[^"']+["']\s+rel=["']stylesheet["']>\s*/gi, '');

    // Now insert the new font link before Font Awesome or before first stylesheet in head
    if (content.includes('<!-- Font Awesome 6 -->') || content.includes('all.min.css')) {
        content = content.replace(/(<!--\s*Font Awesome 6\s*-->|<link[^>]*all\.min\.css[^>]*>)/i, (match) => {
            return `<!-- Google Fonts (Outfit & Plus Jakarta Sans) -->\n    ${modernFontLink}\n    ${match}`;
        });
    } else if (content.includes('<link rel="stylesheet"')) {
        content = content.replace(/<link rel="stylesheet"/i, `<!-- Google Fonts (Outfit & Plus Jakarta Sans) -->\n    ${modernFontLink}\n    <link rel="stylesheet"`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated fonts in: ${path.relative(baseDir, filePath)}`);
    } else {
        console.log(`No change for: ${path.relative(baseDir, filePath)}`);
    }
}

console.log('Typography update complete.');
