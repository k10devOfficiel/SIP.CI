const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html') && !f.startsWith('old_'));

const targetSnippet = `            <div class="social-icons-header">
                <a href="https://fidelity.sip-ci.net/" class="social-icon" target="_blank" rel="noopener noreferrer" title="Espace client Fidelity" aria-label="Espace client — connexion Fidelity">
                    <i class="fa-solid fa-user" aria-hidden="true"></i>
                    <span class="social-icon-label">Espace Client</span>
                </a>
            </div>`;

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Harmonize social-icons-header
    const regex = /<div class="social-icons-header">\s*<a href="https:\/\/fidelity\.sip-ci\.net\/"[^>]*>[\s\S]*?<\/a>\s*<\/div>/;
    if (regex.test(content)) {
        content = content.replace(regex, targetSnippet);
        modified = true;
    }

    // Ensure Font Awesome is included
    if (!content.includes('font-awesome/6.')) {
        const faLink = '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W==" crossorigin="anonymous" referrerpolicy="no-referrer" />\n';
        content = content.replace(/<\/head>/i, faLink + '</head>');
        modified = true;
    }

    // Ensure Barlow Condensed is included
    if (!content.includes('Barlow+Condensed')) {
        const fontLink = '    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet">\n';
        content = content.replace(/<\/head>/i, fontLink + '</head>');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`No changes needed for ${file}`);
    }
});
