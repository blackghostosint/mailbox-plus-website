import React, { useCallback, useEffect, useRef } from 'react';

/* eslint-disable no-unused-vars */
export interface UseLiveAnnouncerReturn {
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
  LiveAnnouncer: React.ComponentType;
}
/* eslint-enable no-unused-vars */

export function useLiveAnnouncer(): UseLiveAnnouncerReturn {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);
  const politeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assertiveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announcePolite = useCallback((message: string) => {
    if (politeRef.current) {
      politeRef.current.textContent = '';
    }
    if (politeTimeoutRef.current) clearTimeout(politeTimeoutRef.current);
    politeTimeoutRef.current = setTimeout(() => {
      if (politeRef.current) {
        politeRef.current.textContent = message;
      }
    }, 50);
  }, []);

  const announceAssertive = useCallback((message: string) => {
    if (assertiveRef.current) {
      assertiveRef.current.textContent = '';
    }
    if (assertiveTimeoutRef.current) clearTimeout(assertiveTimeoutRef.current);
    assertiveTimeoutRef.current = setTimeout(() => {
      if (assertiveRef.current) {
        assertiveRef.current.textContent = message;
      }
    }, 50);
  }, []);

  useEffect(() => {
    return () => {
      if (politeTimeoutRef.current) clearTimeout(politeTimeoutRef.current);
      if (assertiveTimeoutRef.current) clearTimeout(assertiveTimeoutRef.current);
    };
  }, []);

  const LiveAnnouncer: React.FC = useCallback(() => {
    return (
      <div className="sr-only" aria-hidden="false">
        <div ref={politeRef} role="status" aria-live="polite" aria-atomic="true" />
        <div ref={assertiveRef} role="alert" aria-live="assertive" aria-atomic="true" />
      </div>
    );
  }, []);

  return {
    announcePolite,
    announceAssertive,
    LiveAnnouncer,
  };
}
