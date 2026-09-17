/* global module */
(function () {
  function initVideoTranscriptPlayer() {
    const video = document.querySelector('video');
    if (!video) return;

    // Transcript cues data
    const transcriptCues = [
      {
        start: 0,
        end: 9,
        text: 'After you submit the form, we review your application. Business accounts check next business day. Personal accounts activate right away.',
      },
      {
        start: 9,
        end: 17,
        text: 'An activation email goes to your inbox. Open it. Click the link. Your mailbox opens.',
      },
      {
        start: 17,
        end: 24,
        text: 'Your mailing address is 7554 Fredle Drive, PMB 456, Concord Township.',
      },
      {
        start: 24,
        end: 35,
        text: 'A welcome email follows. It confirms your address. It lists office hours. It reminds you to bring ID. Print it or save it.',
      },
      {
        start: 35,
        end: 47,
        text: 'Mail arrives. Packages arrive. We sign for carriers. We note each item. Everything stays secure until you arrive.',
      },
      { start: 47, end: 54, text: 'Stop by during open hours. Show your ID. Collect your mail.' },
      {
        start: 54,
        end: 63,
        text: 'Use the address now. Put it on bills. List it for online orders. Forward old mail here.',
      },
      { start: 63, end: 70, text: "That's the process. Shipping shouldn't cost you an hour." },
    ];

    const descriptionCues = [
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

    let audioDescriptionsEnabled = false;
    let activeCueIndex = -1;
    let activeDescriptionId = null;
    let lastSpokenDesc = null;
    let lastAnnouncedCueIndex = -1;

    // Find DOM elements
    const audioDescBtn = document.querySelector('button[aria-pressed]');
    const audioDescBanner = document.getElementById('audio-description-banner');
    const audioDescText = document.getElementById('audio-description-text');
    const liveAnnouncer = document.getElementById('video-transcript-announcer');
    const cueContainers = document.querySelectorAll('.space-y-3 > div');

    const announce = (message) => {
      if (liveAnnouncer) {
        liveAnnouncer.textContent = message;
      }
    };

    // Timecode seeking handlers
    cueContainers.forEach((container, index) => {
      const cue = transcriptCues[index];
      if (!cue) return;

      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          video.currentTime = cue.start;
          video.play().catch(() => {});
          btn.focus();
        });
      });
    });

    // Toggle Audio Descriptions
    if (audioDescBtn) {
      audioDescBtn.addEventListener('click', () => {
        audioDescriptionsEnabled = !audioDescriptionsEnabled;
        audioDescBtn.setAttribute('aria-pressed', audioDescriptionsEnabled ? 'true' : 'false');

        const span = audioDescBtn.querySelector('span');
        if (span) {
          span.textContent = `Audio Descriptions: ${audioDescriptionsEnabled ? 'ON' : 'OFF'}`;
        }

        if (audioDescriptionsEnabled) {
          audioDescBtn.classList.remove(
            'bg-[var(--color-bg-primary)]',
            'text-[var(--color-text-primary)]'
          );
          audioDescBtn.classList.add('bg-[var(--color-primary)]', 'text-white', 'shadow-sm');
          announce('Audio descriptions enabled');
        } else {
          audioDescBtn.classList.add(
            'bg-[var(--color-bg-primary)]',
            'text-[var(--color-text-primary)]'
          );
          audioDescBtn.classList.remove('bg-[var(--color-primary)]', 'text-white', 'shadow-sm');
          if (audioDescBanner) audioDescBanner.classList.add('hidden');
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          announce('Audio descriptions disabled');
        }

        // Sync tracks
        const tracks = video.textTracks;
        if (tracks) {
          for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].kind === 'descriptions') {
              tracks[i].mode = audioDescriptionsEnabled ? 'showing' : 'disabled';
            }
          }
        }
      });
    }

    // Handle video time update
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;

      // Update active cue
      const newCueIndex = transcriptCues.findIndex(
        (c) => currentTime >= c.start && currentTime < c.end
      );

      if (newCueIndex !== activeCueIndex) {
        activeCueIndex = newCueIndex;
        cueContainers.forEach((container, idx) => {
          const isActive = idx === activeCueIndex;
          const textBtn = container.querySelectorAll('button')[1];
          if (isActive) {
            container.className =
              'p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 bg-[var(--color-bg-warm-tint)] border-[var(--color-accent-warm)] shadow-sm ring-1 ring-[var(--color-accent-warm)]/30';
            if (textBtn) {
              textBtn.setAttribute('aria-current', 'true');
              if (!textBtn.querySelector('.active-badge')) {
                const badge = document.createElement('span');
                badge.className =
                  'active-badge ml-2.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[var(--color-accent-warm)] text-white align-middle';
                badge.textContent = 'Active';
                textBtn.appendChild(badge);
              }
            }
          } else {
            container.className =
              'p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border)] hover:border-[var(--color-primary-light)]';
            if (textBtn) {
              textBtn.removeAttribute('aria-current');
              const badge = textBtn.querySelector('.active-badge');
              if (badge) badge.remove();
            }
          }
        });

        if (activeCueIndex !== -1 && activeCueIndex !== lastAnnouncedCueIndex) {
          lastAnnouncedCueIndex = activeCueIndex;
          announce(`Transcript line: ${transcriptCues[activeCueIndex].text}`);
        }
      }

      // Speech synthesis audio descriptions
      if (audioDescriptionsEnabled) {
        const descCue = descriptionCues.find((c) => currentTime >= c.start && currentTime < c.end);
        if (descCue) {
          if (descCue.id !== activeDescriptionId) {
            activeDescriptionId = descCue.id;
            if (audioDescText) audioDescText.textContent = descCue.text;
            if (audioDescBanner) audioDescBanner.classList.remove('hidden');

            if (descCue.id !== lastSpokenDesc && 'speechSynthesis' in window) {
              lastSpokenDesc = descCue.id;
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(descCue.text);
              utterance.rate = 1.0;
              window.speechSynthesis.speak(utterance);
            }
          }
        } else {
          activeDescriptionId = null;
          if (audioDescBanner) audioDescBanner.classList.add('hidden');
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleTimeUpdate);
    video.addEventListener('pause', () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initVideoTranscriptPlayer);
    } else {
      initVideoTranscriptPlayer();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initVideoTranscriptPlayer };
  }
  if (typeof window !== 'undefined') {
    window.initVideoTranscriptPlayer = initVideoTranscriptPlayer;
  }
})();
