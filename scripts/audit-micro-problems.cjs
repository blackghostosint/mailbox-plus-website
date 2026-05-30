#!/usr/bin/env node

/**
 * Micro-Problem Governance Audit Script
 *
 * Purpose: Analyze micro-problem pages against governance signals
 * Authority: MICRO_PROBLEM_GOVERNANCE.md
 * Frequency: Quarterly (every 90 days)
 *
 * Usage:
 *   node scripts/audit-micro-problems.cjs --search-console=path/to/search-console.csv
 *
 * Outputs:
 *   - Console report of all pages
 *   - Audit report markdown file
 *   - List of recommended actions (DELETE, MERGE, REWRITE, KEEP)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================================================
// CONFIGURATION
// ============================================================================

const SCRIPT_DIR = __dirname;
const AUDIT_DIR = path.join(SCRIPT_DIR, 'audits');
const SEARCH_CONSOLE_DIR = path.join(AUDIT_DIR, 'search-console-data');
const REPORTS_DIR = path.join(AUDIT_DIR, 'reports');
const STAFF_FEEDBACK_DIR = path.join(AUDIT_DIR, 'staff-feedback');
const CONFIG_DIR = path.join(__dirname, '../src/config/micro-problems');

// Ensure directories exist
[AUDIT_DIR, SEARCH_CONSOLE_DIR, REPORTS_DIR, STAFF_FEEDBACK_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ============================================================================
// PARSE ARGUMENTS
// ============================================================================

const args = process.argv.slice(2);
let searchConsoleFile = null;
let dryRun = false;
let showHelp = false;

args.forEach((arg) => {
  if (arg.startsWith('--search-console=')) {
    searchConsoleFile = arg.split('=')[1];
  }
  if (arg === '--dry-run') {
    dryRun = true;
  }
  if (arg === '--help' || arg === '-h') {
    showHelp = true;
  }
});

if (showHelp) {
  console.log(`
Micro-Problem Governance Audit Script

Usage:
  node scripts/audit-micro-problems.cjs --search-console=path/to/search-console.csv
  node scripts/audit-micro-problems.cjs --dry-run

Options:
  --search-console=<path>  Path to Google Search Console CSV export
  --dry-run                Run with mock data for testing
  --help, -h               Show this help message

CSV Format:
  The CSV must have the following columns: Page, Clicks, Impressions, CTR, Position
  (CTR and Position are optional but recommended)

Output:
  - Console summary with recommended actions
  - Markdown report in scripts/audits/reports/

Actions:
  DELETE  - Page has no search visibility or intent overlap
  MERGE   - Duplicate intentKey detected
  REWRITE - Has impressions but no clicks (title/meta mismatch)
  KEEP    - Passes all automated signals
`);
  process.exit(0);
}

if (!searchConsoleFile && !dryRun) {
  console.error('❌ Error: --search-console argument is required');
  console.error(
    'Usage: node scripts/audit-micro-problems.cjs --search-console=path/to/search-console.csv'
  );
  console.error('   Or: node scripts/audit-micro-problems.cjs --dry-run (for testing without CSV)');
  process.exit(1);
}

if (searchConsoleFile && !fs.existsSync(searchConsoleFile)) {
  console.error(`❌ Error: Search Console file not found: ${searchConsoleFile}`);
  process.exit(1);
}

// ============================================================================
// CSV PARSING FOR GOOGLE SEARCH CONSOLE
// ============================================================================

function parseSearchConsoleCSV(filePath) {
  console.log(`📊 Parsing Search Console data from: ${filePath}\n`);

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n').filter((line) => line.trim());

  if (lines.length < 2) {
    console.warn('⚠️  CSV file appears to be empty or has no data rows');
    return {};
  }

  // Parse header
  const header = parseCSVLine(lines[0]);
  const pageIdx = header.findIndex((h) => h.toLowerCase().includes('page'));
  const clicksIdx = header.findIndex((h) => h.toLowerCase().includes('click'));
  const impressionsIdx = header.findIndex((h) => h.toLowerCase().includes('impression'));
  const ctrIdx = header.findIndex(
    (h) => h.toLowerCase().includes('ctr') || h.toLowerCase().includes('click-through')
  );
  const positionIdx = header.findIndex(
    (h) => h.toLowerCase().includes('position') || h.toLowerCase().includes('rank')
  );

  if (pageIdx === -1 || clicksIdx === -1 || impressionsIdx === -1) {
    console.error('❌ Error: CSV must have Page, Clicks, and Impressions columns');
    process.exit(1);
  }

  const data = {};

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < header.length) continue;

    const pageUrl = row[pageIdx].trim();
    const clicks = parseFloat(row[clicksIdx]) || 0;
    const impressions = parseFloat(row[impressionsIdx]) || 0;
    const ctr = ctrIdx !== -1 ? parseFloat(row[ctrIdx]) || 0 : 0;
    const position = positionIdx !== -1 ? parseFloat(row[positionIdx]) || 0 : 0;

    // Extract slug from URL (handle full URLs or just paths)
    let slug = pageUrl;
    if (slug.includes('://')) {
      const urlObj = new URL(pageUrl);
      slug = urlObj.pathname;
    }

    // Remove trailing slash
    slug = slug.replace(/\/$/, '');

    data[slug] = {
      url: pageUrl,
      clicks,
      impressions,
      ctr,
      position,
      slug,
    };
  }

  console.log(`  Loaded ${Object.keys(data).length} page records\n`);
  return data;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result.map((v) => v.replace(/^"(.*)"$/, '$1'));
}

// ============================================================================
// LOAD MICRO-PROBLEMS CONFIG FROM TYPESCRIPT FILES
// ============================================================================

function loadMicroProblemsConfig() {
  console.log('📦 Loading micro-problems configuration from TypeScript files...\n');

  const configFiles = ['returns.ts', 'shipping.ts', 'packaging.ts', 'misc.ts'];

  const microProblems = [];
  const slugSet = new Set();
  const idSet = new Set();

  configFiles.forEach((fileName) => {
    const filePath = path.join(CONFIG_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  Config file not found: ${fileName} (skipping)`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileProblems = parseTypeScriptConfig(fileContent, fileName);
    microProblems.push(...fileProblems);
  });

  // Validate uniqueness
  microProblems.forEach((mp) => {
    if (idSet.has(mp.id)) {
      console.warn(`  ⚠️  Duplicate ID found: ${mp.id}`);
    }
    if (slugSet.has(mp.slug)) {
      console.warn(`  ⚠️  Duplicate slug found: ${mp.slug}`);
    }
    idSet.add(mp.id);
    slugSet.add(mp.slug);
  });

  console.log(`  Found ${microProblems.length} micro-problem pages to audit\n`);
  return microProblems;
}

function parseTypeScriptConfig(fileContent, fileName) {
  const problems = [];

  // Find the array content after the = sign
  // Handle: export const varName: Type[] = [
  // Or: export const varName = [
  const equalSignIndex = fileContent.indexOf('=');
  if (equalSignIndex === -1) {
    console.log(`  ⚠️  Could not find = sign in ${fileName}`);
    return problems;
  }

  // Find the [ after =
  let bracketStart = -1;
  for (let i = equalSignIndex + 1; i < fileContent.length; i++) {
    if (fileContent[i] === '[') {
      bracketStart = i;
      break;
    }
    if (fileContent[i] === '\n') break; // Don't search past first newline
  }

  if (bracketStart === -1) {
    console.log(`  ⚠️  Could not find array in ${fileName}`);
    return problems;
  }

  // Extract everything from the first [ to the matching ]
  let bracketCount = 0;
  let arrayContent = '';
  let inString = false;
  let stringChar = '';
  let escapeNext = false;

  for (let i = bracketStart; i < fileContent.length; i++) {
    const char = fileContent[i];

    if (escapeNext) {
      arrayContent += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      arrayContent += char;
      escapeNext = true;
      continue;
    }

    if (inString) {
      arrayContent += char;
      if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      arrayContent += char;
      continue;
    }

    if (char === '[') bracketCount++;
    if (char === ']') bracketCount--;

    arrayContent += char;

    if (bracketCount === 0 && i > bracketStart) {
      break;
    }
  }

  // Parse individual objects from the array
  const objects = extractObjectsFromArray(arrayContent.slice(1, -1));

  objects.forEach((objStr, idx) => {
    try {
      const parsed = parseTypeScriptObject(objStr);
      if (parsed && parsed.id) {
        problems.push(parsed);
      }
    } catch (err) {
      console.log(`  ⚠️  Error parsing object #${idx} in ${fileName}: ${err.message}`);
    }
  });

  return problems;
}

function extractObjectsFromArray(arrayContent) {
  const objects = [];
  let current = '';
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  let escapeNext = false;

  for (let i = 0; i < arrayContent.length; i++) {
    const char = arrayContent[i];

    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      current += char;
      escapeNext = true;
      continue;
    }

    if (inString) {
      current += char;
      if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      current += char;
      continue;
    }

    if (char === '{') {
      if (braceCount === 0) current = '';
      braceCount++;
    }

    if (braceCount > 0) {
      current += char;
    }

    if (char === '}') {
      braceCount--;
      if (braceCount === 0) {
        objects.push(current);
        current = '';
      }
    }
  }

  return objects;
}

function parseTypeScriptObject(objStr) {
  const result = {};

  // Extract key-value pairs more carefully
  // Handle nested structures by tracking braces/brackets

  const keyValuePattern = /(\w+)\s*:\s*/g;
  let match;
  let lastIndex = 0;

  while ((match = keyValuePattern.exec(objStr)) !== null) {
    const key = match[1];
    const valueStart = match.index + match[0].length;

    // Find the end of this value
    let valueEnd = objStr.length;
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let escapeNext = false;

    for (let i = valueStart; i < objStr.length; i++) {
      const char = objStr[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === '\\' && inString) {
        escapeNext = true;
        continue;
      }

      if (inString) {
        if (char === stringChar) {
          inString = false;
        }
        continue;
      }

      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
        continue;
      }

      if (char === '{' || char === '[') {
        depth++;
        continue;
      }

      if (char === '}' || char === ']') {
        depth--;
        continue;
      }

      if (depth === 0 && (char === ',' || char === '}')) {
        valueEnd = i;
        break;
      }
    }

    let value = objStr.substring(valueStart, valueEnd).trim();

    // Remove trailing comma
    if (value.endsWith(',')) {
      value = value.slice(0, -1).trim();
    }

    // Parse value
    try {
      if (value.startsWith('"') && value.endsWith('"')) {
        result[key] = value.slice(1, -1).replace(/\\"/g, '"');
      } else if (value.startsWith("'") && value.endsWith("'")) {
        result[key] = value.slice(1, -1).replace(/\\'/g, "'");
      } else if (value === 'true') {
        result[key] = true;
      } else if (value === 'false') {
        result[key] = false;
      } else if (value === 'null' || value === 'undefined') {
        result[key] = null;
      } else if (!isNaN(Number(value)) && value !== '') {
        result[key] = Number(value);
      } else if (value.includes('getServiceImageUrl')) {
        result[key] = '[image]';
      } else if (value.startsWith('[') || value.startsWith('{')) {
        // Complex nested structure - store as string
        result[key] = '[complex]';
      } else {
        result[key] = value;
      }
    } catch (err) {
      result[key] = value.substring(0, 100);
    }
  }

  return result;
}

