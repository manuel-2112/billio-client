/**
 * Checkout Mutation Hook
 * 
 * TanStack Query mutation for initializing checkout.
 * Follows Single Responsibility Principle: only handles checkout initialization.
 */

import { useMutation } from '@tanstack/react-query';
import { checkoutRepository } from '@/lib/api/repositories/checkout-repository';
import type { CheckoutRequest, CheckoutResponse } from '@/types/payment';

interface UseCheckoutMutationParams {
  accountId: string;
}

/**
 * Hook to initialize checkout and create Klap order
 * 
 * @example
 * ```tsx
 * const { mutate: checkout, isPending, data } = useCheckoutMutation({ accountId });
 * 
 * checkout({ tipPercentage: 15 });
 * ```
 */
export function useCheckoutMutation({ accountId }: UseCheckoutMutationParams) {
  return useMutation({
    mutationFn: (request: CheckoutRequest): Promise<CheckoutResponse> =>
      checkoutRepository.createCheckout(accountId, request),
    // Don't retry checkout - user action should fail fast
    retry: false,
  });
}
