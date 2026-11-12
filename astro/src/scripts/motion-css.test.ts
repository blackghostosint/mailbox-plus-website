import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

// Lint guard for the Task 3 motion layer (DESIGN_PHASE1_SPEC §1.3–1.4): the shared
// micro-interaction + reveal CSS may only move things with transform/opacity, and
// every moving class must be neutralised under prefers-reduced-motion.
const here = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.resolve(here, '../styles/global.css'), 'utf8');
const start = css.indexOf('Motion layer — shared micro-interactions');
const layer = css.slice(start);

// Paint-only colour transitions pre-date the layer and never affect layout.
const ALLOWED = new Set(['transform', 'opacity', 'color', 'background-color', 'border-color']);

function transitionedProperties(source: string): string[] {
  const props: string[] = [];
  for (const m of source.matchAll(/transition\s*:\s*([^;]+);/g)) {
    for (const part of m[1].split(',')) {
      props.push(part.trim().split(/\s+/)[0]);
    }
  }
  for (const m of source.matchAll(/transition-property\s*:\s*([^;]+);/g)) {
    props.push(...m[1].split(',').map((p) => p.trim()));
  }
  return props;
}

describe('motion layer CSS (global.css)', () => {
  it('exists after the Tailwind layers', () => {
    expect(start).toBeGreaterThan(css.indexOf('@layer utilities'));
  });

  it('only transitions transform/opacity (plus paint-only colours)', () => {
    const props = transitionedProperties(layer);
    expect(props.length).toBeGreaterThan(0);
    expect(props.filter((p) => !ALLOWED.has(p))).toEqual([]);
  });

  it('never animates layout properties or box-shadow', () => {
    expect(layer).not.toMatch(
      /transition[^;]*\b(width|height|top|left|margin|padding|box-shadow|all)\b/
    );
    expect(layer).not.toMatch(/@keyframes/);
  });

  it('uses the Task 1 motion tokens, not literal timings', () => {
    expect(layer).toContain('var(--duration-reveal)');
    expect(layer).toContain('var(--ease-out-quart)');
    expect(layer).toContain('var(--motion-distance-reveal)');
  });

  it('neutralises every moving class under prefers-reduced-motion', () => {
    const blocks = [...css.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/g)];
    expect(blocks.length).toBeGreaterThanOrEqual(2);
    const lastBlock = css.slice(blocks[blocks.length - 1].index);
    for (const cls of [
      '.motion-press',
      '.motion-lift',
      '.motion-underline',
      '.home-card-accent',
      '.reveal-pending',
      '.reveal-in',
    ]) {
      expect(lastBlock).toContain(cls);
    }
    expect(lastBlock).toMatch(/transition-duration:\s*0\.01ms !important/);
    expect(lastBlock).toMatch(/opacity:\s*1 !important/);
  });
});
