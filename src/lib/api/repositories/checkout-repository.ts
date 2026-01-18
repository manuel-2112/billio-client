/**
 * Checkout Repository
 * 
 * Repository pattern implementation for Checkout domain.
 * Abstracts data access, follows Single Responsibility Principle.
 */

import { apiClient } from '../base/api-client';
import type { CheckoutRequest, CheckoutResponse } from '@/types/payment';
import type { CheckoutResponseType } from '@/types/api';

/**
 * Checkout Repository class
 * 
 * Encapsulates all checkout-related API operations.
 */
export class CheckoutRepository {
  /**
   * Initialize checkout and create Klap order
   */
  async createCheckout(
    accountId: string,
    request: CheckoutRequest
  ): Promise<CheckoutResponse> {
    return apiClient.post<CheckoutResponseType>(
      `/accounts/${accountId}/checkout`,
      request
    );
  }
}

/**
 * Singleton instance of CheckoutRepository
 */
export const checkoutRepository = new CheckoutRepository();
