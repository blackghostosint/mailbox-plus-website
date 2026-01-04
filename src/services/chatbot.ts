type ChatbotAcceptResponse = {
    type: 'accept';
    answer: string;
    sourceUrl: string;
    faqId: string;
    confidence: number;
};

type ChatbotRefuseResponse = {
    type: 'refuse';
};

type ChatbotResponse = ChatbotAcceptResponse | ChatbotRefuseResponse;

export async function submitChatQuestion(question: string): Promise<ChatbotResponse> {
    try {
        const response = await fetch('/.netlify/functions/chat-retrieve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            return { type: 'refuse' };
        }

        const data = await response.json();
        console.log('[Chatbot API Response]', data);

        if (data?.type === 'accept' &&
            typeof data.answer === 'string' &&
            typeof data.sourceUrl === 'string' &&
            typeof data.faqId === 'string' &&
            typeof data.confidence === 'number') {
            return {
                type: 'accept',
                answer: data.answer,
                sourceUrl: data.sourceUrl,
                faqId: data.faqId,
                confidence: data.confidence,
            };
        }

        if (data?.type === 'refuse') {
            return { type: 'refuse' };
        }

        return { type: 'refuse' };
    } catch {
        return { type: 'refuse' };
    }
}
