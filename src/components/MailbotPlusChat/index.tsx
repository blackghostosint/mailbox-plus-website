import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSuppression } from './hooks/useSuppression';
import { useTriggerConditions } from './hooks/useTriggerConditions';
import { useMediaQuery } from './hooks/useMediaQuery';

// ============================================================================
// TYPES
// ============================================================================

export interface MailbotPlusChatProps {
  isHighIntentPage?: boolean;
  autoExpandDelay?: number;
  scrollThreshold?: number;
  // eslint-disable-next-line no-unused-vars
  onAnalyticsEvent?: (_: string, __: Record<string, string | number | boolean | undefined>) => void;
  // eslint-disable-next-line no-unused-vars
  onSubmitQuestion?: (_: string) => Promise<ChatbotResponse>;
  className?: string;
  launcherClassName?: string;
}

export interface ChatbotResponse {
  type: 'accept' | 'refuse';
  answer?: string;
  sourceUrl?: string;
  faqId?: string;
  confidence?: number;
}

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
  sourceUrl?: string;
  faqId?: string;
  timestamp: Date;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const GREETING_MESSAGE: ChatMessage = {
  id: 'greeting',
  role: 'bot',
  content: "Hi! I'm Mail-bot Plus. I can help answer common questions about our services.",
  timestamp: new Date(),
};

