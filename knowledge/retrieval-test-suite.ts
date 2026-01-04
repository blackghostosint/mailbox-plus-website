/**
 * Retrieval Test Suite for Mailbox Plus Chatbot
 * 
 * This file defines the authoritative test cases for validating retrieval behavior.
 * Tests are organized into 5 categories based on expected behavior.
 * 
 * Exit Criteria: ALL tests must pass before UI rollout.
 */

export type TestResult = 'ACCEPT' | 'REFUSE';

export interface TestCase {
    id: string;
    category: 'direct_match' | 'paraphrase' | 'ambiguous' | 'operational' | 'out_of_scope';
    query: string;
    expectedResult: TestResult;
    expectedFaqId?: string; // Only for ACCEPT cases
    notes?: string;
}

/**
 * Fallback Response (used for all REFUSE cases)
 */
export const FALLBACK_RESPONSE = "I don't have that information. Please contact the store directly or visit us in person.";

/**
 * Minimum Similarity Threshold
 * Must match the value in kb.entries.json
 */
export const MINIMUM_SIMILARITY = 0.78;

/**
 * Test Suite: All test cases organized by category
 */
export const retrievalTests: TestCase[] = [
    // ========================================
    // A. DIRECT MATCH TESTS (should answer)
    // ========================================
    {
        id: 'direct-01',
        category: 'direct_match',
        query: 'Which carriers do you work with?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-carriers',
        notes: 'Exact match from questionVariants'
    },
    {
        id: 'direct-02',
        category: 'direct_match',
        query: 'Will I receive tracking information?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-tracking',
        notes: 'Exact match from questionVariants'
    },
    {
        id: 'direct-03',
        category: 'direct_match',
        query: 'Do you offer shipping insurance?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-insurance',
        notes: 'Exact match from questionVariants'
    },
    {
        id: 'direct-04',
        category: 'direct_match',
        query: 'Can you ship internationally?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-international',
        notes: 'Exact match from questionVariants'
    },
    {
        id: 'direct-05',
        category: 'direct_match',
        query: 'Can you pack fragile items?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-fragile-items',
        notes: 'Exact match from questionVariants'
    },
    {
        id: 'direct-06',
        category: 'direct_match',
        query: 'Do you accept Amazon returns?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-returns',
        notes: 'Exact match from questionVariants'
    },

    // ========================================
    // B. PARAPHRASE TESTS (should still answer)
    // ========================================
    {
        id: 'paraphrase-01',
        category: 'paraphrase',
        query: 'What shipping companies can I choose from?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-carriers',
        notes: 'Same intent as "Which carriers do you work with?"'
    },
    {
        id: 'paraphrase-02',
        category: 'paraphrase',
        query: 'Will you give me a tracking number?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-tracking',
        notes: 'Same intent as "Will I receive tracking information?"'
    },
    {
        id: 'paraphrase-03',
        category: 'paraphrase',
        query: 'Can you send packages to other countries?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-international',
        notes: 'Same intent as "Can you ship internationally?"'
    },
    {
        id: 'paraphrase-04',
        category: 'paraphrase',
        query: 'Do you handle delicate or breakable items?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-fragile-items',
        notes: 'Same intent as "Can you pack fragile items?"'
    },
    {
        id: 'paraphrase-05',
        category: 'paraphrase',
        query: 'Can I return Amazon purchases at your location?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-returns',
        notes: 'Same intent as "Do you accept Amazon returns?"'
    },
    {
        id: 'paraphrase-06',
        category: 'paraphrase',
        query: 'How much time does delivery usually take?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-delivery-time',
        notes: 'Same intent as "How long will shipping take?"'
    },
    {
        id: 'paraphrase-07',
        category: 'paraphrase',
        query: 'Do you offer Private Mailbox (PMB) services?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-mailboxes',
        notes: 'Search for private mailbox / PMB'
    },
    {
        id: 'paraphrase-08',
        category: 'paraphrase',
        query: 'Can I rent a PMB there?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-shipping-mailboxes',
        notes: 'Search for PMB'
    },
    {
        id: 'paraphrase-09',
        category: 'paraphrase',
        query: 'What is a P.O. Box alternative?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-mailbox-rental-vs-po-box',
        notes: 'Search for P.O. Box alternative'
    },
    {
        id: 'paraphrase-10',
        category: 'paraphrase',
        query: 'Can I use a Private Mailbox for my business?',
        expectedResult: 'ACCEPT',
        expectedFaqId: 'faq-business-mailbox-address',
        notes: 'Search for business use of private mailbox'
    },

    // ========================================
    // C. AMBIGUOUS TESTS (must refuse)
    // ========================================
    {
        id: 'ambiguous-01',
        category: 'ambiguous',
        query: 'What business services do you offer?',
        expectedResult: 'REFUSE',
        notes: 'Spans multiple FAQs - too broad to answer safely'
    },
    {
        id: 'ambiguous-02',
        category: 'ambiguous',
        query: 'What can you help me with?',
        expectedResult: 'REFUSE',
        notes: 'Extremely broad - would require listing multiple services'
    },
    {
        id: 'ambiguous-03',
        category: 'ambiguous',
        query: 'What services does Mailbox Plus provide?',
        expectedResult: 'REFUSE',
        notes: 'Covers entire service catalog - ambiguous intent'
    },

    // ========================================
    // D. OPERATIONAL TESTS (must refuse)
    // ========================================
    {
        id: 'operational-01',
        category: 'operational',
        query: 'Where is my package?',
        expectedResult: 'REFUSE',
        notes: 'Requires real-time tracking data - operational query'
    },
    {
        id: 'operational-02',
        category: 'operational',
        query: 'Can you track my shipment right now?',
        expectedResult: 'REFUSE',
        notes: 'Real-time status request - cannot be answered from FAQ'
    },
    {
        id: 'operational-03',
        category: 'operational',
        query: 'Is my mailbox available?',
        expectedResult: 'REFUSE',
        notes: 'Account-specific operational query'
    },
    {
        id: 'operational-04',
        category: 'operational',
        query: 'Can you guarantee my package will arrive tomorrow?',
        expectedResult: 'REFUSE',
        notes: 'Operational promise - FAQ cannot make guarantees'
    },
    {
        id: 'operational-05',
        category: 'operational',
        query: 'Can you notarize this document for me today?',
        expectedResult: 'REFUSE',
        notes: 'Real-time availability question - operational'
    },

    // ========================================
    // E. OUT-OF-SCOPE TESTS (must refuse)
    // ========================================
    {
        id: 'out_of_scope-01',
        category: 'out_of_scope',
        query: 'What are your prices?',
        expectedResult: 'REFUSE',
        notes: 'Pricing not in FAQ scope'
    },
    {
        id: 'out_of_scope-02',
        category: 'out_of_scope',
        query: 'Are you cheaper than UPS Store?',
        expectedResult: 'REFUSE',
        notes: 'Comparative pricing - out of scope'
    },
    {
        id: 'out_of_scope-03',
        category: 'out_of_scope',
        query: 'Should I ship FedEx or UPS?',
        expectedResult: 'REFUSE',
        notes: 'Advice/recommendation - out of scope'
    },
    {
        id: 'out_of_scope-04',
        category: 'out_of_scope',
        query: 'Is this legal in Ohio?',
        expectedResult: 'REFUSE',
        notes: 'Legal advice - completely out of scope'
    },
];

/**
 * Test Statistics
 */
export const getTestStats = () => {
    const total = retrievalTests.length;
    const byCategory = retrievalTests.reduce((acc, test) => {
        acc[test.category] = (acc[test.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const shouldAccept = retrievalTests.filter(t => t.expectedResult === 'ACCEPT').length;
    const shouldRefuse = retrievalTests.filter(t => t.expectedResult === 'REFUSE').length;

    return {
        total,
        byCategory,
        shouldAccept,
        shouldRefuse
    };
};
