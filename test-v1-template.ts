/**
 * Manual test script for V1 Response Template
 * 
 * This script tests the template formatter with sample FAQ answers
 * to verify all validation guardrails work correctly.
 */

import {
    formatMailbotResponse,
    parseRawAnswer,
    validateV1Response,
    formatResponseToString,
    DEFAULT_CONFIG,
    type V1Response
} from '../netlify/functions/lib/mailbot-response-template-v1';

console.log('='.repeat(80));
console.log('Mail-bot Plus V1 Response Template - Manual Test Suite');
console.log('='.repeat(80));
console.log();

// Test 1: Legacy raw answer (should get wrapped in V1 structure)
console.log('TEST 1: Legacy Raw Answer');
console.log('-'.repeat(80));
const legacyAnswer = "We're open Monday through Friday, 9 AM to 6 PM, and Saturday 10 AM to 3 PM. Closed Sundays.";
const formatted1 = formatMailbotResponse(legacyAnswer);
console.log('Input:', legacyAnswer);
console.log('Output:\n', formatted1);
console.log();

// Test 2: Pre-formatted V1 answer (4 lines)
console.log('TEST 2: Pre-formatted V1 Answer (4-line)');
console.log('-'.repeat(80));
const v1Answer = `Good question.
We're open Monday through Friday, 9 AM to 6 PM, and Saturday 10 AM to 3 PM.
A lot of customers stop by during lunch for quick pickups.
Need directions or want to schedule something?`;
const formatted2 = formatMailbotResponse(v1Answer);
console.log('Input:', v1Answer);
console.log('Output:\n', formatted2);
console.log();

// Test 3: Pre-formatted V1 answer (3 lines, no context)
console.log('TEST 3: Pre-formatted V1 Answer (3-line, no context)');
console.log('-'.repeat(80));
const v1AnswerNoContext = `Yep — we can help with that.
We offer private mailboxes with a real street address, not a PO Box.
Want to see pricing or available sizes?`;
const formatted3 = formatMailbotResponse(v1AnswerNoContext);
console.log('Input:', v1AnswerNoContext);
console.log('Output:\n', formatted3);
console.log();

// Test 4: Forbidden phrase test (should trigger error)
console.log('TEST 4: Forbidden Phrase Detection');
console.log('-'.repeat(80));
const forbiddenAnswer: V1Response = {
    acknowledgment: 'Good question.',
    answer: 'As an AI, I cannot provide that information according to policy.',
    handoff: 'Can I help with something else?'
};
const validation4 = validateV1Response(forbiddenAnswer);
console.log('Input:', forbiddenAnswer);
console.log('Validation Result:', validation4);
console.log();

// Test 5: Acknowledgment too long (should trigger warning)
console.log('TEST 5: Acknowledgment Word Count Validation');
console.log('-'.repeat(80));
const longAckAnswer: V1Response = {
    acknowledgment: 'That is a really great question and I appreciate you asking me about this important topic.',
    answer: 'We offer mailbox services.',
    handoff: 'Want to know more?'
};
const validation5 = validateV1Response(longAckAnswer);
console.log('Input:', longAckAnswer);
console.log('Validation Result:', validation5);
console.log();

// Test 6: Missing required sections (should trigger error)
console.log('TEST 6: Missing Required Sections');
console.log('-'.repeat(80));
const incompleteAnswer: V1Response = {
    acknowledgment: '',
    answer: 'We offer services.',
    handoff: ''
};
const validation6 = validateV1Response(incompleteAnswer);
console.log('Input:', incompleteAnswer);
console.log('Validation Result:', validation6);
console.log();

// Test 7: Valid V1 response (all checks pass)
console.log('TEST 7: Valid V1 Response (Gold Standard)');
console.log('-'.repeat(80));
const goldStandardAnswer: V1Response = {
    acknowledgment: 'Good question.',
    answer: 'Yes — we offer private mailboxes with a real street address, not a PO Box.',
    context: 'A lot of local business owners here use them for packages and official mail.',
    handoff: 'Want me to go over sizes and pricing?'
};
const validation7 = validateV1Response(goldStandardAnswer);
const formatted7 = formatResponseToString(goldStandardAnswer);
console.log('Input:', goldStandardAnswer);
console.log('Validation Result:', validation7);
console.log('Formatted Output:\n', formatted7);
console.log();

console.log('='.repeat(80));
console.log('Test Suite Complete');
console.log('='.repeat(80));
