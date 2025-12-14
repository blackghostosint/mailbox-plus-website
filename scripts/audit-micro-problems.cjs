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

// ============================================================================
// CONFIGURATION
// ============================================================================

const AUDIT_DIR = path.join(__dirname, 'audits');
const SEARCH_CONSOLE_DIR = path.join(AUDIT_DIR, 'search-console-data');
const REPORTS_DIR = path.join(AUDIT_DIR, 'reports');

// Ensure directories exist
[AUDIT_DIR, SEARCH_CONSOLE_DIR, REPORTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// ============================================================================
// PARSE ARGUMENTS
// ============================================================================

const args = process.argv.slice(2);
let searchConsoleFile = null;

args.forEach(arg => {
    if (arg.startsWith('--search-console=')) {
        searchConsoleFile = arg.split('=')[1];
    }
});

if (!searchConsoleFile) {
    console.error('❌ Error: --search-console argument is required');
    console.error('Usage: node scripts/audit-micro-problems.cjs --search-console=path/to/search-console.csv');
    process.exit(1);
}

if (!fs.existsSync(searchConsoleFile)) {
    console.error(`❌ Error: Search Console file not found: ${searchConsoleFile}`);
    process.exit(1);
}

// ============================================================================
// LOAD MICRO-PROBLEMS CONFIG
// ============================================================================

console.log('📦 Loading micro-problems configuration...\n');

// Note: This script needs to be run after build or with ts-node for TypeScript imports
// For now, this is a placeholder structure showing the approach

const microProblems = [
    // This would be loaded from: src/config/micro-problems/index.ts
    // For the actual implementation, you would need to:
    // 1. Build the project first, OR
    // 2. Use ts-node to run this script with TypeScript support, OR
    // 3. Export the config as JSON during build
];

console.log(`Found ${microProblems.length} micro-problem pages to audit\n`);

// ============================================================================
// PARSE SEARCH CONSOLE DATA
// ============================================================================

console.log('🔍 Parsing Search Console data...\n');

const searchConsoleData = parseSearchConsoleCSV(searchConsoleFile);

function parseSearchConsoleCSV(filePath) {
    // This would parse the CSV and return a map of:
    // { [pageUrl]: { impressions: number, clicks: number } }

    const data = {};

    // Placeholder - real implementation would parse CSV
    console.log(`  Loaded data from: ${filePath}`);

    return data;
}

// ============================================================================
// SIGNAL EVALUATION
// ============================================================================

function evaluateSignalA(service, searchData) {
    // Signal A: Search Console Performance
    const pageData = searchData[service.slug] || { impressions: 0, clicks: 0 };

    const fail = pageData.impressions === 0 ||
        (pageData.impressions > 0 && pageData.clicks === 0);

    return {
        signal: 'A',
        name: 'Search Console Performance',
        pass: !fail,
        data: pageData,
        reason: fail
            ? (pageData.impressions === 0
                ? '0 impressions in last 90 days'
                : 'Impressions exist but 0 clicks')
            : `${pageData.impressions} impressions, ${pageData.clicks} clicks`
    };
}

function evaluateSignalB(service) {
    // Signal B: User Intent Reality
    // This would require manual staff feedback input
    // For now, return PASS with note to check manually

    return {
        signal: 'B',
        name: 'User Intent Reality',
        pass: true, // Manual review required
        reason: 'Manual review required - check staff feedback log',
        requiresManualReview: true
    };
}

function evaluateSignalC(service, allServices) {
    // Signal C: Intent Overlap
    const duplicates = allServices.filter(s =>
        s.id !== service.id &&
        s.intentKey &&
        s.intentKey === service.intentKey
    );

    const hasDuplicates = duplicates.length > 0;

    return {
        signal: 'C',
        name: 'Intent Overlap',
        pass: !hasDuplicates,
        reason: hasDuplicates
            ? `Duplicate intentKey "${service.intentKey}" found in: ${duplicates.map(d => d.id).join(', ')}`
            : 'Unique intentKey'
    };
}

// ============================================================================
// DECISION MATRIX
// ============================================================================

function makeDecision(service, signals) {
    const [signalA, signalB, signalC] = signals;

    // DELETE IF: All conditions met
    if (!signalA.pass && !signalC.pass) {
        return {
            action: 'DELETE',
            reason: 'No impressions + Intent overlap',
            confidence: 'HIGH',
            signals: signals
        };
    }

    // MERGE IF: Intent overlap exists and one performs better
    if (!signalC.pass) {
        return {
            action: 'MERGE',
            reason: 'Intent overlap detected',
            confidence: 'MEDIUM',
            signals: signals,
            note: 'Review which page performs better'
        };
    }

    // REWRITE IF: Traffic exists but intent unclear
    if (signalA.pass && signalB.requiresManualReview) {
        return {
            action: 'REVIEW',
            reason: 'Has traffic - check staff feedback for confusion',
            confidence: 'LOW',
            signals: signals
        };
    }

    // KEEP: Default
    return {
        action: 'KEEP',
        reason: 'Passes all automated signals',
        confidence: 'HIGH',
        signals: signals
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
        DELETE: auditResults.filter(r => r.decision.action === 'DELETE').length,
        MERGE: auditResults.filter(r => r.decision.action === 'MERGE').length,
        REWRITE: auditResults.filter(r => r.decision.action === 'REWRITE').length,
        REVIEW: auditResults.filter(r => r.decision.action === 'REVIEW').length,
        KEEP: auditResults.filter(r => r.decision.action === 'KEEP').length,
    };

    report += `## Summary\n\n`;
    report += `- ❌ DELETE: ${summary.DELETE}\n`;
    report += `- 🔀 MERGE: ${summary.MERGE}\n`;
    report += `- ✏️ REWRITE: ${summary.REWRITE}\n`;
    report += `- 👀 REVIEW: ${summary.REVIEW}\n`;
    report += `- ✅ KEEP: ${summary.KEEP}\n\n`;

    report += `---\n\n`;

    // Detailed results
    report += `## Detailed Results\n\n`;

    auditResults.forEach(result => {
        const { service, decision } = result;

        report += `### ${service.id}\n\n`;
        report += `**Decision**: ${decision.action}\n\n`;
        report += `**Signals**:\n`;

        decision.signals.forEach(signal => {
            const icon = signal.pass ? '✅' : '❌';
            report += `- ${icon} Signal ${signal.signal} (${signal.name}): ${signal.pass ? 'PASS' : 'FAIL'}\n`;
            report += `  - ${signal.reason}\n`;
        });

        report += `\n**Rationale**: ${decision.reason}\n\n`;

        if (decision.note) {
            report += `**Note**: ${decision.note}\n\n`;
        }

        report += `**Action Taken**: [To be filled in after implementing changes]\n\n`;
        report += `---\n\n`;
    });

    fs.writeFileSync(reportPath, report);
    console.log(`\n📄 Audit report saved to: ${reportPath}\n`);

    return reportPath;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
    console.log('🚀 Starting Micro-Problem Governance Audit\n');
    console.log('='.repeat(60));

    // Note: This is a placeholder implementation
    // Real implementation would:
    // 1. Load actual micro-problems config
    // 2. Parse Search Console CSV
    // 3. Evaluate all signals
    // 4. Generate comprehensive report

    console.log('\n⚠️  NOTE: This is a placeholder implementation.');
    console.log('To complete this script, you need to:');
    console.log('  1. Export micro-problems config as JSON during build');
    console.log('  2. Implement CSV parsing for Search Console data');
    console.log('  3. Add staff feedback log integration');
    console.log('\nSee MICRO_PROBLEM_GOVERNANCE.md for full specification.\n');
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
    generateAuditReport
};
