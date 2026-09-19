// @vitest-environment happy-dom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from './FormField';

describe('FormField Component', () => {
  it('generates automatic ID and links label to input when id prop is omitted', () => {
    render(
      <FormField label="Email Address">
        <input type="email" aria-label="Email Address" />
      </FormField>
    );

    const label = screen.getByText('Email Address');
    const input = screen.getByRole('textbox');

    const inputId = input.getAttribute('id');
    expect(inputId).not.toBeNull();
    expect(inputId).toMatch(/^field-/);
    expect(label.getAttribute('for')).toBe(inputId);
  });

  it('uses explicit id prop when provided', () => {
    render(
      <FormField id="custom-email-id" label="Email Address">
        <input type="email" aria-label="Email Address" />
      </FormField>
    );

    const label = screen.getByText('Email Address');
    const input = screen.getByRole('textbox');

    expect(input.getAttribute('id')).toBe('custom-email-id');
    expect(label.getAttribute('for')).toBe('custom-email-id');
  });

  it('renders required asterisk with aria-hidden="true" when required is true', () => {
    render(
      <FormField label="Full Name" required={true}>
        <input type="text" aria-label="Full Name" />
      </FormField>
    );

    const asterisk = screen.getByText('*');
    expect(asterisk).not.toBeNull();
    expect(asterisk.getAttribute('aria-hidden')).toBe('true');
    expect(asterisk.className).toContain('text-red-600');

    const input = screen.getByRole('textbox');
    expect(input.getAttribute('required')).not.toBeNull();
  });

  it('merges child className with focus ring classes', () => {
    render(
      <FormField label="Username">
        <input type="text" aria-label="Username" className="bg-gray-100 p-2" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    const className = input.className;
    expect(className).toContain('bg-gray-100 p-2');
    expect(className).toContain('focus:ring-2');
    expect(className).toContain('focus:ring-border-strong');
  });

  it('renders help text and sets aria-describedby on child input', () => {
    render(
      <FormField id="pass-field" label="Password" helpText="Must be at least 8 characters">
        <input type="password" aria-label="Password" />
      </FormField>
    );

    const helpParagraph = screen.getByText('Must be at least 8 characters');
    expect(helpParagraph).not.toBeNull();
    expect(helpParagraph.getAttribute('id')).toBe('pass-field-help');

    // Password inputs do not have implicit role 'textbox' in screen
    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe('pass-field-help');
  });

  it('renders error message with role="alert" and sets aria-invalid="true"', () => {
    render(
      <FormField id="email-field" label="Email" error="Invalid email address">
        <input type="email" aria-label="Email" />
      </FormField>
    );

    const alertMessage = screen.getByRole('alert');
    expect(alertMessage).not.toBeNull();
    expect(alertMessage.textContent).toBe('Invalid email address');
    expect(alertMessage.getAttribute('id')).toBe('email-field-error');

    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('email-field-error');
  });

  it('combines helpText and error IDs in aria-describedby when both are present', () => {
    render(
      <FormField
        id="phone-field"
        label="Phone Number"
        helpText="Include country code"
        error="Phone number is required"
      >
        <input type="tel" aria-label="Phone Number" />
      </FormField>
    );

    const helpPara = screen.getByText('Include country code');
    const errorAlert = screen.getByRole('alert');

    expect(helpPara.getAttribute('id')).toBe('phone-field-help');
    expect(errorAlert.getAttribute('id')).toBe('phone-field-error');

    const input = document.querySelector('input[type="tel"]') as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toBe('phone-field-error phone-field-help');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('preserves existing child aria-describedby if child explicitly sets it', () => {
    render(
      <FormField id="custom-field" label="Custom" helpText="Field helper">
        <input type="text" aria-label="Custom" aria-describedby="external-description" />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-describedby')).toBe('external-description');
  });

  it('preserves existing child required attribute if explicitly set on child', () => {
    render(
      <FormField label="Optional Wrapper" required={false}>
        <input type="text" aria-label="Optional Wrapper" required={true} />
      </FormField>
    );

    const input = screen.getByRole('textbox');
    expect(input.getAttribute('required')).not.toBeNull();
  });

  it('renders non-element children without error', () => {
    render(<FormField label="Text Only">Plain string content</FormField>);

    expect(screen.getByText('Text Only')).not.toBeNull();
    expect(screen.getByText('Plain string content')).not.toBeNull();
  });
});
