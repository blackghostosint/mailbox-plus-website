#!/usr/bin/env node
/**
 * Retrieval Test Runner
 * 
 * Executes all retrieval tests and generates a markdown report.
 * 
 * STRICT RULE: One fail blocks UI rollout.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { retrievalTests, FALLBACK_RESPONSE, MINIMUM_SIMILARITY, getTestStats, type TestCase, type TestResult } from './retrieval-test-suite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ========================================
// Load Knowledge Base
// ========================================
interface KBEntry {
    id: string;
    intent: string;
    title: string;
    questionVariants: string[];
    answer: string;
    searchText: string;
    confidence: {
        minimumSimilarity: number;
        requiresExactMatch: boolean;
    };
}

interface KnowledgeBase {
    entries: KBEntry[];
}

const kbPath = join(__dirname, 'kb.entries.json');
const kb: KnowledgeBase = JSON.parse(readFileSync(kbPath, 'utf-8'));

console.log(`✓ Loaded ${kb.entries.length} FAQ entries from knowledge base`);

// ========================================
// Simple Similarity Function
// ========================================
/**
 * Calculate simple string similarity (Jaccard similarity)
 * This is a simplified version for testing. Production would use embeddings.
 */
function calculateSimilarity(query: string, text: string): number {
    const queryTokens = new Set(query.toLowerCase().split(/\s+/));
    const textTokens = new Set(text.toLowerCase().split(/\s+/));

    const intersection = new Set([...queryTokens].filter(x => textTokens.has(x)));
    const union = new Set([...queryTokens, ...textTokens]);

    return intersection.size / union.size;
}

// ========================================
// Retrieval Logic
// ========================================
interface RetrievalResult {
    matched: boolean;
    faqId?: string;
    answer?: string;
    confidence?: number;
    refusalReason?: string;
}

function retrieveAnswer(query: string): RetrievalResult {
    let bestMatch: { entry: KBEntry; score: number } | null = null;
    let secondBestScore = 0;

    // Find best matching FAQ
    for (const entry of kb.entries) {
        // Check against question variants and searchText
        const textsToCheck = [
            ...entry.questionVariants,
            entry.searchText,
            entry.title
        ];

        let maxScore = 0;
        for (const text of textsToCheck) {
            const score = calculateSimilarity(query, text);
            maxScore = Math.max(maxScore, score);
        }

        if (maxScore > (bestMatch?.score || 0)) {
            secondBestScore = bestMatch?.score || 0;
            bestMatch = { entry, score: maxScore };
        } else if (maxScore > secondBestScore) {
            secondBestScore = maxScore;
        }
    }

    // Apply retrieval contract
    if (!bestMatch || bestMatch.score < MINIMUM_SIMILARITY) {
        return {
            matched: false,
            refusalReason: 'No entry meets similarity threshold'
        };
    }

    // Check for competing entries
    const scoreGap = bestMatch.score - secondBestScore;
    if (scoreGap < 0.1 && secondBestScore >= MINIMUM_SIMILARITY) {
        return {
            matched: false,
            refusalReason: 'Two or more entries compete'
        };
    }

    return {
        matched: true,
        faqId: bestMatch.entry.id,
        answer: bestMatch.entry.answer,
        confidence: bestMatch.score
    };
}

// ========================================
// Test Execution
// ========================================
interface TestExecutionResult {
    testCase: TestCase;
    actualResult: TestResult;
    actualFaqId?: string;
    confidence?: number;
    passed: boolean;
    failureReason?: string;
}

function executeTest(testCase: TestCase): TestExecutionResult {
    const retrieval = retrieveAnswer(testCase.query);
    const actualResult: TestResult = retrieval.matched ? 'ACCEPT' : 'REFUSE';

    let passed = actualResult === testCase.expectedResult;
    let failureReason: string | undefined;

    // For ACCEPT cases, also verify the correct FAQ was matched
    if (passed && testCase.expectedResult === 'ACCEPT' && testCase.expectedFaqId) {
        if (retrieval.faqId !== testCase.expectedFaqId) {
            passed = false;
            failureReason = `Wrong FAQ matched: expected ${testCase.expectedFaqId}, got ${retrieval.faqId}`;
        }
    }

    return {
        testCase,
        actualResult,
        actualFaqId: retrieval.faqId,
        confidence: retrieval.confidence,
        passed,
        failureReason
    };
}

