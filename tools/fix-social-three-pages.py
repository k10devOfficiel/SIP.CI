#!/usr/bin/env python3
"""Supprime les réseaux sociaux (en-tête commenté + pied de page) sur 3 pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "pages"
FILES = ["stations.html", "produits-services.html", "actualites.html"]
FIDELITY = "https://fidelity.sip-ci.net/"

FOOTER_NEW = f"""            <div class="footer-section">
                <h3>Espace client</h3>
                <motion class="social-links">
                    <a href="{FIDELITY}" class="social-link" target="_blank" rel="noopener noreferrer" title="Espace client Fidelity" aria-label="Espace client Fidelity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </a>
                </div>
            </div>""".replace('<motion class="social-links">', '<div class="social-links">')

COMMENT_BLOCK = re.compile(
    r"\s*<!--\s*\n\s*<div class=\"social-icons-header\">.*?\n\s*-->\s*\n",
    re.DOTALL,
)

FOOTER_OLD = re.compile(
    r'            <div class="footer-section">\s*\n\s*<h3>Suivez-nous</h3>.*?\n            </div>',
    re.DOTALL,
)


def main():
    for name in FILES:
        path = ROOT / name
        text = path.read_text(encoding="utf-8")
        orig = text
        text = COMMENT_BLOCK.sub("\n", text, count=1)
        text, n = FOOTER_OLD.subn(FOOTER_NEW, text, count=1)
        if text != orig:
            path.write_text(text, encoding="utf-8", newline="\n")
            print(f"OK {name} (footer: {n})")
        else:
            print(f"NO CHANGE {name}")


if __name__ == "__main__":
    main()
