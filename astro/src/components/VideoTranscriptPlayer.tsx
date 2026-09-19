import React from 'react';
import { IconWrapper } from './ui/IconWrapper';

export interface TranscriptCue {
  id: string;
  start: number;
  end: number;
  text: string;
}

export interface DescriptionCue {
  id: string;
  start: number;
  end: number;
  text: string;
}

export const DEFAULT_TRANSCRIPT_CUES: TranscriptCue[] = [
  {
    id: '1',
    start: 0,
    end: 9,
    text: 'After you submit the form, we review your application. Business accounts check next business day. Personal accounts activate right away.',
  },
  {
    id: '2',
    start: 9,
    end: 17,
    text: 'An activation email goes to your inbox. Open it. Click the link. Your mailbox opens.',
  },
  {
    id: '3',
    start: 17,
    end: 24,
    text: 'Your mailing address is 7554 Fredle Drive, PMB 456, Concord Township.',
  },
  {
    id: '4',
    start: 24,
    end: 35,
    text: 'A welcome email follows. It confirms your address. It lists office hours. It reminds you to bring ID. Print it or save it.',
  },
  {
    id: '5',
    start: 35,
    end: 47,
    text: 'Mail arrives. Packages arrive. We sign for carriers. We note each item. Everything stays secure until you arrive.',
  },
  {
    id: '6',
    start: 47,
    end: 54,
    text: 'Stop by during open hours. Show your ID. Collect your mail.',
  },
  {
    id: '7',
    start: 54,
    end: 63,
    text: 'Use the address now. Put it on bills. List it for online orders. Forward old mail here.',
  },
  {
    id: '8',
    start: 63,
    end: 70,
    text: "That's the process. Shipping shouldn't cost you an hour.",
  },
];

export const DEFAULT_DESCRIPTION_CUES: DescriptionCue[] = [
  {
    id: 'd1',
    start: 0.5,
    end: 8.5,
    text: 'Staff member reviewing incoming online mailbox registration application on computer screen.',
  },
  {
    id: 'd2',
    start: 9.5,
    end: 16.5,
    text: 'A customer receives an activation email on mobile phone and taps the verification link.',
  },
  {
    id: 'd3',
    start: 17.5,
    end: 23.5,
    text: 'The official Concord Township mailing address and PMB suite number appear on screen.',
  },
  {
    id: 'd4',
    start: 24.5,
    end: 34.5,
    text: 'Welcome email displayed showing store operating hours and acceptable identification forms.',
  },
  {
    id: 'd5',
    start: 35.5,
    end: 46.5,
    text: 'Delivery driver hands packages to staff. Staff signs receipt and logs packages in secure package vault.',
  },
  {
    id: 'd6',
    start: 47.5,
    end: 53.5,
    text: 'Customer presents government photo ID at front counter to verify identity and collect packages.',
  },
  {
    id: 'd7',
    start: 54.5,
    end: 62.5,
    text: 'Animation showing new PMB address updated across online utility accounts and merchant profiles.',
  },
  {
    id: 'd8',
    start: 63.5,
    end: 69.5,
    text: 'Mailbox Plus storefront exterior view with customer leaving with retrieved packages.',
  },
];

export interface VideoTranscriptPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  captionsUrl?: string;
  descriptionsUrl?: string;
  ariaLabel?: string;
  cues?: TranscriptCue[];
  descriptionCues?: DescriptionCue[];
}

export function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const VideoTranscriptPlayer: React.FC<VideoTranscriptPlayerProps> = ({
  videoUrl = '/videos/mailbox-plus-explainer.mp4',
  posterUrl = '/videos/mailbox-plus-explainer-thumbnail.jpg',
  captionsUrl = '/videos/mailbox-plus-explainer-captions.vtt',
  descriptionsUrl = '/videos/mailbox-plus-explainer-descriptions.vtt',
  ariaLabel = 'Mailbox Plus explainer video — what happens after signing up for mailbox service',
  cues = DEFAULT_TRANSCRIPT_CUES,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Video Container */}
      <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-[var(--color-border-strong)] bg-[var(--color-primary-deep)] relative aspect-video mb-6">
        <video
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          poster={posterUrl}
          playsInline
          aria-label={ariaLabel}
        >
          <source src={videoUrl} type="video/mp4" />
          <track src={captionsUrl} kind="captions" srcLang="en" label="English" default />
          <track
            src={descriptionsUrl}
            kind="descriptions"
            srcLang="en"
            label="Audio Descriptions"
          />
          Your browser does not support the video tag. Watch our walkthrough of what happens after
          signing up for a mailbox at Mailbox Plus in Concord Township, Ohio.
        </video>
      </div>

      {/* Media Controls / Accessibility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--color-bg-secondary)] p-4 rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <IconWrapper>
            <svg
              className="w-5 h-5 text-[var(--color-primary)]"
              aria-hidden="true"
              focusable="false"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 010 12.728M12 6v12m0-12L8 10H4v4h4l4 4"
              />
            </svg>
          </IconWrapper>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            Accessibility Options
          </span>
        </div>

        <button
          type="button"
          aria-pressed="false"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]"
        >
          <IconWrapper>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              focusable="false"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          </IconWrapper>
          <span>Audio Descriptions: OFF</span>
        </button>
      </div>

      {/* Audio Description Banner container when activated via JS */}
      <div
        id="audio-description-banner"
        className="hidden mb-6 p-4 rounded-xl bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] text-[var(--color-primary-dark)] flex items-start gap-3"
      >
        <IconWrapper>
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-primary)]"
            aria-hidden="true"
            focusable="false"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </IconWrapper>
        <div>
          <span className="font-bold block text-xs uppercase tracking-wider text-[var(--color-primary)] mb-1">
            Audio Description Narrating
          </span>
          <p id="audio-description-text" className="text-sm font-medium leading-relaxed"></p>
        </div>
      </div>

      {/* Synchronized Interactive Transcript */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <IconWrapper>
              <svg
                className="w-6 h-6 text-[var(--color-accent-warm)] flex-shrink-0"
                aria-hidden="true"
                focusable="false"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </IconWrapper>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
              Interactive Video Transcript
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium">
            Click line or timestamp to seek video
          </span>
        </div>

        <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
          {cues.map((cue) => {
            return (
              <div
                key={cue.id}
                className="p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
              >
                <button
                  type="button"
                  aria-label={`Seek video to ${formatTimecode(cue.start)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] hover:text-white transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <IconWrapper>
                    <svg
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                      focusable="false"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  </IconWrapper>
                  <span>{formatTimecode(cue.start)}</span>
                </button>

                <button
                  type="button"
                  className="text-left flex-1 text-base leading-relaxed text-[var(--color-text-primary)] font-medium hover:text-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded-md p-1 -m-1"
                >
                  <span>{cue.text}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ARIA Live Region for Screen Readers */}
      <div
        id="video-transcript-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
};

export default VideoTranscriptPlayer;
