// ---------- scorer-ruler: calibration drift alarm for the copy reviewer ----------
// Frank, 2026-10-29: the 5-point rubric scorer measured 56-96 on IDENTICAL text
// across runs. Median-of-N tames run-to-run noise, but nothing caught SCORER
// DRIFT (model updates, prompt edits, provider-side changes silently moving the
// scale). This script re-scores a fixed calibration set of articles whose
// pipeline-recorded scores are known, and alarms when the ruler moves.
//
// Usage:
//   node --import tsx scripts/verify/scorer-ruler.mjs [--runs 3] [--json]
// Config: scripts/verify/scorer-ruler.json — { "anchors": [ { "file": "...",
//   "recorded_score": 84, "recorded_model": "deepseek-v4.1-flash", "date": "..." } ] }
// Alarm: any anchor whose fresh median deviates > DRIFT_LIMIT (default 5) points
// from its recorded score, or mean absolute deviation across anchors > 4.
// Exit 1 on alarm (cron-able; fails closed), 0 on stable, 2 on config error.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CONFIG = path.join(__dirname, 'scorer-ruler.json');
const DRIFT_LIMIT = 5;
const MEAN_DEV_LIMIT = 4;

async function main() {
  const args = process.argv.slice(2);
  const runs = Math.max(1, parseInt(args[args.indexOf('--runs') + 1] || '3', 10) || 3);
  const asJson = args.includes('--json');
  if (!fs.existsSync(CONFIG)) {
    console.error(`scorer-ruler: missing config ${CONFIG}`);
    process.exit(2);
  }
  const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
  const anchors = Array.isArray(cfg.anchors) ? cfg.anchors : [];
  if (anchors.length < 3) {
    console.error('scorer-ruler: need >= 3 anchor articles to measure drift');
    process.exit(2);
  }

  const { evaluateArticle } = await import(path.join(__dirname, '..', 'review-article-copy.ts'));

  const rows = [];
  let alarmed = false;
  for (const a of anchors) {
    const abs = path.resolve(ROOT, a.file);
    if (!fs.existsSync(abs)) {
      rows.push({ file: a.file, error: 'missing file' });
      alarmed = true;
      continue;
    }
    const scores = [];
    for (let i = 0; i < runs; i++) {
      try {
        const r = await evaluateArticle(fs.readFileSync(abs, 'utf8'), {
          model: 'deepseek/deepseek-v4.1-flash',
        });
        scores.push(r.total_score || 0);
      } catch {
        scores.push(null);
      }
    }
    const valid = scores.filter((s) => s !== null).sort((x, y) => x - y);
    if (valid.length === 0) {
      rows.push({ file: a.file, error: 'all runs failed' });
      alarmed = true;
      continue;
    }
    const median = valid[Math.floor(valid.length / 2)];
    if (a.recorded_score === null || a.recorded_score === undefined) {
      // First ruler run for this anchor: establish the baseline, pass clean.
      a.recorded_score = median;
      cfg.anchors.find((x) => x.file === a.file).recorded_score = median;
      fs.writeFileSync(CONFIG, JSON.stringify(cfg, null, 2));
      rows.push({
        file: a.file,
        recorded: median,
        runs: scores,
        median,
        drift: 0,
        alarm: false,
        note: 'baseline set',
      });
      continue;
    }
    const drift = median - a.recorded_score;
    const row = {
      file: a.file,
      recorded: a.recorded_score,
      runs: scores,
      median,
      drift,
      alarm: Math.abs(drift) > DRIFT_LIMIT,
    };
    if (row.alarm) alarmed = true;
    rows.push(row);
  }

  const devs = rows.filter((r) => typeof r.drift === 'number').map((r) => Math.abs(r.drift));
  const meanDev = devs.length ? devs.reduce((a, b) => a + b, 0) / devs.length : null;
  if (meanDev !== null && meanDev > MEAN_DEV_LIMIT) alarmed = true;

  if (asJson) {
    console.log(JSON.stringify({ alarmed, mean_deviation: meanDev, rows }, null, 0));
  } else {
    console.log('SCORER RULER — calibration drift check');
    for (const r of rows) {
      if (r.error) {
        console.log(`  ❌ ${r.file}: ${r.error}`);
        continue;
      }
      const flag = r.alarm ? ' 🚨' : '';
      console.log(
        `  ${r.alarm ? '🚨' : '✅'} ${path.basename(r.file)}: recorded ${r.recorded}, fresh median ${r.median} (drift ${r.drift > 0 ? '+' : ''}${r.drift}, runs ${r.runs.join('/')})${flag}`
      );
    }
    console.log(
      `  mean |drift| = ${meanDev === null ? 'n/a' : meanDev.toFixed(1)} (limit ${MEAN_DEV_LIMIT}) — ${alarmed ? '🚨 ALARM: scorer scale has moved; do NOT compare new scores to old recorded scores until recalibrated' : 'stable'}`
    );
  }
  process.exit(alarmed ? 1 : 0);
}

main().catch((e) => {
  console.error(`scorer-ruler failed: ${e.message}`);
  process.exit(2);
});
