import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  evaluateSignalA,
  evaluateSignalB,
  evaluateSignalC,
  makeDecision,
  generateAuditReport,
  parseSearchConsoleCSV,
  parseCSVLine,
} = require('../audit-micro-problems.cjs');

describe('audit-micro-problems', () => {
  describe('parseCSVLine', () => {
    it('splits simple comma-separated fields', () => {
      const line = 'Page,Clicks,Impressions,CTR,Position';
      expect(parseCSVLine(line)).toEqual(['Page', 'Clicks', 'Impressions', 'CTR', 'Position']);
    });

    it('handles quoted fields containing commas', () => {
      const line = '"https://example.com/page,1",10,100,0.10,5.0';
      expect(parseCSVLine(line)).toEqual([
        'https://example.com/page,1',
        '10',
        '100',
        '0.10',
        '5.0',
      ]);
    });
  });

  describe('parseSearchConsoleCSV', () => {
    const tmpDir = path.resolve(process.cwd(), '../scripts/audits/__test_tmp__');

    it('parses Search Console CSV file into page data map', () => {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      const testCsvPath = path.join(tmpDir, 'test-gsc.csv');
      const csvContent = [
        'Page,Clicks,Impressions,CTR,Position',
        '"https://mailboxplus.com/test-slug",15,300,0.05,12.4',
        '"/another-slug",0,50,0,25.0',
      ].join('\n');

      fs.writeFileSync(testCsvPath, csvContent);

      try {
        const data = parseSearchConsoleCSV(testCsvPath);
        expect(data['/test-slug']).toBeDefined();
        expect(data['/test-slug'].clicks).toBe(15);
        expect(data['/test-slug'].impressions).toBe(300);
        expect(data['/another-slug'].clicks).toBe(0);
        expect(data['/another-slug'].impressions).toBe(50);
      } finally {
        if (fs.existsSync(testCsvPath)) fs.unlinkSync(testCsvPath);
        if (fs.existsSync(tmpDir)) fs.rmdirSync(tmpDir);
      }
    });
  });

  describe('signal evaluations', () => {
    const service = {
      id: 'test-service',
      slug: '/test-service',
      intentKey: 'test-intent-key',
    };

    it('evaluateSignalA fails when impressions = 0 or clicks = 0', () => {
      const noData = evaluateSignalA(service, {});
      expect(noData.fail).toBe(true);
      expect(noData.reason).toContain('0 impressions');

      const noClicks = evaluateSignalA(service, {
        '/test-service': { impressions: 100, clicks: 0, position: 10 },
      });
      expect(noClicks.fail).toBe(true);
      expect(noClicks.reason).toContain('0 clicks');

      const pass = evaluateSignalA(service, {
        '/test-service': { impressions: 100, clicks: 10, position: 5 },
      });
      expect(pass.fail).toBe(false);
      expect(pass.pass).toBe(true);
    });

    it('evaluateSignalB evaluates staff feedback correctly', () => {
      const noFeedback = evaluateSignalB(service, {});
      expect(noFeedback.pass).toBe(true);

      const negativeFeedback = evaluateSignalB(service, {
        'test-service': { feedback: 'negative', confusion: true, notes: 'Confusing title' },
      });
      expect(negativeFeedback.fail).toBe(true);
      expect(negativeFeedback.reason).toContain('Confusing title');
    });

    it('evaluateSignalC detects duplicate intent keys', () => {
      const allServices = [
        service,
        { id: 'other-service', slug: '/other-service', intentKey: 'test-intent-key' },
      ];

      const duplicateSignal = evaluateSignalC(service, allServices);
      expect(duplicateSignal.fail).toBe(true);
      expect(duplicateSignal.reason).toContain('Duplicate intentKey');

      const uniqueSignal = evaluateSignalC(service, [service]);
      expect(uniqueSignal.pass).toBe(true);
    });
  });

  describe('makeDecision matrix', () => {
    const service = { id: 'srv-1', slug: '/srv-1', intentKey: 'key-1' };

    it('recommends DELETE for 0 impressions', () => {
      const signals = [
        { signal: 'A', pass: false, fail: true, data: { impressions: 0, clicks: 0 } },
        { signal: 'B', pass: true, fail: false },
        { signal: 'C', pass: true, fail: false },
      ];
      const decision = makeDecision(service, signals, [service]);
      expect(decision.action).toBe('DELETE');
    });

    it('recommends MERGE when intent overlap exists', () => {
      const signals = [
        { signal: 'A', pass: true, fail: false, data: { impressions: 100, clicks: 10 } },
        { signal: 'B', pass: true, fail: false },
        { signal: 'C', pass: false, fail: true, duplicates: [{ id: 'srv-2', slug: '/srv-2' }] },
      ];
      const decision = makeDecision(service, signals, []);
      expect(decision.action).toBe('MERGE');
    });

    it('recommends REWRITE when impressions exist but zero clicks', () => {
      const signals = [
        { signal: 'A', pass: false, fail: true, data: { impressions: 200, clicks: 0 } },
        { signal: 'B', pass: true, fail: false },
        { signal: 'C', pass: true, fail: false },
      ];
      const decision = makeDecision(service, signals, [service]);
      expect(decision.action).toBe('REWRITE');
    });

    it('recommends KEEP when all signals pass', () => {
      const signals = [
        { signal: 'A', pass: true, fail: false, data: { impressions: 200, clicks: 20 } },
        { signal: 'B', pass: true, fail: false },
        { signal: 'C', pass: true, fail: false },
      ];
      const decision = makeDecision(service, signals, [service]);
      expect(decision.action).toBe('KEEP');
    });
  });

  describe('generateAuditReport', () => {
    it('creates markdown audit report file', () => {
      const auditResults = [
        {
          service: { id: 'test-srv', serviceName: 'Test Service', slug: '/test-srv' },
          decision: {
            action: 'KEEP',
            confidence: 'HIGH',
            reason: 'Passes all signals',
            signals: [
              { signal: 'A', name: 'Search Console', pass: true, reason: 'Good performance' },
            ],
          },
        },
      ];

      const reportPath = generateAuditReport(auditResults);
      try {
        expect(fs.existsSync(reportPath)).toBe(true);
        const content = fs.readFileSync(reportPath, 'utf8');
        expect(content).toContain('Micro-Problem Page Governance Audit');
        expect(content).toContain('test-srv');
      } finally {
        if (fs.existsSync(reportPath)) {
          fs.unlinkSync(reportPath);
        }
      }
    });
  });
});
