"""Supprime les liens dupliqués entre Liens utiles et Stations-services."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LIENS_PAGES_OLD = """                <ul>
                    <li><a href="recrutement.html">Recrutement</a></li>
                    <li><a href="apropos.html">À propos</a></li>
                    <li><a href="actualites.html">Actualités</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>"""

LIENS_PAGES_NEW = """                <ul>
                    <li><a href="apropos.html">À propos</a></li>
                    <li><a href="actualites.html">Actualités</a></li>
                    <li><a href="devis.html">Demande de devis</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>"""

LIENS_INDEX_OLD = """                <ul>
                    <li><a href="pages/recrutement.html">Recrutement</a></li>
                    <li><a href="pages/apropos.html">À propos</a></li>
                    <li><a href="pages/actualites.html">Actualités</a></li>
                    <li><a href="pages/contact.html">Contact</a></li>
                </ul>"""

LIENS_INDEX_NEW = """                <ul>
                    <li><a href="pages/apropos.html">À propos</a></li>
                    <li><a href="pages/actualites.html">Actualités</a></li>
                    <li><a href="pages/devis.html">Demande de devis</a></li>
                    <li><a href="pages/contact.html">Contact</a></li>
                </ul>"""

LIENS_COMPONENT_OLD = """            <ul>
                <li><a href="recrutement.html">Recrutement</a></li>
                <li><a href="apropos.html">À propos</a></li>
                <li><a href="actualites.html">Actualités</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>"""

LIENS_COMPONENT_NEW = """            <ul>
                <li><a href="apropos.html">À propos</a></li>
                <li><a href="actualites.html">Actualités</a></li>
                <li><a href="devis.html">Demande de devis</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>"""

LIENS_GRID_OLD = """                    <ul>
                        <li><a href="../index.html">Accueil</a></li>
                        <li><a href="apropos.html">À Propos</a></li>
                        <li><a href="produits-services.html">Produits</a></li>
                        <li><a href="stations.html">Stations</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>"""

LIENS_GRID_NEW = """                    <ul>
                        <li><a href="../index.html">Accueil</a></li>
                        <li><a href="apropos.html">À propos</a></li>
                        <li><a href="actualites.html">Actualités</a></li>
                        <li><a href="devis.html">Demande de devis</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>"""


def patch(path: Path, old: str, new: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if old not in text:
        return False
    path.write_text(text.replace(old, new, 1), encoding="utf-8")
    return True


if patch(ROOT / "index.html", LIENS_INDEX_OLD, LIENS_INDEX_NEW):
    print("index.html")

if patch(ROOT / "components" / "footer.html", LIENS_COMPONENT_OLD, LIENS_COMPONENT_NEW):
    print("components/footer.html")

for rel in [
    "pages/devis.html",
    "pages/contact.html",
    "pages/recrutement.html",
    "pages/stations.html",
    "pages/rse.html",
    "pages/produits-services.html",
    "pages/apropos.html",
    "pages/actualites.html",
]:
    if patch(ROOT / rel, LIENS_PAGES_OLD, LIENS_PAGES_NEW):
        print(rel)

for rel in [
    "pages/partenaires.html",
    "pages/faq.html",
    "pages/certifications.html",
    "pages/calculateur.html",
    "pages/accessibilite.html",
    "pages/404.html",
]:
    if patch(ROOT / rel, LIENS_GRID_OLD, LIENS_GRID_NEW):
        print(rel)
