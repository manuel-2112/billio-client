/**
 * Order Item Card Component
 * 
 * Presentational component for displaying a single order item.
 * Follows Single Responsibility Principle: only renders item UI.
 * Follows Dependency Inversion: depends on props interface, not implementation.
 */

import Image from 'next/image';
import { Utensils } from 'lucide-react';
import { Card } from '@/registry/new-york-v4/ui/card';
import { formatCLP } from '@/lib/utils/currency';
import type { OrderItem } from '@/types/payment';

interface OrderItemCardProps {
  /**
   * Order item data
   */
  item: OrderItem;
}

/**
 * OrderItemCard component
 * 
 * Displays a single order item with image, name, quantity, and price.
 * 
 * @example
 * ```tsx
 * <OrderItemCard item={orderItem} />
 * ```
 */
export function OrderItemCard({ item }: OrderItemCardProps) {
  return (
    <Card className="flex items-start gap-3 p-3">
      {/* Item Image */}
      {item.image_url ? (
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      ) : (
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-muted">
          <Utensils className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium leading-tight">{item.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{item.quantity}x</span>
          <span>·</span>
          <span>{formatCLP(item.unit_price)}</span>
        </div>
      </div>

      {/* Item Total */}
      <div className="text-right">
        <p className="font-semibold">{formatCLP(item.total_price)}</p>
      </div>
    </Card>
  );
}
