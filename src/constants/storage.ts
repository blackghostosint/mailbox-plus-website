/**
 * Central storage keys for Mailbox Plus
 * Using consistent naming for localStorage and URL parameters
 */

export const STORAGE_KEYS = {
  // Gating & Suppression
  PREMIER_SIGNUP_COMPLETED: 'premierSignupCompleted',
  LAST_SHOWN_TIMESTAMP: 'premierSignupPopupLastShown',
  PREMIER_MODAL_DISMISSED: 'premierSignupModalDismissed',
  PREMIER_MODAL_SHOWN_SESSION: 'premierSignupModalShownThisSession',

  // Loyalty Identifiers
  LOYALTY_CARD_ID: 'loyaltyCardId',
  PREMIER_MEMBER_ID: 'premierMemberId',
  QR_TOKEN: 'qrToken',
} as const;

export const URL_PARAMS = {
  SIGNUP_COMPLETED: 'signup_completed',
  PREMIER_SIGNUP_COMPLETED: 'premierSignupCompleted',
  LOYALTY_CARD_ID: 'loyaltyCardId',
  PREMIER_MEMBER_ID: 'premierMemberId',
  QR_TOKEN: 'qrToken',
} as const;
