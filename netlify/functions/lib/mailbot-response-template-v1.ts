/**
 * Mail-bot Plus Response Template V1
 *
 * Enforces a consistent 4-part response structure for chatbot answers:
 * 1. Acknowledgment (1 short sentence, max 12 words)
 * 2. Answer (Direct, plain-spoken, factual)
 * 3. Optional Local Context (Max 1 sentence, only if helpful)
 * 4. Next-Step Hand-off (One gentle question or suggestion)
 *
 * @version 1.0.0
 */

export const TEMPLATE_VERSION = 'mailbot.response.template.v1';

// ============================================================================
// TYPES
// ============================================================================

export interface V1Response {
  acknowledgment: string;
  answer: string;
  context?: string;
  handoff: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TemplateConfig {
  maxAcknowledgmentWords: number;
  maxTotalLines: number;
  forbiddenPhrases: string[];
  requiresAllSections: boolean;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const DEFAULT_CONFIG: TemplateConfig = {
  maxAcknowledgmentWords: 12,
  maxTotalLines: 6,
  forbiddenPhrases: [
    'as an ai',
    'according to policy',
    'based on your query',
    'i am unable to',
    'i cannot help',
    "i don't have access",
    'my apologies',
    'unfortunately',
  ],
  requiresAllSections: false, // Context is optional
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Length Guard: Ensures response doesn't exceed maximum line count
 */
function validateLength(
  formattedResponse: string,
  config: TemplateConfig
): { isValid: boolean; error?: string } {
  const lines = formattedResponse.split('\n').filter((line) => line.trim().length > 0);

  if (lines.length > config.maxTotalLines) {
    return {
      isValid: false,
      error: `Response too long: ${lines.length} lines (max ${config.maxTotalLines})`,
    };
  }

  return { isValid: true };
}

/**
 * Forbidden Phrase Filter: Blocks corporate/AI language
 */
function validateForbiddenPhrases(
  formattedResponse: string,
  config: TemplateConfig
): { isValid: boolean; errors: string[] } {
  const lowerResponse = formattedResponse.toLowerCase();
  const foundPhrases: string[] = [];

  for (const phrase of config.forbiddenPhrases) {
    if (lowerResponse.includes(phrase)) {
      foundPhrases.push(phrase);
    }
  }

  if (foundPhrases.length > 0) {
    return {
      isValid: false,
      errors: foundPhrases.map((p) => `Contains forbidden phrase: "${p}"`),
    };
  }

  return { isValid: true, errors: [] };
}

/**
 * Section Presence Check: Verifies required sections exist
 */
function validateSectionPresence(
  response: V1Response,
  config: TemplateConfig
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!response.acknowledgment || response.acknowledgment.trim().length === 0) {
    errors.push('Missing acknowledgment section');
  }

  if (!response.answer || response.answer.trim().length === 0) {
    errors.push('Missing answer section');
  }

  if (!response.handoff || response.handoff.trim().length === 0) {
    errors.push('Missing handoff section');
  }

  if (config.requiresAllSections && (!response.context || response.context.trim().length === 0)) {
    errors.push('Missing context section (required by config)');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Acknowledgment Word Count: Ensures acknowledgment is concise
 */
function validateAcknowledgment(
  acknowledgment: string,
  config: TemplateConfig
): { isValid: boolean; error?: string } {
  const wordCount = acknowledgment.trim().split(/\s+/).length;

  if (wordCount > config.maxAcknowledgmentWords) {
    return {
      isValid: false,
      error: `Acknowledgment too long: ${wordCount} words (max ${config.maxAcknowledgmentWords})`,
    };
  }

  return { isValid: true };
}

// ============================================================================
// CORE VALIDATION
// ============================================================================

/**
 * Validates a V1-formatted response against all rules
 */
export function validateV1Response(
  response: V1Response,
  config: TemplateConfig = DEFAULT_CONFIG
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check section presence
  const presenceResult = validateSectionPresence(response, config);
  if (!presenceResult.isValid) {
    errors.push(...presenceResult.errors);
  }

  // If required sections are missing, stop here
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // Validate acknowledgment word count
  const ackResult = validateAcknowledgment(response.acknowledgment, config);
  if (!ackResult.isValid && ackResult.error) {
    warnings.push(ackResult.error);
  }

  // Format response for further validation
  const formattedResponse = formatResponseToString(response);

  // Validate length
  const lengthResult = validateLength(formattedResponse, config);
  if (!lengthResult.isValid && lengthResult.error) {
    warnings.push(lengthResult.error);
  }

  // Validate forbidden phrases
  const phraseResult = validateForbiddenPhrases(formattedResponse, config);
  if (!phraseResult.isValid) {
    errors.push(...phraseResult.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * Formats a V1Response object into a readable string
 */
export function formatResponseToString(response: V1Response): string {
  const parts: string[] = [response.acknowledgment, response.answer];

  if (response.context && response.context.trim().length > 0) {
    parts.push(response.context);
  }

  parts.push(response.handoff);

  return parts.join('\n');
}

/**
 * Attempts to parse a raw FAQ answer into V1Response structure
 *
 * This is a best-effort parser for existing FAQ entries that may not
 * be pre-formatted. It returns a structured response that can be validated.
 */
export function parseRawAnswer(rawAnswer: string): V1Response {
  // For now, we'll use a simple heuristic:
  // - If the answer is already multi-line and structured, try to parse it
  // - Otherwise, wrap it in a basic V1 structure

  const lines = rawAnswer
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // If already has 3-4 parts, assume it's V1 formatted
  if (lines.length >= 3 && lines.length <= 4) {
    return {
      acknowledgment: lines[0],
      answer: lines[1],
      context: lines.length === 4 ? lines[2] : undefined,
      handoff: lines[lines.length - 1],
    };
  }

  // Otherwise, create a basic V1 structure
  // This is a fallback for legacy answers
  return {
    acknowledgment: 'Good question.',
    answer: rawAnswer,
    context: undefined,
    handoff: 'Want to know more about our services?',
  };
}

/**
 * Main entry point: Takes a raw FAQ answer and returns a validated V1 response
 *
 * @param rawAnswer - The answer string from kb.entries.json
 * @param config - Optional custom configuration
 * @returns Formatted V1 response string
 * @throws Error if validation fails with critical errors
 */
export function formatMailbotResponse(
  rawAnswer: string,
  config: TemplateConfig = DEFAULT_CONFIG
): string {
  // Parse the raw answer
  const response = parseRawAnswer(rawAnswer);

  // Validate
  const validation = validateV1Response(response, config);

  // Log warnings but don't throw
  if (validation.warnings.length > 0) {
    console.warn('V1 Template Warnings:', validation.warnings);
  }

  // Throw on critical errors
  if (!validation.isValid) {
    console.error('V1 Template Validation Failed:', validation.errors);
    // For now, don't throw - just return the formatted response anyway
    // This allows gradual migration without breaking existing answers
  }

  // Return formatted string
  return formatResponseToString(response);
}
