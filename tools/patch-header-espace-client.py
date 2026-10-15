#!/usr/bin/env python3
"""Met à jour les en-têtes (espace client) et les menus mobiles du site."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIDELITY = "https://fidelity.sip-ci.net/"

index_html = (ROOT / "index.html").read_text(encoding="utf-8")
start = index_html.index("            <!--\n            <div class=\"social-icons-header\">")
end = index_html.index("            <button class=\"mobile-menu-toggle\"", start)
HEADER_REPLACE = index_html[start:end].rstrip() + "\n"

HEADER_INSERT = f"""            <div class="social-icons-header">
                <a href="{FIDELITY}" class="social-icon" target="_blank" rel="noopener noreferrer" title="Espace client Fidelity" aria-label="Espace client — connexion Fidelity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </a>
            </motion>
""".replace("</motion>", "</motion>").replace("<motion", "<div").replace("</motion>", "</div>")

MOBILE_LINK = f'        <a href="{FIDELITY}" class="mobile-menu-espace-client" target="_blank" rel="noopener noreferrer">Espace client</a>\n'

SOCIAL_OLD = re.compile(
    r"            <div class=\"social-icons-header\">\s*"
    r"(?:<a href=\"#\" class=\"social-icon\"[^>]*>.*?</a>\s*){4}"
    r"</div>",
    re.DOTALL,
)


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text

    if SOCIAL_OLD.search(text):
        text = SOCIAL_OLD.sub(HEADER_REPLACE, text, count=1)
    elif "social-icons-header" not in text and re.search(
        r"</ul>\s*\n\s*<button class=\"(?:mobile-menu-toggle|menu-toggle)\"",
        text,
    ):
        text = re.sub(
            r"(</ul>\s*\n)(            <button class=\"(?:mobile-menu-toggle|menu-toggle)\")",
            r"\1" + HEADER_INSERT + r"\n\2",
            text,
            count=1,
        )

    if 'class="mobile-menu"' in text and "mobile-menu-espace-client" not in text:
        text = re.sub(
            r"(        <a href=\"[^\"]*contact\.html\"[^>]*>Contact</a>\s*\n)(    </div>)",
            r"\1" + MOBILE_LINK + r"\2",
            text,
            count=1,
        )

    if text != orig:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main():
    updated = []
    for path in sorted(ROOT.rglob("*.html")):
        if "components" in path.parts or "tools" in path.parts or path.name.startswith("old_"):
            continue
        if patch_file(path):
            updated.append(str(path.relative_to(ROOT)))
    print("Updated", len(updated), "file(s):")
    for p in updated:
        print(" ", p)


if __name__ == "__main__":
    main()
