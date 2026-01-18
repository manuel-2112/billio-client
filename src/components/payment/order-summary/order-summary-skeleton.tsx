/**
 * Order Summary Skeleton Component
 * 
 * Loading state for order summary.
 * Follows Single Responsibility Principle: only renders loading UI.
 */

import { Skeleton } from '@/registry/new-york-v4/ui/skeleton';
import { Card } from '@/registry/new-york-v4/ui/card';

/**
 * OrderSummarySkeleton component
 * 
 * Displays skeleton loading state for order summary.
 * 
 * @example
 * ```tsx
 * {isLoading && <OrderSummarySkeleton />}
 * ```
 */
export function OrderSummarySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Items skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex items-start gap-3 p-3">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16" />
          </Card>
        ))}
      </div>

      {/* Summary skeleton */}
      <Card className="space-y-3 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <div className="border-t pt-3">
          <Skeleton className="h-8 w-32" />
        </div>
      </Card>
    </div>
  );
}
