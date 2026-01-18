/**
 * Tip Mutation Hook
 * 
 * TanStack Query mutation for updating tip with optimistic updates.
 * Follows Single Responsibility Principle: only handles tip updates.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountRepository } from '@/lib/api/repositories/account-repository';
import { accountQueryKeys } from '../queries/use-account-query-key';
import type { Account } from '@/types/payment';
import type { TipUpdate } from '@/types/payment';

interface UseTipMutationParams {
  accountId: string;
}

/**
 * Hook to update tip for an account
 * 
 * Includes optimistic updates for better UX.
 * Automatically rolls back on error.
 * 
 * @example
 * ```tsx
 * const { mutate: updateTip, isPending } = useTipMutation({ accountId });
 * 
 * updateTip({ tipPercentage: 15 });
 * ```
 */
export function useTipMutation({ accountId }: UseTipMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tip: TipUpdate) =>
      accountRepository.updateTip(accountId, tip),

    // Optimistic update: update UI immediately
    onMutate: async (newTip) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: accountQueryKeys.all,
      });

      // Snapshot previous values for rollback
      const previousAccounts = queryClient.getQueriesData<Account>({
        queryKey: accountQueryKeys.all,
      });

      // Optimistically update all matching accounts
      queryClient.setQueriesData<Account>(
        { queryKey: accountQueryKeys.all },
        (old) => {
          if (!old || old.id !== accountId) return old;

          // Calculate new tip
          const newTipAmount = newTip.tip_percentage
            ? Math.round((old.subtotal * newTip.tip_percentage) / 100)
            : newTip.tip_amount ?? 0;

          // Return updated account
          return {
            ...old,
            tip: newTipAmount,
            total: old.subtotal + old.tax + newTipAmount,
          };
        }
      );

      // Return context for rollback
      return { previousAccounts };
    },

    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousAccounts) {
        context.previousAccounts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Refetch after success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: accountQueryKeys.all,
      });
    },
  });
}
