from pathlib import Path


ROOT = Path(__file__).resolve().parent
MARKER = b'<link rel="stylesheet" href="/sky-background.css">'
FISH_MARKER = b'<script src="/js/fish-cursor.js"></script>'

updated = 0
for page in ROOT.rglob("*.html"):
    if page.name == "pagemelt-source.html" or ".edge-" in page.as_posix():
        continue
    content = page.read_bytes()
    changed = False
    if MARKER not in content:
        lower = content.lower()
        position = lower.find(b"</head>")
        if position >= 0:
            content = content[:position] + b'    ' + MARKER + b'\r\n' + content[position:]
            changed = True
    if FISH_MARKER not in content:
        lower = content.lower()
        position = lower.rfind(b"</body>")
        if position < 0:
            position = lower.rfind(b"</html>")
        if position >= 0:
            content = content[:position] + b'    ' + FISH_MARKER + b'\r\n' + content[position:]
            changed = True
    if changed:
        page.write_bytes(content)
        updated += 1

print(f"Injected sky background into {updated} HTML files.")
