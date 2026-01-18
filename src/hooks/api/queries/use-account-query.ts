/**
 * Account Query Hook
 * 
 * TanStack Query hook for fetching account data.
 * Follows Single Responsibility Principle: only handles account query.
 */

import { useQuery } from '@tanstack/react-query';
import { accountRepository } from '@/lib/api/repositories/account-repository';
import { accountQueryKeys } from './use-account-query-key';
import type { Account } from '@/types/payment';

interface UseAccountQueryParams {
  restaurant: string;
  location: string;
  table: number;
  enabled?: boolean;
}

/**
 * Hook to fetch account data for a table
 * 
 * @param params - Query parameters
 * @returns TanStack Query result with account data
 * 
 * @example
 * ```tsx
 * const { data: account, isLoading, error } = useAccountQuery({
 *   restaurant: 'demo',
 *   location: 'principal',
 *   table: 1,
 * });
 * ```
 */
export function useAccountQuery({
  restaurant,
  location,
  table,
  enabled = true,
}: UseAccountQueryParams) {
  return useQuery<Account>({
    queryKey: accountQueryKeys.detail(restaurant, location, table),
    queryFn: () =>
      accountRepository.getAccount({ restaurant, location, table }),
    enabled,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 1, // Retry once on failure
  });
}