// ========================================
// Report Generation
// ========================================
function generateMarkdownReport(results: TestExecutionResult[]): string {
    const stats = getTestStats();
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const passRate = ((passed / results.length) * 100).toFixed(1);

    let report = `# Retrieval Test Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n\n`;
    report += `**Minimum Similarity Threshold:** ${MINIMUM_SIMILARITY}\n\n`;

    // Summary
    report += `## Summary\n\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Total Tests | ${results.length} |\n`;
    report += `| Passed | ${passed} |\n`;
    report += `| Failed | ${failed} |\n`;
    report += `| Pass Rate | ${passRate}% |\n\n`;

    // Exit Criteria
    const uiApproved = failed === 0;
    report += `## Exit Criteria\n\n`;
    if (uiApproved) {
        report += `✅ **RETRIEVAL APPROVED** - All tests passed. UI rollout may proceed.\n\n`;
    } else {
        report += `❌ **UI ROLLOUT BLOCKED** - ${failed} test(s) failed. Fix issues before proceeding.\n\n`;
    }

    // Test Category Breakdown
    report += `## Test Category Breakdown\n\n`;
    report += `| Category | Count | Should Accept | Should Refuse |\n`;
    report += `|----------|-------|---------------|---------------|\n`;

    const categories = Object.keys(stats.byCategory);
    for (const category of categories) {
        const count = stats.byCategory[category];
        const categoryTests = results.filter(r => r.testCase.category === category);
        const accept = categoryTests.filter(r => r.testCase.expectedResult === 'ACCEPT').length;
        const refuse = categoryTests.filter(r => r.testCase.expectedResult === 'REFUSE').length;
        report += `| ${category} | ${count} | ${accept} | ${refuse} |\n`;
    }
    report += `\n`;

    // Detailed Results Table
    report += `## Detailed Test Results\n\n`;
    report += `| ID | Query | Expected | Actual | Pass/Fail | Notes |\n`;
    report += `|----|-------|----------|--------|-----------|-------|\n`;

    for (const result of results) {
        const { testCase, actualResult, passed, failureReason } = result;
        const passIcon = passed ? '✅' : '❌';
        const notes = failureReason || testCase.notes || '';
        const queryTrunc = testCase.query.length > 50 ? testCase.query.substring(0, 47) + '...' : testCase.query;

        report += `| ${testCase.id} | ${queryTrunc} | ${testCase.expectedResult} | ${actualResult} | ${passIcon} | ${notes} |\n`;
    }
    report += `\n`;

    // Failures Section (if any)
    const failures = results.filter(r => !r.passed);
    if (failures.length > 0) {
        report += `## ⚠️ Failed Tests\n\n`;
        for (const failure of failures) {
            report += `### ${failure.testCase.id}: ${failure.testCase.query}\n\n`;
            report += `- **Category:** ${failure.testCase.category}\n`;
            report += `- **Expected:** ${failure.testCase.expectedResult}\n`;
            report += `- **Actual:** ${failure.actualResult}\n`;
            if (failure.actualFaqId) {
                report += `- **Matched FAQ:** ${failure.actualFaqId}\n`;
            }
            if (failure.confidence) {
                report += `- **Confidence:** ${(failure.confidence * 100).toFixed(1)}%\n`;
            }
            if (failure.failureReason) {
                report += `- **Reason:** ${failure.failureReason}\n`;
            }
            report += `\n`;
        }
    }

    // Recommendations
    report += `## Recommendations\n\n`;
    if (uiApproved) {
        report += `All tests passed! You may proceed to UI development.\n\n`;
    } else {
        report += `**Action Required:** Fix the failed tests before UI rollout.\n\n`;
        report += `**Allowed Fixes:**\n`;
        report += `1. Adjust \`minimumSimilarity\` threshold (currently ${MINIMUM_SIMILARITY})\n`;
        report += `2. Improve \`searchText\` in FAQ entries without changing answers\n\n`;
        report += `**Do NOT:**\n`;
        report += `- Rewrite answers to fit failing tests\n`;
        report += `- Remove tests to improve pass rate\n`;
        report += `- Proceed to UI with failing tests\n\n`;
    }

    return report;
}

// ========================================
// Main Execution
// ========================================
async function main() {
    console.log('🧪 Running Retrieval Test Suite...\n');

    const results: TestExecutionResult[] = [];

    // Execute all tests
    for (const testCase of retrievalTests) {
        const result = executeTest(testCase);
        results.push(result);

        const icon = result.passed ? '✅' : '❌';
        console.log(`${icon} ${testCase.id}: ${testCase.query.substring(0, 60)}${testCase.query.length > 60 ? '...' : ''}`);
    }

    console.log('\n📊 Generating report...\n');

    // Generate report
    const report = generateMarkdownReport(results);

    // Write to file
    const reportPath = join(__dirname, 'RETRIEVAL_TEST_REPORT.md');
    writeFileSync(reportPath, report, 'utf-8');

    console.log(`✓ Report saved to: ${reportPath}\n`);

    // Console summary
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    if (failed === 0) {
        console.log('✅ ALL TESTS PASSED - UI rollout approved!\n');
        process.exit(0);
    } else {
        console.log(`❌ ${failed} TEST(S) FAILED - UI rollout blocked!\n`);
        console.log(`See ${reportPath} for details.\n`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Error running tests:', err);
    process.exit(1);
});