// ============================================================================
// LOAD STAFF FEEDBACK
// ============================================================================

function loadStaffFeedback() {
  const feedback = {};
  const feedbackDir = STAFF_FEEDBACK_DIR;

  if (!fs.existsSync(feedbackDir)) {
    console.log('  ℹ️  No staff feedback directory found (optional)\n');
    return feedback;
  }

  const files = fs.readdirSync(feedbackDir).filter((f) => f.endsWith('.json'));

  files.forEach((file) => {
    try {
      const content = fs.readFileSync(path.join(feedbackDir, file), 'utf-8');
      const data = JSON.parse(content);

      if (data.pageId && data.feedback) {
        feedback[data.pageId] = data;
      }
    } catch (err) {
      console.log(`  ⚠️  Error reading feedback file ${file}: ${err.message}`);
    }
  });

  console.log(`  Loaded ${Object.keys(feedback).length} staff feedback entries\n`);
  return feedback;
}

// ============================================================================
// SIGNAL EVALUATION
// ============================================================================

function evaluateSignalA(service, searchData) {
  // Signal A: Search Console Performance
  // FAIL: 0 impressions OR impressions > 0 but clicks = 0

  const slug = service.slug;
  const pageData = searchData[slug] || {
    url: '',
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };

  const hasImpressions = pageData.impressions > 0;
  const hasClicks = pageData.clicks > 0;

  const fail = !hasImpressions || (hasImpressions && !hasClicks);

  let reason = '';
  if (!hasImpressions) {
    reason = '0 impressions in last 90 days';
  } else if (!hasClicks) {
    reason = `Impressions exist (${pageData.impressions}) but 0 clicks`;
  } else {
    reason = `${pageData.impressions} impressions, ${pageData.clicks} clicks, position ${pageData.position.toFixed(1)}`;
  }

  return {
    signal: 'A',
    name: 'Search Console Performance',
    pass: !fail,
    fail,
    data: pageData,
    reason,
  };
}

