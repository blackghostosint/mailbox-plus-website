import React, { useState, useCallback, useEffect, useRef } from 'react';

/* eslint-disable no-unused-vars */
export interface UseLiveAnnouncerReturn {
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
  LiveAnnouncer: React.ComponentType;
}
/* eslint-enable no-unused-vars */

export function useLiveAnnouncer(): UseLiveAnnouncerReturn {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const politeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assertiveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announcePolite = useCallback((message: string) => {
    setPoliteMessage('');
    if (politeTimeoutRef.current) clearTimeout(politeTimeoutRef.current);
    politeTimeoutRef.current = setTimeout(() => {
      setPoliteMessage(message);
    }, 50);
  }, []);

  const announceAssertive = useCallback((message: string) => {
    setAssertiveMessage('');
    if (assertiveTimeoutRef.current) clearTimeout(assertiveTimeoutRef.current);
    assertiveTimeoutRef.current = setTimeout(() => {
      setAssertiveMessage(message);
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
        <div role="status" aria-live="polite" aria-atomic="true">
          {politeMessage}
        </div>
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {assertiveMessage}
        </div>
      </div>
    );
  }, [politeMessage, assertiveMessage]);

  return {
    announcePolite,
    announceAssertive,
    LiveAnnouncer,
  };
}
