// @vitest-environment happy-dom
import React, { useRef, useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AccessibleModal } from './AccessibleModal';

describe('AccessibleModal Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders null when isOpen is false', () => {
    const { container } = render(
      <AccessibleModal isOpen={false} onClose={() => {}} title="Test Modal">
        Modal Content
      </AccessibleModal>
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders modal dialog with correct ARIA attributes and content when isOpen is true', () => {
    render(
      <AccessibleModal
        isOpen={true}
        onClose={() => {}}
        title="Test Modal Title"
        ariaDescribedBy="modal-description"
        className="custom-modal-class"
      >
        <p id="modal-description">Modal description text</p>
        <button>Action Button</button>
      </AccessibleModal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Test Modal Title');
    expect(dialog.getAttribute('aria-describedby')).toBe('modal-description');
    expect(dialog.className).toContain('custom-modal-class');
    expect(screen.getByText('Modal description text')).not.toBeNull();
  });

  it('uses custom titleId when provided', () => {
    render(
      <AccessibleModal
        isOpen={true}
        onClose={() => {}}
        title="Custom ID Modal"
        titleId="custom-title-id"
      >
        <p>Modal content</p>
      </AccessibleModal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBe('custom-title-id');
  });

  it('automatically focuses first focusable element after 50ms when opened', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Focus Test">
        <input type="text" placeholder="First Input" aria-label="First Input" />
        <button type="button">Second Button</button>
      </AccessibleModal>
    );

    const input = screen.getByPlaceholderText('First Input');
    expect(document.activeElement).not.toBe(input);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).toBe(input);
  });

  it('focuses initialFocusRef element when provided', () => {
    const TestComponent = () => {
      const buttonRef = useRef<HTMLButtonElement>(null);
      return (
        <AccessibleModal
          isOpen={true}
          onClose={() => {}}
          title="Ref Focus Test"
          initialFocusRef={buttonRef}
        >
          <input type="text" placeholder="Input" aria-label="Input" />
          <button type="button" ref={buttonRef}>
            Target Button
          </button>
        </AccessibleModal>
      );
    };

    render(<TestComponent />);

    const button = screen.getByRole('button', { name: 'Target Button' });
    expect(document.activeElement).not.toBe(button);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).toBe(button);
  });

  it('focuses modal container element if no focusable children exist', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="No Focusable Children">
        <p>Static text only</p>
      </AccessibleModal>
    );

    const dialog = screen.getByRole('dialog');

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).toBe(dialog);
  });

  it('restores focus to previously active element when modal closes', () => {
    const TestWrapper = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div>
          <button onClick={() => setIsOpen(true)}>Trigger Button</button>
          <AccessibleModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Restoration Test"
          >
            <button onClick={() => setIsOpen(false)}>Close Inside</button>
          </AccessibleModal>
        </div>
      );
    };

    render(<TestWrapper />);

    const triggerBtn = screen.getByRole('button', { name: 'Trigger Button' });
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    fireEvent.click(triggerBtn);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const closeBtn = screen.getByRole('button', { name: 'Close Inside' });
    expect(document.activeElement).toBe(closeBtn);

    fireEvent.click(closeBtn);

    expect(document.activeElement).toBe(triggerBtn);
  });

  it('calls onClose when backdrop is clicked, but not when modal body is clicked', () => {
    const handleClose = vi.fn();
    render(
      <AccessibleModal isOpen={true} onClose={handleClose} title="Backdrop Test">
        <div data-testid="modal-content">Content inside modal</div>
      </AccessibleModal>
    );

    // Click modal body/content
    fireEvent.click(screen.getByTestId('modal-content'));
    expect(handleClose).not.toHaveBeenCalled();

    // Click outer backdrop container
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.parentElement as HTMLElement;
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <AccessibleModal isOpen={true} onClose={handleClose} title="Escape Key Test">
        <button>Inside Button</button>
      </AccessibleModal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('traps Tab focus forward from last element to first element', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Tab Trap Test">
        <button data-testid="first-btn">First</button>
        <button data-testid="last-btn">Last</button>
      </AccessibleModal>
    );

    const firstBtn = screen.getByTestId('first-btn');
    const lastBtn = screen.getByTestId('last-btn');

    act(() => {
      vi.advanceTimersByTime(50);
    });

    lastBtn.focus();
    expect(document.activeElement).toBe(lastBtn);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });

    expect(document.activeElement).toBe(firstBtn);
  });

  it('traps Shift+Tab focus backward from first element to last element', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="Shift+Tab Trap Test">
        <button data-testid="first-btn">First</button>
        <button data-testid="last-btn">Last</button>
      </AccessibleModal>
    );

    const firstBtn = screen.getByTestId('first-btn');
    const lastBtn = screen.getByTestId('last-btn');

    act(() => {
      vi.advanceTimersByTime(50);
    });

    firstBtn.focus();
    expect(document.activeElement).toBe(firstBtn);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(lastBtn);
  });

  it('prevents default on Tab key when no focusable elements are present in modal', () => {
    render(
      <AccessibleModal isOpen={true} onClose={() => {}} title="No Focusable Tab Test">
        <p>No focusable items here</p>
      </AccessibleModal>
    );

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
