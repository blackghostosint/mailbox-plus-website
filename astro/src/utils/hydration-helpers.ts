/* eslint-disable no-unused-vars */
/**
 * Hydration & Analytics Queue Helpers
 *
 * Provides pure functions to initialize synchronous queuing stubs (window.dataLayer,
 * window.gtag, window.fbq) for third-party analytics scripts before external SDKs load.
 * Designed to run deterministically in Node or browser environments without DOM emulation.
 */

export interface DataLayerWindow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLayer?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gtag?: (..._args: any[]) => void;
}

export interface FbqFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (..._args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callMethod?: (..._args: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue?: any[];
  fbq?: FbqFunction;
  push?: FbqFunction;
  loaded?: boolean;
  version?: string;
}

export interface FbqWindow {
  fbq?: FbqFunction;
  _fbq?: FbqFunction;
}

export type AnalyticsWindow = DataLayerWindow & FbqWindow;

/**
 * Initializes GA4 dataLayer array and gtag function stub on a target window/object.
 * Events pushed via gtag before GA4 script loads are buffered synchronously in dataLayer.
 */
export function initDataLayer<T extends DataLayerWindow>(
  target?: T
): T & Required<DataLayerWindow> {
  const win = (target || (typeof window !== 'undefined' ? window : {})) as T &
    Required<DataLayerWindow>;

  if (!win.dataLayer) {
    win.dataLayer = [];
  }

  if (!win.gtag) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    win.gtag = function (...args: any[]) {
      if (!win.dataLayer) {
        win.dataLayer = [];
      }
      win.dataLayer.push(Array.from(args));
    };
  }

  return win;
}

/**
 * Initializes Meta Pixel (fbq) function stub on a target window/object.
 * Events tracked via fbq before fbevents.js loads are queued in fbq.queue.
 */
export function initFbqStub<T extends FbqWindow>(target?: T): T & Required<FbqWindow> {
  const win = (target || (typeof window !== 'undefined' ? window : {})) as T & Required<FbqWindow>;

  if (!win.fbq) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fbqStub: FbqFunction = function (...args: any[]) {
      if (fbqStub.callMethod) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fbqStub.callMethod.apply(fbqStub, args as any);
      } else {
        if (!fbqStub.queue) {
          fbqStub.queue = [];
        }
        fbqStub.queue.push(Array.from(args));
      }
    };

    fbqStub.push = fbqStub;
    fbqStub.loaded = true;
    fbqStub.version = '2.0';
    fbqStub.queue = [];

    win.fbq = fbqStub;
    if (!win._fbq) {
      win._fbq = fbqStub;
    }
  }

  return win;
}

/**
 * Initializes all analytics queuing stubs (GA4 dataLayer/gtag and Meta Pixel fbq)
 * on a target object synchronously.
 */
export function initAnalyticsStubs<T extends AnalyticsWindow>(
  target?: T
): T & Required<AnalyticsWindow> {
  const win = (target || (typeof window !== 'undefined' ? window : {})) as T &
    Required<AnalyticsWindow>;
  initDataLayer(win);
  initFbqStub(win);
  return win;
}
