/**
 * Order Summary View Component
 * 
 * Presentational component for order summary.
 * Follows Single Responsibility Principle: only renders UI.
 */

import { OrderItemCard, OrderSummaryCard } from './';
import { Button } from '@/registry/new-york-v4/ui/button';
import type { OrderItem } from '@/types/payment';

interface OrderSummaryViewProps {
  /**
   * Order items
   */
  items: OrderItem[];
  /**
   * Subtotal amount
   */
  subtotal: number;
  /**
   * Tax (IVA) amount
   */
  tax: number;
  /**
   * Total amount
   */
  total: number;
  /**
   * Callback when user wants to add tip
   */
  onAddTip?: () => void;
}

/**
 * OrderSummaryView component
 * 
 * Displays order items and summary.
 * 
 * @example
 * ```tsx
 * <OrderSummaryView
 *   items={account.items}
 *   subtotal={account.subtotal}
 *   tax={account.tax}
 *   total={account.total}
 *   onAddTip={() => setView('tip')}
 * />
 * ```
 */
export function OrderSummaryView({
  items,
  subtotal,
  tax,
  total,
  onAddTip,
}: OrderSummaryViewProps) {
  return (
    <div className="space-y-6">
      {/* Order Items */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Tu pedido</h2>
        {items.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No hay productos en la cuenta
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Order Summary */}
      <OrderSummaryCard
        subtotal={subtotal}
        tax={tax}
        tip={0} // Tip is shown separately in tip selector
        total={subtotal + tax}
      />

      {/* Add Tip Button */}
      {onAddTip && (
        <Button onClick={onAddTip} className="w-full" size="lg">
          Agregar propina
        </Button>
      )}
    </div>
  );
}
