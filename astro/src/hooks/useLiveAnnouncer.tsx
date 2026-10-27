import React, { useCallback, useEffect, useRef } from 'react';
import {
  announcePolite as announcePoliteLib,
  announceAssertive as announceAssertiveLib,
  getPoliteMessage,
  getAssertiveMessage,
  cancelPendingAnnouncements,
} from '../lib/announcer';

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

  const announcePolite = useCallback((message: string) => {
    announcePoliteLib(message);
  }, []);

  const announceAssertive = useCallback((message: string) => {
    announceAssertiveLib(message);
  }, []);

  useEffect(() => {
    return () => {
      cancelPendingAnnouncements();
    };
  }, []);

  const setPoliteRef = useCallback((node: HTMLDivElement | null) => {
    politeRef.current = node;
    const msg = getPoliteMessage();
    if (node && msg) {
      node.textContent = msg;
    }
  }, []);

  const setAssertiveRef = useCallback((node: HTMLDivElement | null) => {
    assertiveRef.current = node;
    const msg = getAssertiveMessage();
    if (node && msg) {
      node.textContent = msg;
    }
  }, []);

  const LiveAnnouncer: React.FC = useCallback(() => {
    return (
      <div className="sr-only" aria-hidden="false">
        <div
          id="live-announcer-polite"
          ref={setPoliteRef}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        />
        <div
          id="live-announcer-assertive"
          ref={setAssertiveRef}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        />
      </div>
    );
  }, [setPoliteRef, setAssertiveRef]);

  return {
    announcePolite,
    announceAssertive,
    LiveAnnouncer,
  };
}
