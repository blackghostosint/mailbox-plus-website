import { describe, it, expect, vi } from 'vitest';
import { getGoogleMapsLink } from './location';

// Mock siteConfig
vi.mock('../config/siteConfig', () => ({
  siteConfig: {
    geo: { lat: 41.66497, lng: -81.24164 },
  },
}));

describe('getGoogleMapsLink', () => {
  it('generates directions URL by default', () => {
    const url = getGoogleMapsLink();
    expect(url).toContain('https://www.google.com/maps/dir/');
    expect(url).toContain('api=1');
    expect(url).toContain('destination=41.66497,-81.24164');
  });

  it('generates directions URL with label', () => {
    const url = getGoogleMapsLink('directions', 'Mailbox Plus');
    expect(url).toContain('destination=41.66497,-81.24164');
    expect(url).toContain('+(Mailbox%20Plus)');
  });

  it('generates view URL for map centering', () => {
    const url = getGoogleMapsLink('view');
    expect(url).toBe('https://www.google.com/maps/@41.66497,-81.24164,17z');
  });

  it('view mode does not include label', () => {
    const url = getGoogleMapsLink('view', 'Mailbox Plus');
    expect(url).toBe('https://www.google.com/maps/@41.66497,-81.24164,17z');
  });

  it('encodes special characters in label', () => {
    const url = getGoogleMapsLink('directions', 'A&B Store');
    expect(url).toContain('+(A%26B%20Store)');
  });
});
