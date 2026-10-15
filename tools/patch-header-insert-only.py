#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIDELITY = "https://fidelity.sip-ci.net/"
INSERT = f"""            <motion class="social-icons-header">
                <a href="{FIDELITY}" class="social-icon" target="_blank" rel="noopener noreferrer" title="Espace client Fidelity" aria-label="Espace client — connexion Fidelity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </a>
            </div>
""".replace("<motion ", "<div ", 1)

for path in sorted(ROOT.glob("pages/*.html")):
    if path.name.startswith("old_"):
        continue
    text = path.read_text(encoding="utf-8")
    if "fidelity.sip-ci.net" in text or "social-icons-header" in text:
        continue
    if "</ul>" not in text or "<header>" not in text:
        continue
    new_text = re.sub(
        r"(</ul>\s*\n)(        </nav>)",
        r"\1" + INSERT + r"\n\2",
        text,
        count=1,
    )
    if new_text != text:
        path.write_text(new_text, encoding="utf-8", newline="\n")
        print(path.name)
