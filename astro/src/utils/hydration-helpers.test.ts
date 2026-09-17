import { describe, it, expect, vi } from 'vitest';
import { initDataLayer, initFbqStub, initAnalyticsStubs } from './hydration-helpers';
import type { AnalyticsWindow } from './hydration-helpers';

describe('hydration-helpers', () => {
  describe('initDataLayer', () => {
    it('initializes dataLayer and gtag on a target object', () => {
      const mockWin: AnalyticsWindow = {};
      initDataLayer(mockWin);

      expect(Array.isArray(mockWin.dataLayer)).toBe(true);
      expect(typeof mockWin.gtag).toBe('function');
      expect(mockWin.dataLayer?.length).toBe(0);
    });

    it('synchronously buffers gtag events in dataLayer', () => {
      const mockWin: AnalyticsWindow = {};
      initDataLayer(mockWin);

      mockWin.gtag!('js', '2026-09-17');
      mockWin.gtag!('config', 'G-W2J1KV96YJ', { send_page_view: true });

      expect(mockWin.dataLayer?.length).toBe(2);
      expect(mockWin.dataLayer![0]).toEqual(['js', '2026-09-17']);
      expect(mockWin.dataLayer![1]).toEqual(['config', 'G-W2J1KV96YJ', { send_page_view: true }]);
    });

    it('preserves existing dataLayer array if already initialized', () => {
      const existingDataLayer = [['existing_event']];
      const mockWin: AnalyticsWindow = { dataLayer: existingDataLayer };

      initDataLayer(mockWin);

      expect(mockWin.dataLayer).toBe(existingDataLayer);
      mockWin.gtag!('event', 'click');
      expect(mockWin.dataLayer?.length).toBe(2);
      expect(mockWin.dataLayer![0]).toEqual(['existing_event']);
    });
  });

  describe('initFbqStub', () => {
    it('initializes fbq stub and flags on target object', () => {
      const mockWin: AnalyticsWindow = {};
      initFbqStub(mockWin);

      expect(typeof mockWin.fbq).toBe('function');
      expect(mockWin._fbq).toBe(mockWin.fbq);
      expect(mockWin.fbq?.loaded).toBe(true);
      expect(mockWin.fbq?.version).toBe('2.0');
      expect(Array.isArray(mockWin.fbq?.queue)).toBe(true);
      expect(mockWin.fbq?.push).toBe(mockWin.fbq);
    });

    it('synchronously queues tracking calls when SDK is not loaded', () => {
      const mockWin: AnalyticsWindow = {};
      initFbqStub(mockWin);

      mockWin.fbq!('init', '1684128789653811');
      mockWin.fbq!('track', 'PageView');

      expect(mockWin.fbq?.queue?.length).toBe(2);
      expect(mockWin.fbq?.queue![0]).toEqual(['init', '1684128789653811']);
      expect(mockWin.fbq?.queue![1]).toEqual(['track', 'PageView']);
    });

    it('delegates to callMethod when callMethod is present', () => {
      const mockWin: AnalyticsWindow = {};
      initFbqStub(mockWin);

      const callMethodSpy = vi.fn();
      mockWin.fbq!.callMethod = callMethodSpy;

      mockWin.fbq!('track', 'Purchase', { value: 100 });

      expect(callMethodSpy).toHaveBeenCalledWith('track', 'Purchase', { value: 100 });
      expect(mockWin.fbq?.queue?.length).toBe(0);
    });

    it('is idempotent and preserves existing fbq function', () => {
      const mockWin: AnalyticsWindow = {};
      initFbqStub(mockWin);
      const originalFbq = mockWin.fbq;

      initFbqStub(mockWin);
      expect(mockWin.fbq).toBe(originalFbq);
    });
  });

  describe('initAnalyticsStubs', () => {
    it('initializes both GA4 and Meta Pixel stubs on a single target object', () => {
      const mockWin: AnalyticsWindow = {};
      initAnalyticsStubs(mockWin);

      expect(Array.isArray(mockWin.dataLayer)).toBe(true);
      expect(typeof mockWin.gtag).toBe('function');
      expect(typeof mockWin.fbq).toBe('function');
      expect(mockWin._fbq).toBe(mockWin.fbq);
    });
  });
});
