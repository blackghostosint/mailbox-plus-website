import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  extractReducedMotionBlock,
  checkCssContent,
  checkReducedMotion,
} from '../check-reduced-motion.ts';

describe('check-reduced-motion', () => {
  describe('extractReducedMotionBlock', () => {
    it('returns null when media query block is absent', () => {
      const css = 'body { color: red; }';
      expect(extractReducedMotionBlock(css)).toBeNull();
    });

    it('extracts content within @media (prefers-reduced-motion: reduce)', () => {
      const css = `
        body { margin: 0; }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; }
        }
        h1 { font-size: 2rem; }
      `;
      const block = extractReducedMotionBlock(css);
      expect(block).not.toBeNull();
      expect(block).toContain('transition-duration: 0.01ms !important');
    });
  });

  describe('checkCssContent', () => {
    it('returns error if prefers-reduced-motion block is missing', () => {
      const css = 'body { color: blue; }';
      const errors = checkCssContent(css, 'test.css');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('missing @media (prefers-reduced-motion: reduce)');
    });

    it('returns error if transition-duration: 0.01ms !important is missing', () => {
      const css = `
        @media (prefers-reduced-motion: reduce) {
          a:hover { transform: none !important; }
        }
      `;
      const errors = checkCssContent(css, 'test.css');
      expect(errors.some((e) => e.includes('transition-duration: 0.01ms !important'))).toBe(true);
    });

    it('returns error if transform: none !important is missing', () => {
      const css = `
        @media (prefers-reduced-motion: reduce) {
          a:hover { transition-duration: 0.01ms !important; }
        }
      `;
      const errors = checkCssContent(css, 'test.css');
      expect(errors.some((e) => e.includes('transform: none !important'))).toBe(true);
    });

    it('returns error if interactive element selectors are missing', () => {
      const css = `
        @media (prefers-reduced-motion: reduce) {
          .static-class {
            transition-duration: 0.01ms !important;
            transform: none !important;
          }
        }
      `;
      const errors = checkCssContent(css, 'test.css');
      expect(errors.some((e) => e.includes('missing interactive element'))).toBe(true);
    });

    it('passes when valid reduced motion overrides are present', () => {
      const css = `
        @media (prefers-reduced-motion: reduce) {
          a:hover, button:focus, .btn-primary:active {
            transition-duration: 0.01ms !important;
            transform: none !important;
          }
        }
      `;
      const errors = checkCssContent(css, 'test.css');
      expect(errors).toHaveLength(0);
    });
  });

  describe('checkReducedMotion', () => {
    it('verifies actual global.css and critical.css files in repo', () => {
      const result = checkReducedMotion();
      expect(result.errors).toEqual([]);
      expect(result.success).toBe(true);
    });

    it('handles missing files gracefully', () => {
      const result = checkReducedMotion({
        globalCssPath: '/non/existent/global.css',
        criticalCssPath: '/non/existent/critical.css',
      });
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('validates custom file paths correctly', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'a11y-test-'));
      const globalCss = path.join(tmpDir, 'global.css');
      const criticalCss = path.join(tmpDir, 'critical.css');

      const validContent = `
        @media (prefers-reduced-motion: reduce) {
          button:hover {
            transition-duration: 0.01ms !important;
            transform: none !important;
          }
        }
      `;

      fs.writeFileSync(globalCss, validContent);
      fs.writeFileSync(criticalCss, validContent);

      const result = checkReducedMotion({
        globalCssPath: globalCss,
        criticalCssPath: criticalCss,
      });

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);

      fs.rmSync(tmpDir, { recursive: true, force: true });
    });
  });
});
