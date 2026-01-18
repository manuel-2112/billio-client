/**
 * Account Repository
 * 
 * Repository pattern implementation for Account domain.
 * Abstracts data access, follows Single Responsibility Principle.
 * 
 * This repository handles all account-related API calls.
 */

import { apiClient } from '../base/api-client';
import type { Account, TipUpdate } from '@/types/payment';
import type { GetAccountResponse, UpdateTipResponse } from '@/types/api';

/**
 * Account Repository class
 * 
 * Encapsulates all account-related API operations.
 * Makes it easy to test and swap implementations.
 */
export class AccountRepository {
  /**
   * Get active account for a table
   */
  async getAccount(params: {
    restaurant: string;
    location: string;
    table: number;
  }): Promise<Account> {
    return apiClient.get<GetAccountResponse>(
      `/${params.restaurant}/${params.location}/${params.table}`
    );
  }

  /**
   * Update tip for an account
   */
  async updateTip(
    accountId: string,
    tip: TipUpdate
  ): Promise<Account> {
    return apiClient.patch<UpdateTipResponse>(
      `/accounts/${accountId}/tip`,
      tip
    );
  }
}

/**
 * Singleton instance of AccountRepository
 * 
 * Single instance ensures consistent behavior across the app.
 */
export const accountRepository = new AccountRepository();
