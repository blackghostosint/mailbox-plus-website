import React, { useCallback, useEffect, useRef } from 'react';

/* eslint-disable no-unused-vars */
export interface UseLiveAnnouncerReturn {
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
  LiveAnnouncer: React.ComponentType;
}
/* eslint-enable no-unused-vars */

export function useLiveAnnouncer(): UseLiveAnnouncerReturn {
  const politeRef = useRef<HTMLDivElement | null>(null);
  const assertiveRef = useRef<HTMLDivElement | null>(null);
  const politeMsgRef = useRef<string>('');
  const assertiveMsgRef = useRef<string>('');
  const politeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assertiveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announcePolite = useCallback((message: string) => {
    politeMsgRef.current = '';
    if (politeRef.current) {
      politeRef.current.textContent = '';
    }
    if (politeTimeoutRef.current) clearTimeout(politeTimeoutRef.current);
    politeTimeoutRef.current = setTimeout(() => {
      politeMsgRef.current = message;
      if (politeRef.current) {
        politeRef.current.textContent = message;
      }
    }, 50);
  }, []);

  const announceAssertive = useCallback((message: string) => {
    assertiveMsgRef.current = '';
    if (assertiveRef.current) {
      assertiveRef.current.textContent = '';
    }
    if (assertiveTimeoutRef.current) clearTimeout(assertiveTimeoutRef.current);
    assertiveTimeoutRef.current = setTimeout(() => {
      assertiveMsgRef.current = message;
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

  const setPoliteRef = useCallback((node: HTMLDivElement | null) => {
    politeRef.current = node;
    if (node && politeMsgRef.current) {
      node.textContent = politeMsgRef.current;
    }
  }, []);

  const setAssertiveRef = useCallback((node: HTMLDivElement | null) => {
    assertiveRef.current = node;
    if (node && assertiveMsgRef.current) {
      node.textContent = assertiveMsgRef.current;
    }
  }, []);

  const LiveAnnouncer: React.FC = useCallback(() => {
    return (
      <div className="sr-only" aria-hidden="false">
        <div ref={setPoliteRef} role="status" aria-live="polite" aria-atomic="true" />
        <div ref={setAssertiveRef} role="alert" aria-live="assertive" aria-atomic="true" />
      </div>
    );
  }, [setPoliteRef, setAssertiveRef]);

  return {
    announcePolite,
    announceAssertive,
    LiveAnnouncer,
  };
}
