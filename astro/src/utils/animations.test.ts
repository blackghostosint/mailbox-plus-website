import { describe, it, expect } from 'vitest';
import { fadeUp } from './animations';

describe('fadeUp', () => {
  it('returns default animation config when called without arguments', () => {
    const config = fadeUp();
    expect(config).toEqual({
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6, delay: 0 },
    });
  });

  it('contains expected required property keys for Framer Motion', () => {
    const config = fadeUp();
    expect(Object.keys(config)).toEqual(['initial', 'whileInView', 'viewport', 'transition']);
    expect(config.initial).toHaveProperty('opacity', 0);
    expect(config.initial).toHaveProperty('y', 20);
    expect(config.whileInView).toHaveProperty('opacity', 1);
    expect(config.whileInView).toHaveProperty('y', 0);
    expect(config.viewport).toHaveProperty('once', true);
    expect(config.transition).toHaveProperty('duration', 0.6);
  });

  it('handles explicit zero delay', () => {
    const config = fadeUp(0);
    expect(config.transition.delay).toBe(0);
  });

  it('handles positive integer delay options', () => {
    const config = fadeUp(2);
    expect(config.transition.delay).toBe(2);
    expect(config.transition.duration).toBe(0.6);
  });

  it('handles floating-point delay values accurately', () => {
    const config = fadeUp(0.35);
    expect(config.transition.delay).toBe(0.35);
    expect(config.transition.duration).toBe(0.6);
  });

  it('handles explicit undefined argument by falling back to default delay of 0', () => {
    const config = fadeUp(undefined);
    expect(config.transition.delay).toBe(0);
  });

  it('handles negative delay values', () => {
    const config = fadeUp(-0.5);
    expect(config.transition.delay).toBe(-0.5);
    expect(config.transition.duration).toBe(0.6);
  });

  it('returns fresh object instances on each invocation', () => {
    const config1 = fadeUp(0.1);
    const config2 = fadeUp(0.1);
    expect(config1).toEqual(config2);
    expect(config1).not.toBe(config2);
    expect(config1.initial).not.toBe(config2.initial);
    expect(config1.transition).not.toBe(config2.transition);
  });
});
