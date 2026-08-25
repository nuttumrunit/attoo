import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "_site");
const base = (process.argv[3] || "/Sattoo").replace(/\/$/, "");
const textExtensions = new Set([".html", ".css", ".js"]);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(target);
    } else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
      const source = fs.readFileSync(target, "utf8");
      const prefixed = source.replace(/(["'])\/(?!\/|Sattoo(?:\/|["']))/g, `$1${base}/`);
      if (prefixed !== source) fs.writeFileSync(target, prefixed);
    }
  }
}

walk(root);
