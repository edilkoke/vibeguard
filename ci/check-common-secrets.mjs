#!/usr/bin/env node
// VibeGuard common-secret blocklist. (VG-007)
// Fails if any known-common LLM default secret appears in application source.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const SELF_DIR = dirname(fileURLToPath(import.meta.url));
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", "build", "ci", ".github", "docs", "rules", "evaluation"]);
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".env"]);

const list = readFileSync(join(SELF_DIR, "common-secrets.txt"), "utf8")
  .split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#")).map(l => l.toLowerCase());

const findings = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p);
    } else {
      if (basename(p).includes(".example")) continue;
      if (!EXTS.has(extname(p))) continue;
      const lines = readFileSync(p, "utf8").split("\n");
      lines.forEach((line, i) => {
        const low = line.toLowerCase();
        for (const secret of list) {
          if (low.includes(secret)) findings.push({ file: p.replace(ROOT + "/", ""), line: i + 1, secret });
        }
      });
    }
  }
}
walk(ROOT);

if (findings.length) {
  console.error("VG-007 FAIL — known-common secret(s) found:");
  for (const f of findings) console.error(`  ${f.file}:${f.line}  ->  "${f.secret}"`);
  console.error("Generate secrets with a CSPRNG and store them in a secrets manager.");
  process.exit(1);
}
console.log("VG-007 OK — no known-common secrets found.");
