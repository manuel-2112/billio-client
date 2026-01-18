/**
 * API Response Types
 * 
 * Types para respuestas de la API.
 * Sigue Interface Segregation Principle: tipos específicos por endpoint.
 */

import type { Account, CheckoutResponse } from './payment';

/**
 * Get account response
 */
export type GetAccountResponse = Account;

/**
 * Update tip response
 */
export type UpdateTipResponse = Account;

/**
 * Checkout response
 */
export type CheckoutResponseType = CheckoutResponse;
