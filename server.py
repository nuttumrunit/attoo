from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent


class LocalMirrorHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        clean = unquote(urlsplit(path).path).lstrip("/")
        candidate = ROOT / clean
        if clean and not Path(clean).suffix and (candidate / "index.html").is_file():
            return str(candidate / "index.html")
        return str(candidate if clean else ROOT / "index.html")

    def send_head(self):
        # Serve extensionless mirrored routes directly, without redirecting to a
        # trailing slash. This preserves the original site's relative URL rules.
        clean = unquote(urlsplit(self.path).path).lstrip("/")
        candidate = ROOT / clean
        if clean and not Path(clean).suffix and (candidate / "index.html").is_file():
            path = candidate / "index.html"
            file = path.open("rb")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(path.stat().st_size))
            self.end_headers()
            return file
        return super().send_head()


if __name__ == "__main__":
    address = ("127.0.0.1", 4173)
    print(f"Snacks Paint Box is available at http://{address[0]}:{address[1]}/")
    ThreadingHTTPServer(address, LocalMirrorHandler).serve_forever()
