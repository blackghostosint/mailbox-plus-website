// @vitest-environment happy-dom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VideoTranscriptPlayer, {
  formatTimecode,
  DEFAULT_TRANSCRIPT_CUES,
  DEFAULT_DESCRIPTION_CUES,
} from './VideoTranscriptPlayer';
import { renderToString } from 'react-dom/server';

describe('VideoTranscriptPlayer Component', () => {
  it('formats timecodes correctly in MM:SS format', () => {
    expect(formatTimecode(0)).toBe('0:00');
    expect(formatTimecode(9)).toBe('0:09');
    expect(formatTimecode(17)).toBe('0:17');
    expect(formatTimecode(63)).toBe('1:03');
    expect(formatTimecode(125)).toBe('2:05');
  });

  it('contains expected default transcript and description cues', () => {
    expect(DEFAULT_TRANSCRIPT_CUES.length).toBeGreaterThan(0);
    expect(DEFAULT_DESCRIPTION_CUES.length).toBeGreaterThan(0);
    expect(DEFAULT_TRANSCRIPT_CUES[0].text).toContain('After you submit the form');
    expect(DEFAULT_DESCRIPTION_CUES[0].text).toContain('Staff member reviewing');
  });

  it('renders static HTML correctly on SSR (server-side rendering)', () => {
    const html = renderToString(<VideoTranscriptPlayer />);

    // Video player elements
    expect(html).toContain('video');
    expect(html).toContain('/videos/mailbox-plus-explainer.mp4');
    expect(html).toContain('/videos/mailbox-plus-explainer-captions.vtt');
    expect(html).toContain('/videos/mailbox-plus-explainer-descriptions.vtt');
    expect(html).toContain('kind="descriptions"');
    expect(html).toContain('kind="captions"');

    // Accessibility controls
    expect(html).toContain('Audio Descriptions: OFF');
    expect(html).toContain('Accessibility Options');

    // Interactive Transcript section
    expect(html).toContain('Interactive Video Transcript');
    expect(html).toContain('0:00');
    expect(html).toContain('0:09');
    expect(html).toContain('0:17');
    expect(html).toContain('1:03');
    expect(html).toContain('After you submit the form');
    expect(html).toContain('An activation email goes to your inbox');
  });

  it('accepts custom cues and props', () => {
    const customCues = [
      { id: 'c1', start: 0, end: 5, text: 'Custom test line 1' },
      { id: 'c2', start: 5, end: 10, text: 'Custom test line 2' },
    ];

    const html = renderToString(
      <VideoTranscriptPlayer
        videoUrl="/videos/test-video.mp4"
        ariaLabel="Custom test video"
        cues={customCues}
      />
    );

    expect(html).toContain('/videos/test-video.mp4');
    expect(html).toContain('Custom test line 1');
    expect(html).toContain('Custom test line 2');
    expect(html).toContain('0:05');
  });

  it('toggles audio descriptions and updates live announcer on user click', () => {
    render(<VideoTranscriptPlayer />);

    const descBtn = screen.getByRole('button', { name: /Audio Descriptions:/i });
    expect(descBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(descBtn);

    expect(descBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('Audio Descriptions: ON')).toBeTruthy();

    const liveAnnouncer = document.getElementById('video-transcript-announcer');
    expect(liveAnnouncer?.textContent).toBe('Audio descriptions enabled');

    fireEvent.click(descBtn);

    expect(descBtn.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByText('Audio Descriptions: OFF')).toBeTruthy();
    expect(liveAnnouncer?.textContent).toBe('Audio descriptions disabled');
  });

  it('updates currentTime and plays video when cue seek button is clicked', () => {
    render(<VideoTranscriptPlayer />);

    const video = document.querySelector('video') as HTMLVideoElement;
    video.play = vi.fn().mockResolvedValue(undefined);

    const seekBtn = screen.getByRole('button', { name: 'Seek video to 0:09' });
    fireEvent.click(seekBtn);

    expect(video.currentTime).toBe(9);
    expect(video.play).toHaveBeenCalled();
  });
});
