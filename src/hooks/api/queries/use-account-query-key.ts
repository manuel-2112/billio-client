/**
 * Query Keys Factory
 * 
 * Centralized query keys for TanStack Query.
 * Follows Single Responsibility Principle: only manages query keys.
 * 
 * Benefits:
 * - Prevents typos
 * - Enables easy invalidation
 * - Type-safe keys
 */

/**
 * Account query keys factory
 * 
 * Provides type-safe query keys for account-related queries.
 */
export const accountQueryKeys = {
  /**
   * Base key for all account queries
   */
  all: ['account'] as const,

  /**
   * Key for a specific account
   */
  detail: (restaurant: string, location: string, table: number) =>
    [...accountQueryKeys.all, 'detail', restaurant, location, table] as const,

  /**
   * Key for account list (if needed in future)
   */
  lists: () => [...accountQueryKeys.all, 'list'] as const,
} as const;
