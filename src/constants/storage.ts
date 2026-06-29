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

  // Plus Points Signup Modal
  PLUS_POINTS_SIGNUP_COMPLETED: 'plusPointsSignupCompleted',
  PLUS_POINTS_LAST_SHOWN: 'plusPointsPopupLastShown',
  PLUS_POINTS_MODAL_DISMISSED: 'plusPointsModalDismissed',
  PLUS_POINTS_MODAL_SHOWN_SESSION: 'plusPointsModalShownThisSession',

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
