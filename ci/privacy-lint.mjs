#!/usr/bin/env node
// VibeGuard privacy lint. (VG-016)
// Flags PII/secrets in logs and sensitive data in URLs.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

const ROOT = process.cwd();
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", "build", "ci", ".github", "docs", "rules", "evaluation"]);
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const CHECKS = [
  { id: "VG-016", re: /console\.(log|info|debug|error)\([^)]*\b(password|token|secret|req|request|email|ssn)\b/i,
    msg: "PII/secret possibly written to logs — never log full requests, passwords, tokens, or emails." },
  { id: "VG-016", re: /[?&](token|password|secret|api[_-]?key|access_token|reset_token)=/i,
    msg: "Sensitive value in a URL/query string — use headers or the request body instead." },
];

const findings = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { if (!SKIP_DIRS.has(name)) walk(p); continue; }
    if (basename(p).includes(".example")) continue;
    if (!EXTS.has(extname(p))) continue;
    readFileSync(p, "utf8").split("\n").forEach((line, i) => {
      for (const c of CHECKS) if (c.re.test(line)) findings.push({ file: p.replace(ROOT + "/", ""), line: i + 1, id: c.id, msg: c.msg });
    });
  }
}
walk(ROOT);

if (findings.length) {
  console.error("Privacy lint FAIL:");
  for (const f of findings) console.error(`  ${f.file}:${f.line}  [${f.id}] ${f.msg}`);
  process.exit(1);
}
console.log("Privacy lint OK — no PII-in-logs or tokens-in-URLs found.");
