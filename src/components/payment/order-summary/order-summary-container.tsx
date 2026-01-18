/**
 * Order Summary Container Component
 * 
 * Container component that orchestrates order summary logic.
 * Follows Single Responsibility Principle: only handles data fetching and orchestration.
 * Follows Container/Presentational Pattern: separates logic from UI.
 */

'use client';

import { useAccountQuery } from '@/hooks/api/queries/use-account-query';
import { OrderSummaryView } from './order-summary-view';
import { OrderSummarySkeleton } from './order-summary-skeleton';
import { ErrorState } from '@/components/design-system/error-state';

interface OrderSummaryContainerProps {
  /**
   * Restaurant slug
   */
  restaurant: string;
  /**
   * Location slug
   */
  location: string;
  /**
   * Table number
   */
  table: number;
  /**
   * Callback when user wants to add tip
   */
  onAddTip?: () => void;
  /**
   * Whether to enable the query (for conditional fetching)
   */
  enabled?: boolean;
}

/**
 * OrderSummaryContainer component
 * 
 * Fetches account data and renders OrderSummaryView.
 * Handles loading and error states.
 * 
 * @example
 * ```tsx
 * <OrderSummaryContainer
 *   restaurant="demo"
 *   location="principal"
 *   table={1}
 *   onAddTip={() => setView('tip')}
 * />
 * ```
 */
export function OrderSummaryContainer({
  restaurant,
  location,
  table,
  onAddTip,
  enabled = true,
}: OrderSummaryContainerProps) {
  const { data: account, isLoading, error, refetch } = useAccountQuery({
    restaurant,
    location,
    table,
    enabled,
  });

  // Loading state
  if (isLoading) {
    return <OrderSummarySkeleton />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        message={error.message || 'Error al cargar la cuenta'}
        onRetry={() => refetch()}
      />
    );
  }

  // No account found
  if (!account) {
    return (
      <ErrorState
        title="Sin cuenta activa"
        message="No hay cuenta abierta para esta mesa"
        onRetry={() => refetch()}
      />
    );
  }

  // Success: render view
  return (
    <OrderSummaryView
      items={account.items}
      subtotal={account.subtotal}
      tax={account.tax}
      total={account.total}
      onAddTip={onAddTip}
    />
  );
}
