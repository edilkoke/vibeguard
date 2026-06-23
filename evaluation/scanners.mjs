// VibeGuard evaluation scanners — self-contained VG detectors (no external deps).
// scanApp(dir) -> { "VG-002": n, ... } counts per vulnerability class for one app.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const CODE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".env", ".json"]);

// Per-line / per-file regex detectors mapped to catalogue ids.
const DETECTORS = [
  { id: "VG-006", re: /createHash\(\s*["'](md5|sha1)["']\s*\)/i },
  { id: "VG-007", re: /(supersecret(jwt|key)?|password123|admin123|changeme|jwtsecret|your-secret-key|keyboardcat)/i },
  { id: "VG-008", re: /NEXT_PUBLIC_[A-Z0-9_]*(SECRET|SERVICE_ROLE|PRIVATE|TOKEN|STRIPE_SECRET|PASSWORD)/ },
  { id: "VG-011", re: /(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b[^;`'"]*(\$\{|["']\s*\+\s*)/ },
  { id: "VG-012", re: /(dangerouslySetInnerHTML|v-html)/ },
  { id: "VG-013", re: /child_process|\bexecSync\(|\bexec\(/ },
  { id: "VG-014", re: /pickle\.loads|yaml\.load\((?!.*Safe)|unserialize\(/ },
  { id: "VG-015", re: /localStorage\.(setItem|getItem)/ },
  { id: "VG-016", re: /console\.(log|info|debug|error)\([^)]*\b(password|token|secret|req|request|email)\b|[?&](token|password|secret|api[_-]?key|access_token)=/i },
];

function listFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) listFiles(p, acc);
    else acc.push(p);
  }
  return acc;
}

export function scanApp(appDir) {
  const counts = {};
  const files = listFiles(appDir);
  let sqlHasCreate = false, sqlHasRls = false;

  for (const f of files) {
    const ext = extname(f);
    const text = readFileSync(f, "utf8");

    if (ext === ".sql") {
      if (/create\s+table/i.test(text)) sqlHasCreate = true;
      if (/enable\s+row\s+level\s+security/i.test(text)) sqlHasRls = true;
    }
    if (!CODE_EXTS.has(ext) && ext !== ".sql") continue;

    for (const line of text.split("\n")) {
      for (const d of DETECTORS) {
        if (d.re.test(line)) counts[d.id] = (counts[d.id] || 0) + 1;
      }
    }
  }
  // VG-002: a table is created but RLS is never enabled (whole-app heuristic).
  if (sqlHasCreate && !sqlHasRls) counts["VG-002"] = (counts["VG-002"] || 0) + 1;

  return counts;
}