function evaluateSignalB(service, staffFeedback) {
  // Signal B: User Intent Reality
  // FAIL if staff reports confusion, false expectations, or increased friction

  const feedback = staffFeedback[service.id];

  if (!feedback) {
    return {
      signal: 'B',
      name: 'User Intent Reality',
      pass: true,
      fail: false,
      reason: 'No staff feedback recorded (assumed PASS)',
      hasFeedback: false,
    };
  }

  const hasNegativeFeedback =
    feedback.feedback === 'negative' ||
    feedback.confusion === true ||
    feedback.falseExpectations === true;

  return {
    signal: 'B',
    name: 'User Intent Reality',
    pass: !hasNegativeFeedback,
    fail: hasNegativeFeedback,
    reason: hasNegativeFeedback
      ? `Staff feedback: ${feedback.notes || 'Negative feedback reported'}`
      : `Staff feedback: ${feedback.notes || 'Positive feedback'}`,
    hasFeedback: true,
    feedback,
  };
}

function evaluateSignalC(service, allServices) {
  // Signal C: Intent Overlap
  // FAIL: Two pages share the same intentKey

  if (!service.intentKey) {
    return {
      signal: 'C',
      name: 'Intent Overlap',
      pass: true,
      fail: false,
      reason: 'No intentKey defined (assumed unique)',
    };
  }

  const duplicates = allServices.filter(
    (s) => s.id !== service.id && s.intentKey && s.intentKey === service.intentKey
  );

  const hasDuplicates = duplicates.length > 0;

  return {
    signal: 'C',
    name: 'Intent Overlap',
    pass: !hasDuplicates,
    fail: hasDuplicates,
    reason: hasDuplicates
      ? `Duplicate intentKey "${service.intentKey}" found in: ${duplicates.map((d) => d.id).join(', ')}`
      : `Unique intentKey "${service.intentKey}"`,
    duplicates: duplicates.map((d) => ({
      id: d.id,
      slug: d.slug,
      serviceName: d.serviceName,
    })),
  };
}

