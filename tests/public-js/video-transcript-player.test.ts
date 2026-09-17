// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import videoMod from '../../public/js/video-transcript-player.js';

describe('video-transcript-player.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <video src="test.mp4"></video>
      <button aria-pressed="false"><span>Audio Descriptions: OFF</span></button>
      <div id="audio-description-banner" class="hidden"></div>
      <div id="audio-description-text"></div>
      <div id="video-transcript-announcer"></div>
      <div class="space-y-3">
        <div>
          <button class="timecode">0:00</button>
          <button class="transcript-text">Line 1</button>
        </div>
      </div>
    `;

    // @ts-ignore
    window.SpeechSynthesisUtterance = vi.fn();
    // @ts-ignore
    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
    };
  });

  it('toggles audio descriptions and updates button state', () => {
    videoMod.initVideoTranscriptPlayer();

    const btn = document.querySelector('button[aria-pressed]') as HTMLButtonElement;
    const announcer = document.getElementById('video-transcript-announcer') as HTMLDivElement;

    btn.click();

    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(announcer.textContent).toBe('Audio descriptions enabled');

    btn.click();

    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(announcer.textContent).toBe('Audio descriptions disabled');
  });

  it('seeks video when timecode button clicked', () => {
    videoMod.initVideoTranscriptPlayer();

    const video = document.querySelector('video') as HTMLVideoElement;
    video.play = vi.fn().mockResolvedValue(undefined);

    const timecodeBtn = document.querySelector('.timecode') as HTMLButtonElement;
    timecodeBtn.click();

    expect(video.currentTime).toBe(0);
  });
});
