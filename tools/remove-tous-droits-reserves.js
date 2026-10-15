const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        if (file === 'node_modules' || file === '.git' || file === '.agents') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(getHtmlFiles(fullPath));
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

const htmlFiles = getHtmlFiles(rootDir);
let modifiedCount = 0;

for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern targeting footer copyright mentions of "Tous droits réservés" / "tout droit réservé"
    // Examples:
    // <p>&copy; 2026 SIP - Société Ivoirienne de Pétrole. Tous droits réservés.</p>
    // <p>&copy; 2026 Société Ivoirienne de Pétrole. Tous droits réservés.</p>
    // <p>&copy; 2026 Entreprise Pétrolière. Tous droits réservés.</p>
    const regex = /(\.?\s*Tous\s+droits?\s+r[eé]serv[eé]s?\.?)/gi;
    
    // Check if within footer or copyright context
    if (regex.test(content)) {
        // Replace in copyright context:
        // ". Tous droits réservés." -> "."
        // "Tous droits réservés." -> ""
        // etc.
        const newContent = content.replace(/(\.|\s)*tous\s+droits?\s+r[eé]serv[eé]s?\.?/gi, (match, p1, offset, fullStr) => {
            // Check surrounding 100 characters to make sure it's copyright/footer and not Défenseur des droits
            const snippet = fullStr.substring(Math.max(0, offset - 60), Math.min(fullStr.length, offset + 60));
            if (snippet.toLowerCase().includes('défenseur') || snippet.toLowerCase().includes('defenseur')) {
                return match; // Don't change Défenseur des droits
            }
            return '.';
        });

        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Modifié : ${path.relative(rootDir, filePath)}`);
            modifiedCount++;
        }
    }
}

console.log(`\nTerminé ! ${modifiedCount} fichiers mis à jour.`);