// ============================================================================
// DECISION MATRIX
// ============================================================================

function makeDecision(service, signals, allServices) {
  const signalA = signals.find((s) => s.signal === 'A');
  const signalB = signals.find((s) => s.signal === 'B');
  const signalC = signals.find((s) => s.signal === 'C');

  // DELETE IF: Signal A FAIL (0 impressions) AND Signal C FAIL (intent overlap)
  if (signalA.fail && signalC.fail) {
    return {
      action: 'DELETE',
      reason: 'No impressions + Intent overlap with better-performing page',
      confidence: 'HIGH',
      signals,
    };
  }

  // DELETE IF: Signal A FAIL (0 impressions) - no search visibility
  if (signalA.fail && signalA.data.impressions === 0) {
    return {
      action: 'DELETE',
      reason: '0 impressions in last 90 days - page has no search visibility',
      confidence: 'HIGH',
      signals,
    };
  }

  // DELETE IF: Signal A FAIL (0 clicks despite impressions) AND Signal B FAIL
  if (signalA.fail && signalB.fail) {
    return {
      action: 'DELETE',
      reason: 'No clicks despite impressions + Staff reports confusion/false expectations',
      confidence: 'HIGH',
      signals,
    };
  }

  // MERGE IF: Intent overlap exists (Signal C FAIL)
  if (signalC.fail) {
    const duplicates = signalC.duplicates || [];
    return {
      action: 'MERGE',
      reason: `Intent overlap detected with ${duplicates.map((d) => d.id).join(', ')}`,
      confidence: 'MEDIUM',
      signals,
      note: 'Review which page performs better and merge weaker into stronger',
      mergeTargets: duplicates,
    };
  }

  // REWRITE IF: Has impressions but 0 clicks (Signal A FAIL but has impressions)
  if (signalA.fail && signalA.data.impressions > 0 && signalA.data.clicks === 0) {
    return {
      action: 'REWRITE',
      reason: `Impressions (${signalA.data.impressions}) but 0 clicks - title/meta may be misleading`,
      confidence: 'MEDIUM',
      signals,
      note: 'Review and rewrite heroTitle, heroSubtitle, metaDescription to better match user intent',
    };
  }

  // REWRITE IF: Traffic exists (Signal A PASS) but Signal B FAIL
  if (signalA.pass && signalB.fail) {
    return {
      action: 'REWRITE',
      reason: 'Has traffic but staff reports confusion or false expectations',
      confidence: 'MEDIUM',
      signals,
      note: 'Clarify heroTitle, heroSubtitle, metaDescription to set correct expectations',
    };
  }

  // KEEP: Default - passes all automated signals
  return {
    action: 'KEEP',
    reason: 'Passes all automated signals',
    confidence: 'HIGH',
    signals,
  };
}