const REFUSAL_TEXT =
  "I don't have that information, but our team can help. You can stop by the store or contact us directly.";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MailbotPlusChat({
  isHighIntentPage = false,
  autoExpandDelay,
  scrollThreshold = 0.25,
  onAnalyticsEvent,
  onSubmitQuestion,
  className = '',
  launcherClassName = '',
}: MailbotPlusChatProps) {
  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);

  // Refs
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { isSuppressed, setSuppression } = useSuppression();
  const { shouldShowLauncher, trigger } = useTriggerConditions({
    isHighIntentPage,
    autoExpandDelay,
    scrollThreshold,
    hasAppeared,
  });
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Auto-show launcher when conditions met (only if not suppressed)
  useEffect(() => {
    if (shouldShowLauncher && !hasAppeared && !isSuppressed) {
      setHasAppeared(true);
      onAnalyticsEvent?.('launcher_shown', { trigger });
    }
  }, [shouldShowLauncher, hasAppeared, isSuppressed, onAnalyticsEvent, trigger]);

  // Focus management
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Keyboard handler for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleClose('esc_key');
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Event handlers
  const handleOpen = useCallback(() => {
    setIsExpanded(true);
    onAnalyticsEvent?.('chat_opened', { trigger: 'user_click' });
  }, [onAnalyticsEvent]);

  const handleClose = useCallback(
    (method: 'close_button' | 'esc_key') => {
      setIsExpanded(false);
      setSuppression();
      onAnalyticsEvent?.('chat_closed', { method });

      // Return focus to launcher
      setTimeout(() => {
        launcherRef.current?.focus();
      }, 100);
    },
    [onAnalyticsEvent, setSuppression]
  );

  const handleSubmit = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isAwaitingResponse || !onSubmitQuestion) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    onAnalyticsEvent?.('question_asked', { questionLength: trimmedInput.length });

    setInputValue('');
    setIsAwaitingResponse(true);

    try {
      const response = await onSubmitQuestion(trimmedInput);

      const botMessage: ChatMessage = {
        id: uuidv4(),
        role: 'bot',
        content: response.type === 'accept' ? response.answer! : REFUSAL_TEXT,
        sourceUrl: response.sourceUrl,
        faqId: response.faqId,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      if (response.type === 'accept') {
        onAnalyticsEvent?.('answer_served', {
          faqId: response.faqId!,
          confidence: response.confidence!,
          question: trimmedInput,
        });
      } else {
        onAnalyticsEvent?.('refusal_served', { query: trimmedInput });
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'bot',
        content: REFUSAL_TEXT,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      onAnalyticsEvent?.('refusal_served', { query: trimmedInput });
    } finally {
      setIsAwaitingResponse(false);
    }
  }, [inputValue, isAwaitingResponse, onSubmitQuestion, onAnalyticsEvent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleSourceLinkClick = useCallback(
    (sourceUrl: string, faqId: string) => {
      onAnalyticsEvent?.('source_link_clicked', { sourceUrl, faqId });
    },
    [onAnalyticsEvent]
  );

  const handleCTAClick = useCallback(
    (ctaType: 'contact' | 'visit') => {
      onAnalyticsEvent?.('cta_clicked', { ctaType });
    },
    [onAnalyticsEvent]
  );

  // Launcher is ALWAYS rendered - suppression only affects auto-show behavior

  return (
    <div className={className}>
      {/* FLOATING LAUNCHER */}
      {!isExpanded && (
        <button
          ref={launcherRef}
          onClick={handleOpen}
          aria-label="Open Mail-bot Plus chat assistant"
          className={`fixed bottom-6 right-6 rounded-full transition-all duration-300 ease-out flex items-center gap-3 text-white font-medium text-base px-5 ${launcherClassName}`}
          style={{
            background: '#0855B1',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.20)',
            height: isMobile ? '56px' : '60px',
            minWidth: isMobile ? '200px' : '220px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 18px 45px rgba(15, 23, 42, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.20)';
          }}
        >
          {/* Chat Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="whitespace-nowrap">Mail-bot Plus Helper</span>
        </button>
      )}

      {/* CHAT PANEL */}
      {isExpanded && (
        <div
          role="dialog"
          aria-labelledby="chatbot-header"
          aria-modal="false"
          className={`fixed bg-white ${
            isMobile ? 'bottom-0 left-0 right-0 rounded-t-3xl' : 'bottom-6 right-6 rounded-3xl w-96'
          } flex flex-col`}
          style={{
            height: isMobile ? '80vh' : '600px',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.20)',
          }}
        >
          {/* HEADER */}
          <div
            className={`flex items-center justify-between px-4 border-b border-slate-200 ${isMobile ? 'h-13' : 'h-14'}`}
          >
            <h2 id="chatbot-header" className="font-semibold" style={{ color: '#0855B1' }}>
              Mail-bot Plus
            </h2>
            <button
              onClick={() => handleClose('close_button')}
              aria-label="Close chat"
              className="p-2 hover:bg-slate-50 rounded-xl transition-all duration-200"
              style={{ color: '#64748b' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* MESSAGE LIST */}
          <div
            ref={messageListRef}
            role="log"
            aria-live="polite"
            aria-atomic="false"
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ background: '#F8FAFC' }}
          >
            {messages.map((msg) =>
              msg.role === 'bot' ? (
                <BotMessage
                  key={msg.id}
                  message={msg}
                  onLinkClick={handleSourceLinkClick}
                  onCTAClick={handleCTAClick}
                />
              ) : (
                <UserMessage key={msg.id} message={msg} />
              )
            )}
            {isAwaitingResponse && <TypingIndicator />}
          </div>

          {/* INPUT FIELD */}
          <div className={`border-t border-slate-200 p-3 bg-white ${isMobile ? 'pb-4' : ''}`}>
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question…"
                aria-label="Ask Mail-bot Plus a question"
                rows={1}
                disabled={isAwaitingResponse}
                className="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2 focus:outline-none disabled:opacity-50 transition-all duration-200"
                style={{
                  boxShadow: '0 0 0 2px rgba(8, 85, 177, 0.25)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0855B1';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(8, 85, 177, 0.10)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                inputMode="text"
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isAwaitingResponse}
                aria-label="Send question"
                className="px-4 py-2 text-white text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                style={{
                  background: '#0855B1',
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 85, 177, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CHILD COMPONENTS
// ============================================================================

function BotMessage({
  message,
  onLinkClick,
  onCTAClick,
}: {
  message: ChatMessage;
  // eslint-disable-next-line no-unused-vars
  onLinkClick: (_: string, __: string) => void;
  // eslint-disable-next-line no-unused-vars
  onCTAClick: (_: 'contact' | 'visit') => void;
}) {
  const isRefusal = message.content === REFUSAL_TEXT;

  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,50,255,0.10))',
          color: '#0855B1',
        }}
      >
        MB+
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        {message.sourceUrl && message.faqId && (
          <a
            href={message.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLinkClick(message.sourceUrl!, message.faqId!)}
            className="inline-flex items-center gap-1 mt-3 text-sm hover:underline transition-all duration-200"
            style={{ color: '#0855B1' }}
          >
            Learn more →
          </a>
        )}
        {isRefusal && (
          <div className="mt-3">
            <a
              href="/contact-us"
              onClick={() => onCTAClick('contact')}
              className="inline-block px-4 py-2 text-white text-sm rounded-xl transition-all duration-200"
              style={{
                background: '#0855B1',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 85, 177, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View contact info
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[80%] text-white rounded-2xl px-4 py-2"
        style={{
          background: '#0855B1',
        }}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,50,255,0.10))',
          color: '#0855B1',
        }}
      >
        MB+
      </div>
      <div className="flex items-center gap-1 px-3 py-2">
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
