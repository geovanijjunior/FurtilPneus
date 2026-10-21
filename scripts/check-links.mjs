#!/usr/bin/env node
// Varre o HTML pré-renderizado em .next/server/app e falha se algum href
// interno não corresponder a uma rota gerada ou a um arquivo em public/.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = ".next/server/app";
if (!existsSync(root)) {
  console.error("Build não encontrado. Rode `npm run build` antes.");
  process.exit(1);
}

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".html")) out.push(p);
  }
  return out;
}

const files = walk(root);
const routes = new Set(
  files.map((f) => {
    const r =
      "/" +
      relative(root, f)
        .replace(/\.html$/, "")
        .replace(/(^|\/)index$/, "");
    return r === "/" ? "/" : r.replace(/\/$/, "");
  }),
);
for (const extra of ["/sitemap.xml", "/robots.txt"]) routes.add(extra);

const broken = [];
let checked = 0;
for (const f of files) {
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) continue;
    checked++;
    const path = decodeURI(href.split(/[?#]/)[0]).replace(/\/$/, "") || "/";
    if (routes.has(path) || existsSync(join("public", path))) continue;
    broken.push(`${relative(root, f)} → ${href}`);
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} link(s) quebrado(s):\n  ` + [...new Set(broken)].join("\n  "));
  process.exit(1);
}
console.log(`✓ ${checked} links internos verificados em ${files.length} páginas, nenhum quebrado.`);
