import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="primary">Test</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('bg-[var(--color-accent-warm)]');
    expect(button.className).toContain('text-[15px]');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="sm">Test</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('px-4');
  });

  it('merges custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('custom-class');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('renders as link when as="a"', () => {
    const { container } = render(<Button as="a">Link Button</Button>);
    expect(container.firstChild?.nodeName).toBe('A');
  });
});
