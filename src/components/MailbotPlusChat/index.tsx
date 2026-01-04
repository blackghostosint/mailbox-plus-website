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
    onAnalyticsEvent?: (eventName: string, payload: Record<string, any>) => void;
    onSubmitQuestion?: (question: string) => Promise<ChatbotResponse>;
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

const REFUSAL_TEXT = "I don't have that information, but our team can help. You can stop by the store or contact us directly.";

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

    // Show launcher when conditions met
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
    }, [isExpanded]);

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
                });
            } else {
                onAnalyticsEvent?.('refusal_served', { query: trimmedInput });
            }
        } catch (error) {
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

    // Don't render if suppressed
    if (isSuppressed) return null;

    // Don't render launcher if hasn't appeared yet
    if (!hasAppeared) return null;

    return (
        <div className={className}>
            {/* FLOATING LAUNCHER */}
            {!isExpanded && (
                <button
                    ref={launcherRef}
                    onClick={handleOpen}
                    aria-label="Open Mail-bot Plus chat assistant"
                    className={`fixed bottom-6 right-6 ${isMobile ? 'w-14 h-14' : 'w-15 h-15'
                        } rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-white font-semibold text-sm ${launcherClassName}`}
                >
                    MB+
                </button>
            )}

            {/* CHAT PANEL */}
            {isExpanded && (
                <div
                    role="dialog"
                    aria-labelledby="chatbot-header"
                    aria-modal="false"
                    className={`fixed bg-white shadow-2xl ${isMobile
                            ? 'bottom-0 left-0 right-0 rounded-t-xl'
                            : 'bottom-6 right-6 rounded-lg w-96'
                        } flex flex-col`}
                    style={{ height: isMobile ? '80vh' : '600px' }}
                >
                    {/* HEADER */}
                    <div className={`flex items-center justify-between px-4 border-b ${isMobile ? 'h-13' : 'h-14'}`}>
                        <h2 id="chatbot-header" className="font-semibold text-gray-900">
                            Mail-bot Plus
                        </h2>
                        <button
                            onClick={() => handleClose('close_button')}
                            aria-label="Close chat"
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    <div className={`border-t p-3 ${isMobile ? 'pb-4' : ''}`}>
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
                                className="flex-1 resize-none border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                inputMode="text"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!inputValue.trim() || isAwaitingResponse}
                                aria-label="Send question"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    onLinkClick: (sourceUrl: string, faqId: string) => void;
    onCTAClick: (ctaType: 'contact' | 'visit') => void;
}) {
    const isRefusal = message.content === REFUSAL_TEXT;

    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 text-xs font-bold">
                MB+
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.sourceUrl && message.faqId && (
                    <a
                        href={message.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onLinkClick(message.sourceUrl!, message.faqId!)}
                        className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline"
                    >
                        Learn more →
                    </a>
                )}
                {isRefusal && (
                    <div className="mt-3">
                        <a
                            href="/contact"
                            onClick={() => onCTAClick('contact')}
                            className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
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
            <div className="max-w-[80%] bg-blue-600 text-white rounded-lg px-4 py-2">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 text-xs font-bold">
                MB+
            </div>
            <div className="flex items-center gap-1 px-3 py-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}
