/**
 * Order Summary Card Component
 * 
 * Presentational component for displaying order totals.
 * Follows Single Responsibility Principle: only renders summary UI.
 */

import { Card } from '@/registry/new-york-v4/ui/card';
import { formatCLP } from '@/lib/utils/currency';

interface OrderSummaryCardProps {
  /**
   * Subtotal amount
   */
  subtotal: number;
  /**
   * Tax (IVA) amount
   */
  tax: number;
  /**
   * Tip amount
   */
  tip: number;
  /**
   * Total amount
   */
  total: number;
}

/**
 * OrderSummaryCard component
 * 
 * Displays breakdown of order totals: subtotal, tax, tip, and total.
 * 
 * @example
 * ```tsx
 * <OrderSummaryCard
 *   subtotal={27500}
 *   tax={5225}
 *   tip={4125}
 *   total={36850}
 * />
 * ```
 */
export function OrderSummaryCard({
  subtotal,
  tax,
  tip,
  total,
}: OrderSummaryCardProps) {
  return (
    <Card className="space-y-3 p-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCLP(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">IVA (19%)</span>
          <span>{formatCLP(tax)}</span>
        </div>
        {tip > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Propina</span>
            <span>{formatCLP(tip)}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between">
          <span className="text-base font-semibold">Total a pagar</span>
          <span className="text-2xl font-bold">{formatCLP(total)}</span>
        </div>
      </div>
    </Card>
  );
}
