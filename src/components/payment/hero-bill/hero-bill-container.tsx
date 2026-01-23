'use client';

import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useAccountQuery } from '@/hooks/api/queries/use-account-query';
import { HeroBillView } from './hero-bill-view';
import type { OrderItem } from '@/types/payment';

interface HeroBillContainerProps {
  restaurant: string;
  location: string;
  table: number;
  onPay?: () => void;
  onSplit?: () => void;
}

export function HeroBillContainer({
  restaurant,
  location,
  table,
  onPay,
  onSplit,
}: HeroBillContainerProps) {
  // Fetch account data
  const { data, isLoading, error } = useAccountQuery({
    restaurant,
    location,
    table,
  });

  // Map backend items to Hero component format
  const heroItems = useMemo(() => {
    if (!data?.account?.items) return [];
    
    return data.account.items.map((item: OrderItem) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.unit_price,
    }));
  }, [data?.account?.items]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="size-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Error state
  if (error || !data || !data.account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold dark:text-white">Error</h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {error ? "No se pudo cargar la cuenta." : "No hay cuenta activa para esta mesa."}
          </p>
        </div>
      </div>
    );
  }

  const { account, restaurant_name, location_name } = data;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <HeroBillView
        restaurantName={restaurant_name}
        establishmentYear="2024" // TODO: Add to Restaurant model
        address={`${location_name}`} // TODO: Add to Location model
        phone="" // TODO: Add to Location model
        tableNumber={table}
        serverName="Server" // TODO: Add to Account model
        date={new Date(account.created_at).toLocaleDateString()}
        orderNumber={account.id.split('-')[0].toUpperCase()}
        items={heroItems}
        subtotal={account.subtotal}
        tax={account.tax}
        total={account.total}
        onPay={onPay}
        onSplit={onSplit}
      />
    </div>
  );
}
