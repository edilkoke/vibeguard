#!/usr/bin/env node
// VibeGuard evaluation harness.
// Scans corpus/baseline (built WITHOUT VibeGuard) vs corpus/treated (WITH it),
// counts findings per VG class, and computes the reduction rate.
// Output: results/findings.json + results/report.md
import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { scanApp } from "./scanners.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS = join(HERE, "corpus");
const RESULTS = join(HERE, "results");
if (!existsSync(RESULTS)) mkdirSync(RESULTS, { recursive: true });

const apps = (set) => {
  const dir = join(CORPUS, set);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => statSync(join(dir, n)).isDirectory());
};

const perApp = { baseline: {}, treated: {} };
const totals = { baseline: {}, treated: {} };

for (const set of ["baseline", "treated"]) {
  for (const app of apps(set)) {
    const counts = scanApp(join(CORPUS, set, app));
    perApp[set][app] = counts;
    for (const [id, n] of Object.entries(counts)) totals[set][id] = (totals[set][id] || 0) + n;
  }
}

const ids = [...new Set([...Object.keys(totals.baseline), ...Object.keys(totals.treated)])].sort();
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
const baseTotal = sum(totals.baseline), treatTotal = sum(totals.treated);
const overall = baseTotal ? Math.round(((baseTotal - treatTotal) / baseTotal) * 100) : 0;

// ---- report.md ----
let md = `# VibeGuard evaluation report\n\n`;
md += `Apps scanned — baseline: ${apps("baseline").length}, treated: ${apps("treated").length}\n\n`;
md += `| VG | Baseline | Treated | Reduction |\n|----|---------:|--------:|----------:|\n`;
for (const id of ids) {
  const b = totals.baseline[id] || 0, t = totals.treated[id] || 0;
  const r = b ? Math.round(((b - t) / b) * 100) + "%" : "—";
  md += `| ${id} | ${b} | ${t} | ${r} |\n`;
}
md += `| **Total** | **${baseTotal}** | **${treatTotal}** | **${overall}%** |\n\n`;
md += `> Findings are detector hits per vulnerability class. This is the metric defined in the\n`;
md += `> development plan (vulnerability reduction rate). Add apps under \`corpus/baseline\` and\n`;
md += `> \`corpus/treated\` and re-run. The bundled corpus is a demo pair to validate the pipeline.\n`;

writeFileSync(join(RESULTS, "findings.json"), JSON.stringify({ perApp, totals, overall }, null, 2));
writeFileSync(join(RESULTS, "report.md"), md);

// ---- console summary ----
console.log(`\nVibeGuard evaluation`);
console.log(`  baseline findings : ${baseTotal}`);
console.log(`  treated findings  : ${treatTotal}`);
console.log(`  reduction         : ${overall}%`);
console.log(`  report            : evaluation/results/report.md\n`);
