// @vitest-environment happy-dom
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

  it('updates active transcript cue and live announcer when video timeupdate fires', () => {
    render(<VideoTranscriptPlayer />);

    const video = document.querySelector('video') as HTMLVideoElement;
    let currentVideoTime = 10;
    Object.defineProperty(video, 'currentTime', {
      get: () => currentVideoTime,
      set: (val) => {
        currentVideoTime = val;
      },
      configurable: true,
    });

    fireEvent.timeUpdate(video);

    expect(screen.getByText('Active')).toBeTruthy();
    const liveAnnouncer = document.getElementById('video-transcript-announcer');
    expect(liveAnnouncer?.textContent).toContain('An activation email goes to your inbox');

    // Clicking line text button seeks video to start of cue
    video.play = vi.fn().mockResolvedValue(undefined);
    const lineBtn = screen.getByText('After you submit the form, we review your application. Business accounts check next business day. Personal accounts activate right away.');
    fireEvent.click(lineBtn.closest('button')!);

    expect(video.currentTime).toBe(0);
    expect(video.play).toHaveBeenCalled();
  });

  it('handles audio descriptions narration via speech synthesis on timeupdate', () => {
    const mockSpeak = vi.fn();
    const mockCancel = vi.fn();

    // Mock speechSynthesis and SpeechSynthesisUtterance before render
    class MockUtterance {
      text: string;
      rate = 1;
      constructor(text: string) {
        this.text = text;
      }
    }

    (window as unknown as Record<string, unknown>).speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
    };

    (window as unknown as Record<string, unknown>).SpeechSynthesisUtterance = MockUtterance;

    render(<VideoTranscriptPlayer />);

    const descBtn = screen.getByRole('button', { name: /Audio Descriptions:/i });
    fireEvent.click(descBtn);

    const video = document.querySelector('video') as HTMLVideoElement;
    let currentVideoTime = 2;
    Object.defineProperty(video, 'currentTime', {
      get: () => currentVideoTime,
      set: (val) => {
        currentVideoTime = val;
      },
      configurable: true,
    });

    act(() => {
      fireEvent.timeUpdate(video);
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(screen.getByText('Audio Description Narrating')).toBeTruthy();
    expect(screen.getByText(/Staff member reviewing incoming online mailbox registration/i)).toBeTruthy();

    // Fire pause event to cancel speech synthesis
    act(() => {
      fireEvent.pause(video);
    });
    expect(mockCancel).toHaveBeenCalledTimes(2);
  });

  it('updates textTrack mode when audio descriptions toggled', () => {
    render(<VideoTranscriptPlayer />);

    const video = document.querySelector('video') as HTMLVideoElement;
    const mockTrack = { kind: 'descriptions', mode: 'disabled' };
    Object.defineProperty(video, 'textTracks', {
      value: [mockTrack],
      writable: true,
    });

    const descBtn = screen.getByRole('button', { name: /Audio Descriptions:/i });
    fireEvent.click(descBtn);

    expect(mockTrack.mode).toBe('showing');

    fireEvent.click(descBtn);
    expect(mockTrack.mode).toBe('disabled');
  });
});
