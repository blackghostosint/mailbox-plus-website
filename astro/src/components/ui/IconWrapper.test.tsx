// @vitest-environment happy-dom
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IconWrapper } from './IconWrapper';

describe('IconWrapper Component', () => {
  describe('React Element Cloning & Accessibility', () => {
    it('injects aria-hidden="true" and focusable="false" on valid child element', () => {
      render(
        <IconWrapper>
          <svg data-testid="test-icon" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" />
          </svg>
        </IconWrapper>
      );

      const icon = screen.getByTestId('test-icon');
      expect(icon).not.toBeNull();
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('focusable')).toBe('false');
      expect(icon.getAttribute('viewBox')).toBe('0 0 24 24');
    });

    it('clones non-SVG React elements and applies accessibility attributes', () => {
      render(
        <IconWrapper>
          <i data-testid="italic-icon" title="icon-symbol" />
        </IconWrapper>
      );

      const icon = screen.getByTestId('italic-icon');
      expect(icon).not.toBeNull();
      expect(icon.tagName.toLowerCase()).toBe('i');
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('focusable')).toBe('false');
      expect(icon.getAttribute('title')).toBe('icon-symbol');
    });
  });

  describe('Class Name Merging', () => {
    it('merges wrapper className and child className when both are present', () => {
      render(
        <IconWrapper className="wrapper-class">
          <svg data-testid="test-icon" className="child-class" />
        </IconWrapper>
      );

      const icon = screen.getByTestId('test-icon');
      expect(icon.className).toBe('child-class wrapper-class');
    });

    it('applies wrapper className when child has no className', () => {
      render(
        <IconWrapper className="wrapper-only-class">
          <svg data-testid="test-icon" />
        </IconWrapper>
      );

      const icon = screen.getByTestId('test-icon');
      expect(icon.className).toBe('wrapper-only-class');
    });

    it('preserves child className when wrapper className is omitted', () => {
      render(
        <IconWrapper>
          <svg data-testid="test-icon" className="child-only-class" />
        </IconWrapper>
      );

      const icon = screen.getByTestId('test-icon');
      expect(icon.className).toBe('child-only-class');
    });

    it('handles undefined className gracefully when neither wrapper nor child specifies className', () => {
      render(
        <IconWrapper>
          <svg data-testid="test-icon" />
        </IconWrapper>
      );

      const icon = screen.getByTestId('test-icon');
      expect(icon.getAttribute('class')).toBeNull();
    });
  });

  describe('Fallback <span> Rendering for Non-Elements', () => {
    it('renders fallback <span> with aria-hidden="true" for string children', () => {
      render(<IconWrapper>mail_outline</IconWrapper>);

      const textElement = screen.getByText('mail_outline');
      expect(textElement).not.toBeNull();
      expect(textElement.tagName.toLowerCase()).toBe('span');
      expect(textElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('applies wrapper className to fallback <span> for string children', () => {
      render(<IconWrapper className="fallback-span-class">star_rate</IconWrapper>);

      const textElement = screen.getByText('star_rate');
      expect(textElement.tagName.toLowerCase()).toBe('span');
      expect(textElement.className).toBe('fallback-span-class');
      expect(textElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders fallback <span> with aria-hidden="true" for number children', () => {
      render(<IconWrapper>123</IconWrapper>);

      const numberElement = screen.getByText('123');
      expect(numberElement).not.toBeNull();
      expect(numberElement.tagName.toLowerCase()).toBe('span');
      expect(numberElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders fallback <span> with aria-hidden="true" for array or node list children', () => {
      render(<IconWrapper>{['icon_part_1', 'icon_part_2']}</IconWrapper>);

      const fallbackSpan = screen.getByText(/icon_part_1/);
      expect(fallbackSpan.tagName.toLowerCase()).toBe('span');
      expect(fallbackSpan.getAttribute('aria-hidden')).toBe('true');
      expect(fallbackSpan.textContent).toBe('icon_part_1icon_part_2');
    });

    it('renders fallback <span> with aria-hidden="true" when children are null or undefined', () => {
      const { container } = render(<IconWrapper className="null-fallback">{null}</IconWrapper>);

      const span = container.querySelector('span');
      expect(span).not.toBeNull();
      expect(span?.getAttribute('aria-hidden')).toBe('true');
      expect(span?.className).toBe('null-fallback');
    });
  });
});
