from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent
DESCRIPTION = (
    "Sattoo is a digital personality shaped by one developer's decade-long life "
    "in crypto, preserving the memories, failures, convictions, and realities behind Web3."
)

META_BLOCK = f'''    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sattoo's Room</title>
    <meta name="description" content="{DESCRIPTION}">
    <meta name="theme-color" content="#173f2b">
    <link rel="icon" type="image/png" href="/assets/sattoo-logo.png">
    <link rel="apple-touch-icon" href="/assets/sattoo-logo.png">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Sattoo">
    <meta property="og:title" content="Sattoo">
    <meta property="og:description" content="{DESCRIPTION}">
    <meta property="og:image" content="/assets/sattoo-logo.png">
    <meta property="og:image:width" content="1254">
    <meta property="og:image:height" content="1254">
    <meta property="og:image:alt" content="Sattoo">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Sattoo">
    <meta name="twitter:description" content="{DESCRIPTION}">
    <meta name="twitter:image" content="/assets/sattoo-logo.png">
'''

META_PATTERNS = (
    r"<title\b[^>]*>.*?</title>\s*",
    r"<meta\b[^>]*(?:name|property)=[\"'](?:description|theme-color|og:[^\"']+|twitter:[^\"']+)[\"'][^>]*>\s*",
    r"<meta\b[^>]*(?:name|property)=[\"'](?:og:[^\"']+|twitter:[^\"']+)[\"'][^>]*>\s*",
    r"<link\b[^>]*rel=[\"'](?:shortcut icon|icon|apple-touch-icon)[\"'][^>]*>\s*",
    r"<meta\b[^>]*charset=[\"'][^\"']+[\"'][^>]*>\s*",
    r"<meta\b[^>]*name=[\"']viewport[\"'][^>]*>\s*",
)

updated = 0
for page in ROOT.rglob("*.html"):
    relative = page.relative_to(ROOT).as_posix()
    if relative.startswith("original-reference/") or ".edge-" in relative or page.name.endswith("-source.html"):
        continue
    content = page.read_text(encoding="utf-8")
    head_match = re.search(r"(?is)<head\b[^>]*>(.*?)</head>", content)
    if not head_match:
        continue
    head = head_match.group(1)
    for pattern in META_PATTERNS:
        head = re.sub(pattern, "", head, flags=re.IGNORECASE | re.DOTALL)
    head = "\n" + META_BLOCK + head.lstrip("\r\n")
    content = content[: head_match.start(1)] + head + content[head_match.end(1) :]
    page.write_text(content, encoding="utf-8", newline="")
    updated += 1

print(f"Updated metadata in {updated} Sattoo HTML files.")
