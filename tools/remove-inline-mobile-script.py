#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = [
    ROOT / "index.html",
    ROOT / "pages" / "stations.html",
    ROOT / "pages" / "recrutement.html",
    ROOT / "pages" / "produits-services.html",
    ROOT / "pages" / "devis.html",
    ROOT / "pages" / "contact.html",
    ROOT / "pages" / "actualites.html",
]
PATTERN = re.compile(r"\s*<!-- Script Menu Mobile Simple -->\s*<script>.*?</script>", re.DOTALL)

for path in FILES:
    text = path.read_text(encoding="utf-8")
    new, n = PATTERN.subn("", text, count=1)
    if n:
        path.write_text(new, encoding="utf-8", newline="\n")
        print("OK", path.name)
    else:
        print("SKIP", path.name)
