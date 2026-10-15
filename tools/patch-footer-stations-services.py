"""Remplace la section footer Suivez-nous par Stations-services."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

MENU_PAGES = """            <div class="footer-section">
                <h3>Stations-services</h3>
                <ul>
                    <li><a href="{prefix}stations.html">Trouver une station-service</a></li>
                    <li><a href="{prefix}rse.html">Nos engagements</a></li>
                    <li><a href="{prefix}produits-services.html#services-annexes">Prendre soin de votre voiture</a></li>
                    <li><a href="{prefix}contact.html?sujet=franchise">Devenir franchisé</a></li>
                    <li><a href="{prefix}recrutement.html">Rejoindre l'équipe SIP</a></li>
                </ul>
            </div>"""

MENU_GRID = """                <div class="footer-section">
                    <h3>Stations-services</h3>
                    <ul>
                        <li><a href="stations.html">Trouver une station-service</a></li>
                        <li><a href="rse.html">Nos engagements</a></li>
                        <li><a href="produits-services.html#services-annexes">Prendre soin de votre voiture</a></li>
                        <li><a href="contact.html?sujet=franchise">Devenir franchisé</a></li>
                        <li><a href="recrutement.html">Rejoindre l'équipe SIP</a></li>
                    </ul>
                </div>
"""

SUIVRE_BLOCK = re.compile(
    r"            <div class=\"footer-section\">\r?\n"
    r"                <h3>Suivez-nous</h3>\r?\n"
    r"                <div class=\"social-links\">.*?"
    r"                </div>\r?\n"
    r"            </div>",
    re.DOTALL,
)


def patch_footer_content(path: Path, prefix: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if "<h3>Suivez-nous</h3>" not in text:
        return False
    m = SUIVRE_BLOCK.search(text)
    if not m:
        return False
    new_block = (
        "            <!-- Ancienne section Suivez-nous (réseaux sociaux)\n"
        + m.group(0)
        + "\n            -->\n"
        + MENU_PAGES.format(prefix=prefix)
    )
    path.write_text(SUIVRE_BLOCK.sub(new_block, text, count=1), encoding="utf-8")
    return True


def patch_footer_grid(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "footer-grid" not in text or "<h3>Stations-services</h3>" in text:
        return False
    m = re.search(
        r"                    <div class=\"social-links\">.*?"
        r"                    </div>\r?\n",
        text,
        re.DOTALL,
    )
    if m:
        commented = (
            "                    <!-- Réseaux sociaux (Suivez-nous)\n"
            + m.group(0)
            + "                    -->\n"
        )
        text = text[: m.start()] + commented + text[m.end() :]

    marker = "                </div>\r\n            </div>\r\n            <div class=\"footer-bottom\">"
    if marker not in text:
        marker = "                </div>\n            </div>\n            <div class=\"footer-bottom\">"
    if marker not in text:
        return False
    text = text.replace(
        marker,
        "                </div>\n" + MENU_GRID + "            </div>\n            <div class=\"footer-bottom\">",
        1,
    )
    path.write_text(text, encoding="utf-8")
    return True


for rel in [
    "index.html",
    "pages/produits-services.html",
    "pages/recrutement.html",
    "pages/actualites.html",
    "pages/stations.html",
    "pages/devis.html",
    "pages/apropos.html",
    "pages/contact.html",
]:
    p = ROOT / rel
    if p.exists() and patch_footer_content(p, "pages/" if rel == "index.html" else ""):
        print("content", rel)

for rel in [
    "pages/accessibilite.html",
    "pages/rse.html",
    "pages/faq.html",
    "pages/certifications.html",
    "pages/calculateur.html",
    "pages/404.html",
    "pages/partenaires.html",
]:
    p = ROOT / rel
    if p.exists() and patch_footer_grid(p):
        print("grid", rel)
