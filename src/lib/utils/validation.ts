/**
 * Validation Utilities
 * 
 * Pure functions for validation.
 * Follows Single Responsibility Principle: only handles validation logic.
 */

/**
 * Minimum payment amount in CLP
 */
export const MIN_PAYMENT_AMOUNT = 1000;

/**
 * IVA (tax) percentage
 */
export const IVA_PERCENTAGE = 19;

/**
 * Validate payment amount
 * 
 * @param amount - Amount to validate
 * @returns true if amount is valid (>= minimum)
 */
export function isValidPaymentAmount(amount: number): boolean {
  return amount >= MIN_PAYMENT_AMOUNT;
}

/**
 * Validate tip amount
 * 
 * @param tip - Tip amount to validate
 * @returns true if tip is valid (>= 0)
 */
export function isValidTip(tip: number): boolean {
  return tip >= 0;
}

/**
 * Calculate tax (IVA) from subtotal
 * 
 * @param subtotal - Subtotal amount
 * @returns Tax amount (19% of subtotal, rounded)
 */
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * (IVA_PERCENTAGE / 100));
}

/**
 * Calculate tip from percentage
 * 
 * @param subtotal - Subtotal amount
 * @param percentage - Tip percentage (0-100)
 * @returns Tip amount (rounded)
 */
export function calculateTipFromPercentage(
  subtotal: number,
  percentage: number
): number {
  return Math.round((subtotal * percentage) / 100);
}
