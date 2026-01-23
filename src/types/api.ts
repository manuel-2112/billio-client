/**
 * API Response Types
 * 
 * Types para respuestas de la API.
 * Sigue Interface Segregation Principle: tipos específicos por endpoint.
 */

import type { Account, CheckoutResponse } from './payment';

import type { PublicAccountResponse } from './api-response';

/**
 * Get account response
 */
export type GetAccountResponse = PublicAccountResponse;

/**
 * Update tip response
 */
export type UpdateTipResponse = Account;

/**
 * Checkout response
 */
export type CheckoutResponseType = CheckoutResponse;
