// @vitest-environment happy-dom
import React from 'react';
import { render, screen, act, renderHook, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLiveAnnouncer } from './useLiveAnnouncer';

describe('useLiveAnnouncer Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders correct DOM structure with polite and assertive live regions', () => {
    const { result } = renderHook(() => useLiveAnnouncer());
    const { LiveAnnouncer } = result.current;

    const { container } = render(<LiveAnnouncer />);

    const srOnlyDiv = container.querySelector('.sr-only');
    expect(srOnlyDiv).not.toBeNull();
    expect(srOnlyDiv?.getAttribute('aria-hidden')).toBe('false');

    const statusRegion = screen.getByRole('status');
    expect(statusRegion).not.toBeNull();
    expect(statusRegion.getAttribute('aria-live')).toBe('polite');
    expect(statusRegion.getAttribute('aria-atomic')).toBe('true');
    expect(statusRegion.textContent).toBe('');

    const alertRegion = screen.getByRole('alert');
    expect(alertRegion).not.toBeNull();
    expect(alertRegion.getAttribute('aria-live')).toBe('assertive');
    expect(alertRegion.getAttribute('aria-atomic')).toBe('true');
    expect(alertRegion.textContent).toBe('');
  });

  it('handles polite announcements with 50ms timer', () => {
    const TestComponent = () => {
      const { announcePolite, LiveAnnouncer } = useLiveAnnouncer();
      return (
        <div>
          <button onClick={() => announcePolite('Form submitted successfully')}>Announce</button>
          <LiveAnnouncer />
        </div>
      );
    };

    render(<TestComponent />);

    const button = screen.getByRole('button');

    act(() => {
      fireEvent.click(button);
    });

    const statusRegion = screen.getByRole('status');
    // Before 50ms timer completes
    expect(statusRegion.textContent).toBe('');

    // Advance timer by 50ms
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByRole('status').textContent).toBe('Form submitted successfully');
  });

  it('handles assertive announcements with 50ms timer', () => {
    const TestComponent = () => {
      const { announceAssertive, LiveAnnouncer } = useLiveAnnouncer();
      return (
        <div>
          <button onClick={() => announceAssertive('Error: Submission failed')}>Announce</button>
          <LiveAnnouncer />
        </div>
      );
    };

    render(<TestComponent />);

    const button = screen.getByRole('button');

    act(() => {
      fireEvent.click(button);
    });

    const alertRegion = screen.getByRole('alert');
    expect(alertRegion.textContent).toBe('');

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByRole('alert').textContent).toBe('Error: Submission failed');
  });

  it('resets timeout when a new polite message is announced before timer expires', () => {
    const TestComponent = () => {
      const { announcePolite, LiveAnnouncer } = useLiveAnnouncer();
      return (
        <div>
          <button onClick={() => announcePolite('First message')}>Msg 1</button>
          <button onClick={() => announcePolite('Second message')}>Msg 2</button>
          <LiveAnnouncer />
        </div>
      );
    };

    render(<TestComponent />);

    const btn1 = screen.getByRole('button', { name: 'Msg 1' });
    const btn2 = screen.getByRole('button', { name: 'Msg 2' });

    act(() => {
      fireEvent.click(btn1);
    });

    act(() => {
      vi.advanceTimersByTime(30);
    });

    act(() => {
      fireEvent.click(btn2);
    });

    // Advance past original 50ms mark
    act(() => {
      vi.advanceTimersByTime(30);
    });

    // Should still be empty because second announcement reset the timer
    expect(screen.getByRole('status').textContent).toBe('');

    // Advance remaining 20ms for second timer
    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByRole('status').textContent).toBe('Second message');
  });

  it('cancels pending timers on component unmount', () => {
    const TestComponent = () => {
      const { announcePolite, announceAssertive, LiveAnnouncer } = useLiveAnnouncer();
      return (
        <div>
          <button
            onClick={() => {
              announcePolite('Unmount test polite');
              announceAssertive('Unmount test assertive');
            }}
          >
            Trigger
          </button>
          <LiveAnnouncer />
        </div>
      );
    };

    const { unmount } = render(<TestComponent />);

    const button = screen.getByRole('button');
    act(() => {
      fireEvent.click(button);
    });

    unmount();

    expect(() => {
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }).not.toThrow();
  });

  it('maintains DOM element reference equality (===) after announcements', () => {
    const TestComponent = () => {
      const { announcePolite, announceAssertive, LiveAnnouncer } = useLiveAnnouncer();
      return (
        <div>
          <button
            onClick={() => {
              announcePolite('Polite test');
              announceAssertive('Assertive test');
            }}
          >
            Trigger
          </button>
          <LiveAnnouncer />
        </div>
      );
    };

    render(<TestComponent />);

    const initialStatusRegion = screen.getByRole('status');
    const initialAlertRegion = screen.getByRole('alert');

    const button = screen.getByRole('button');
    act(() => {
      fireEvent.click(button);
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const statusRegionAfter = screen.getByRole('status');
    const alertRegionAfter = screen.getByRole('alert');

    expect(statusRegionAfter).toBe(initialStatusRegion);
    expect(alertRegionAfter).toBe(initialAlertRegion);
    expect(statusRegionAfter.textContent).toBe('Polite test');
    expect(alertRegionAfter.textContent).toBe('Assertive test');
  });

  it('maintains stable LiveAnnouncer component reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useLiveAnnouncer());

    const initialLiveAnnouncer = result.current.LiveAnnouncer;

    rerender();

    expect(result.current.LiveAnnouncer).toBe(initialLiveAnnouncer);
  });

  it('resets timeout when a new assertive message is announced before timer expires', () => {
    const TestComponent = () => {
      const { announceAssertive, LiveAnnouncer } = useLiveAnnouncer();
      return (
        <div>
          <button onClick={() => announceAssertive('First alert')}>Msg 1</button>
          <button onClick={() => announceAssertive('Second alert')}>Msg 2</button>
          <LiveAnnouncer />
        </div>
      );
    };

    render(<TestComponent />);

    const btn1 = screen.getByRole('button', { name: 'Msg 1' });
    const btn2 = screen.getByRole('button', { name: 'Msg 2' });

    act(() => {
      fireEvent.click(btn1);
    });

    act(() => {
      vi.advanceTimersByTime(30);
    });

    act(() => {
      fireEvent.click(btn2);
    });

    act(() => {
      vi.advanceTimersByTime(30);
    });

    expect(screen.getByRole('alert').textContent).toBe('');

    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByRole('alert').textContent).toBe('Second alert');
  });

  it('safely handles announcement calls when LiveAnnouncer component is not rendered', () => {
    const { result } = renderHook(() => useLiveAnnouncer());

    expect(() => {
      act(() => {
        result.current.announcePolite('Unmounted polite');
        result.current.announceAssertive('Unmounted assertive');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });
    }).not.toThrow();
  });

  it('safely handles announcement timer completion if LiveAnnouncer unmounts before timer runs', () => {
    const TestComponent = ({ showAnnouncer }: { showAnnouncer: boolean }) => {
      const { announcePolite, announceAssertive, LiveAnnouncer } = useLiveAnnouncer();
      return (
        <div>
          <button
            onClick={() => {
              announcePolite('Pending polite');
              announceAssertive('Pending assertive');
            }}
          >
            Trigger
          </button>
          {showAnnouncer && <LiveAnnouncer />}
        </div>
      );
    };

    const { rerender } = render(<TestComponent showAnnouncer={true} />);

    const button = screen.getByRole('button');
    act(() => {
      fireEvent.click(button);
    });

    // Unmount LiveAnnouncer before timer triggers
    rerender(<TestComponent showAnnouncer={false} />);

    expect(() => {
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }).not.toThrow();
  });
});