// ============================================================================
// GENERATE AUDIT REPORT
// ============================================================================

function generateAuditReport(auditResults) {
  const timestamp = new Date().toISOString().split('T')[0];
  const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
  const reportFileName = `${timestamp}-${quarter}-micro-problem-audit.md`;
  const reportPath = path.join(REPORTS_DIR, reportFileName);

  let report = `# Micro-Problem Page Governance Audit\n\n`;
  report += `**Date**: ${timestamp}\n`;
  report += `**Quarter**: ${quarter}\n`;
  report += `**Total Pages Audited**: ${auditResults.length}\n\n`;

  // Summary
  const summary = {
    DELETE: auditResults.filter((r) => r.decision.action === 'DELETE').length,
    MERGE: auditResults.filter((r) => r.decision.action === 'MERGE').length,
    REWRITE: auditResults.filter((r) => r.decision.action === 'REWRITE').length,
    KEEP: auditResults.filter((r) => r.decision.action === 'KEEP').length,
  };

  report += `## Summary\n\n`;
  report += `- ❌ **DELETE**: ${summary.DELETE}\n`;
  report += `- 🔀 **MERGE**: ${summary.MERGE}\n`;
  report += `- ✏️ **REWRITE**: ${summary.REWRITE}\n`;
  report += `- ✅ **KEEP**: ${summary.KEEP}\n\n`;

  report += `---\n\n`;

  // Detailed results
  report += `## Detailed Results\n\n`;

  auditResults.forEach((result) => {
    const { service, decision } = result;

    report += `### ${service.id}\n\n`;
    report += `**Service Name**: ${service.serviceName || 'N/A'}\n\n`;
    report += `**Slug**: \`${service.slug}\`\n\n`;
    report += `**Decision**: **${decision.action}**\n\n`;
    report += `**Confidence**: ${decision.confidence}\n\n`;

    report += `**Signals**:\n\n`;

    decision.signals.forEach((signal) => {
      const icon = signal.pass ? '✅' : '❌';
      report += `- ${icon} **Signal ${signal.signal}** (${signal.name}): ${signal.pass ? 'PASS' : 'FAIL'}\n`;
      report += `  - ${signal.reason}\n`;
    });

    report += `\n**Rationale**: ${decision.reason}\n\n`;

    if (decision.note) {
      report += `**Note**: ${decision.note}\n\n`;
    }

    if (decision.mergeTargets) {
      report += `**Merge Targets**:\n`;
      decision.mergeTargets.forEach((target) => {
        report += `- ${target.id} (${target.slug})\n`;
      });
      report += `\n`;
    }

    report += `**Action Taken**: [To be filled in after implementing changes]\n\n`;
    report += `---\n\n`;
  });

  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Audit report saved to: ${reportPath}\n`);

  return reportPath;
}

// ============================================================================
// CONSOLE SUMMARY
// ============================================================================

function printConsoleSummary(auditResults) {
  console.log('\n' + '='.repeat(60));
  console.log('🎯 AUDIT SUMMARY');
  console.log('='.repeat(60) + '\n');

  const actions = {
    DELETE: [],
    MERGE: [],
    REWRITE: [],
    KEEP: [],
  };

  auditResults.forEach((result) => {
    actions[result.decision.action].push(result);
  });

  // DELETE
  if (actions.DELETE.length > 0) {
    console.log('❌ DELETE (' + actions.DELETE.length + '):');
    actions.DELETE.forEach((r) => {
      console.log(`   - ${r.service.id} (${r.service.slug})`);
      console.log(`     Reason: ${r.decision.reason}`);
    });
    console.log('');
  }

  // MERGE
  if (actions.MERGE.length > 0) {
    console.log('🔀 MERGE (' + actions.MERGE.length + '):');
    actions.MERGE.forEach((r) => {
      console.log(`   - ${r.service.id} (${r.service.slug})`);
      console.log(`     Reason: ${r.decision.reason}`);
    });
    console.log('');
  }

  // REWRITE
  if (actions.REWRITE.length > 0) {
    console.log('✏️  REWRITE (' + actions.REWRITE.length + '):');
    actions.REWRITE.forEach((r) => {
      console.log(`   - ${r.service.id} (${r.service.slug})`);
      console.log(`     Reason: ${r.decision.reason}`);
    });
    console.log('');
  }

  // KEEP
  if (actions.KEEP.length > 0) {
    console.log('✅ KEEP (' + actions.KEEP.length + '):');
    actions.KEEP.forEach((r) => {
      console.log(`   - ${r.service.id} (${r.service.slug})`);
    });
    console.log('');
  }

  console.log('='.repeat(60));
  console.log(`Total: ${auditResults.length} pages audited`);
  console.log('='.repeat(60) + '\n');
}

// ============================================================================
// CREATE MOCK CSV FOR TESTING
// ============================================================================

function createMockCSV() {
  const mockDir = SEARCH_CONSOLE_DIR;
  const mockFile = path.join(mockDir, 'mock-search-console.csv');

  if (fs.existsSync(mockFile)) {
    return mockFile;
  }

  console.log('📝 Creating mock Search Console CSV for testing...\n');

  let csv = 'Page,Clicks,Impressions,CTR,Position\n';

  // Add some mock data for testing
  const mockPages = [
    ['https://mailboxplus.com/return-without-original-box', 12, 150, 0.08, 15.2],
    ['https://mailboxplus.com/print-return-label-without-printer', 0, 80, 0, 22.1],
    [
      'https://mailboxplus.com/ship-a-fragile-item-safely-in-concord-township-glass-ceramics-electronics',
      45,
      600,
      0.075,
      8.5,
    ],
    [
      'https://mailboxplus.com/ship-an-odd-shaped-or-oversized-item-in-concord-township-guitars-lamps-sports-equipment',
      0,
      0,
      0,
      0,
    ],
  ];

  mockPages.forEach((row) => {
    csv += `"${row[0]}",${row[1]},${row[2]},${row[3]},${row[4]}\n`;
  });

  fs.writeFileSync(mockFile, csv);
  console.log(`  Created mock CSV at: ${mockFile}\n`);

  return mockFile;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  console.log('🚀 Starting Micro-Problem Governance Audit\n');
  console.log('='.repeat(60) + '\n');

  // Use mock data for dry run
  if (dryRun) {
    console.log('🧪 DRY RUN MODE - Using mock data\n');
    searchConsoleFile = createMockCSV();
  }

  // Load Search Console data
  const searchData = parseSearchConsoleCSV(searchConsoleFile);

  // Load micro-problems config
  const microProblems = loadMicroProblemsConfig();

  if (microProblems.length === 0) {
    console.error('❌ Error: No micro-problems found in config files');
    process.exit(1);
  }

  // Load staff feedback
  console.log('📋 Loading staff feedback...\n');
  const staffFeedback = loadStaffFeedback();

  // Evaluate all signals and make decisions
  console.log('🔍 Evaluating signals and making decisions...\n');

  const auditResults = microProblems.map((service) => {
    const signals = [
      evaluateSignalA(service, searchData),
      evaluateSignalB(service, staffFeedback),
      evaluateSignalC(service, microProblems),
    ];

    const decision = makeDecision(service, signals, microProblems);

    return { service, signals, decision };
  });

  // Generate report
  const reportPath = generateAuditReport(auditResults);

  // Print console summary
  printConsoleSummary(auditResults);

  console.log(`📄 Full report available at: ${reportPath}`);
  console.log('\n✅ Audit complete!\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  evaluateSignalA,
  evaluateSignalB,
  evaluateSignalC,
  makeDecision,
  generateAuditReport,
  parseSearchConsoleCSV,
  loadMicroProblemsConfig,
};
