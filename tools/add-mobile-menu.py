from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "pages"

EXTENDED = """
    <!-- Menu Mobile HTML -->
    <div class="mobile-menu">
        <a href="../index.html">Accueil</a>
        <a href="apropos.html">À Propos</a>
        <a href="produits-services.html">Produits & Services</a>
        <a href="stations.html">Stations</a>
        <a href="actualites.html">Actualités</a>
        <a href="recrutement.html">Recrutement</a>
        <a href="contact.html">Contact</a>
        <a href="https://fidelity.sip-ci.net/" class="mobile-menu-espace-client" target="_blank" rel="noopener noreferrer">Espace client</a>
    </div>
"""

files = [
    "accessibilite.html",
    "partenaires.html",
    "certifications.html",
    "404.html",
    "rse.html",
    "faq.html",
    "calculateur.html",
]

for name in files:
    path = ROOT / name
    text = path.read_text(encoding="utf-8")
    if '<div class="mobile-menu">' in text:
        print("skip", name)
        continue
    if "</body>" not in text:
        print("no body", name)
        continue
    text = text.replace("</body>", EXTENDED + "</body>", 1)
    path.write_text(text, encoding="utf-8")
    print("updated", name)
