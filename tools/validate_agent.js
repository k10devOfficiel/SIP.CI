const fs = require('fs');
const path = require('path');

function stripAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function validateAgent(filePath, options = {}) {
    console.log('\n' + '='.repeat(65));
    console.log(`🔍 Analyse de conformité [${options.generic ? 'Agent Générique' : 'Sous-Agent Antigravity Natif'}] : ${path.basename(filePath)}`);
    console.log('='.repeat(65));

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier introuvable : ${filePath}`);
        return 1;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const normalized = stripAccents(content);
    const errors = [];
    const warnings = [];
    const passed = [];

    // 1. Frontmatter
    const fmMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    const frontmatter = fmMatch ? fmMatch[1] : '';

    if (!options.generic) {
        if (!frontmatter) {
            errors.push("Frontmatter YAML manquant.");
        } else {
            const nameMatch = frontmatter.match(/^name:\s*([a-zA-Z0-9_-]+)/m);
            const slug = nameMatch ? nameMatch[1].trim() : path.basename(filePath, '.md');
            if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
                passed.push(`Identifiant technique valide (kebab-case) : '${slug}'`);
            } else {
                warnings.push(`L'identifiant '${slug}' ne respecte pas kebab-case.`);
            }

            if (/^description:\s*.+/m.test(frontmatter)) {
                passed.push("Frontmatter Antigravity : clé 'description' présente");
            } else {
                errors.push("Frontmatter Antigravity : clé 'description' obligatoire manquante.");
            }

            if (/^tools:\s*/m.test(frontmatter)) {
                passed.push("Frontmatter Antigravity : clé 'tools' présente");
            } else {
                warnings.push("Frontmatter Antigravity : clé 'tools' recommandée absente.");
            }

            if (/^(subagent|mainAgent):\s*/m.test(frontmatter)) {
                passed.push("Frontmatter Antigravity : type d'agent déclaré ('subagent' ou 'mainAgent')");
            } else {
                warnings.push("Frontmatter Antigravity : déclaration 'subagent: true' ou 'mainAgent: true' manquante.");
            }
        }
    }

    // 2. Sections obligatoires
    const requiredSections = [
        ['Rôle & Identité', ['role', 'identite', 'mission']],
        ['Instructions & Processus', ['instruction', 'instructions', 'processus', 'workflow', 'methode']],
        ['Outils & Permissions', ['outil', 'outils', 'permission', 'permissions', 'privilege', 'privileges', 'tools']],
        ['Format de sortie', ['format de sortie', 'sortie attendue', 'schema de sortie', 'output']],
        ['Cas limites & Erreurs', ['cas limite', 'cas limites', 'gestion des erreurs', 'interdit', 'interdits', 'garde-fou', 'garde-fous']],
        ['Exemples concrets', ['exemple', 'exemples', 'few-shot', 'cas d\'usage']]
    ];

    for (const [secName, patterns] of requiredSections) {
        let found = false;
        for (const pat of patterns) {
            const headerRegex = new RegExp(`#{1,4}\\s+.*${pat}`, 'i');
            const boldRegex = new RegExp(`\\*\\*.*${pat}.*\\*\\*`, 'i');
            if (headerRegex.test(normalized) || boldRegex.test(normalized)) {
                found = true;
                break;
            }
        }
        if (found) {
            passed.push(`Section présente : ${secName}`);
        } else {
            errors.push(`Section manquante obligatoire : ${secName}`);
        }
    }

    // 3. Anti-patterns
    if (/\bfais de ton mieux\b/i.test(normalized) || /\bsois intelligent\b/i.test(normalized)) {
        warnings.push("Formulation floue détectée.");
    }

    if (/(tous les outils|toutes les permissions|all tools|aucun filtre)/i.test(normalized)) {
        warnings.push("Violation possible du moindre privilège.");
    }

    const exampleCount = (normalized.match(/(###?\s+exemple\s+\d+|###?\s+cas\s+\d+|entree\s*:)/gi) || []).length;
    if (exampleCount >= 2) {
        passed.push(`Exemples Few-Shot détectés (${exampleCount} occurrences)`);
    } else {
        warnings.push(`Nombre insuffisant d'exemples détectés (${exampleCount}). Recommandé : au moins 2.`);
    }

    // Output
    if (passed.length) {
        console.log('\n✅ VÉRIFICATIONS RÉUSSIES :');
        passed.forEach(p => console.log('  [+] ' + p));
    }
    if (warnings.length) {
        console.log('\n⚠️ AVERTISSEMENTS :');
        warnings.forEach(w => console.log('  [!] ' + w));
    }
    if (errors.length) {
        console.log('\n❌ ERREURS BLOQUANTES :');
        errors.forEach(e => console.log('  [-] ' + e));
    }

    console.log('\n' + '-'.repeat(65));
    if (errors.length === 0) {
        console.log("🎉 RÉSULTAT : L'agent respecte tous les critères de qualité !");
        console.log('-'.repeat(65) + '\n');
        return 0;
    } else {
        console.log(`🚨 RÉSULTAT : Validation échouée avec ${errors.length} problème(s) à corriger.`);
        console.log('-'.repeat(65) + '\n');
        return 1;
    }
}

const target = process.argv[2];
if (!target) {
    console.error("Usage: node tools/validate_agent.js <path-to-agent.md>");
    process.exit(1);
}
process.exit(validateAgent(target));
