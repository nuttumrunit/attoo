import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "_site");
const prefix = "/attoo/";
const textExtensions = new Set([".html", ".css", ".js", ".json", ".xml", ".webmanifest"]);

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else yield fullPath;
  }
}

function prefixRootPaths(source) {
  return source
    .replace(/(url\(\s*)\/(?!\/)/gi, `$1${prefix}`)
    .replace(/(["'`])\/(?!\/)(?=[A-Za-z0-9_.~-])/g, `$1${prefix}`)
    .replace(/(["'])\/\1/g, `$1${prefix}$1`);
}

for await (const file of walk(root)) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
  let source = await readFile(file, "utf8");
  const original = source;
  source = prefixRootPaths(source);
  if (path.extname(file).toLowerCase() === ".html" && !/<base\s/i.test(source)) {
    source = source.replace(/<head(\s[^>]*)?>/i, (head) => `${head}\n    <base href="${prefix}">`);
  }
  if (source !== original) await writeFile(file, source, "utf8");
}
