"use client";

import { use, useMemo } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { PageHeader } from "@/components/design-system/layout";
import { ItemSelectorContainer, type SplitItem } from "@/components/payment/item-selector";
import { useAccountQuery } from "@/hooks/api/queries/use-account-query";
import type { Account, OrderItem } from "@/types/payment";

interface SplitPageProps {
  params: Promise<{
    restaurant: string;
    location: string;
    table: string;
  }>;
}

export default function SplitPage({ params }: SplitPageProps) {
  const router = useRouter();
  // Unwrap params using React.use()
  const { restaurant, location, table } = use(params);
  const tableNumber = parseInt(table, 10);

  // Validate table number
  if (isNaN(tableNumber)) {
    notFound();
  }

  // Fetch account data
  const { data, isLoading, error } = useAccountQuery({
    restaurant,
    location,
    table: tableNumber,
  });

  // Map account items to SplitItems
  const splitItems = useMemo<SplitItem[]>(() => {
    if (!data?.account?.items) return [];

    return data.account.items.map((item: OrderItem) => ({
      id: item.id,
      text: item.name,
      completed: false, // Start unselected
      quantity: item.quantity,
      price: item.unit_price,
    }));
  }, [data?.account?.items]);

  const handlePayNow = (selectedItems: SplitItem[], total: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set('view', 'tip');
    searchParams.set('amount', total.toString());
    router.push(`/${restaurant}/${location}/${table}?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="size-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (error || !data || !data.account) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-4 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Error loading order
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {error ? "Could not load the account." : "No active account found for this table."}
          </p>
        </div>
        <Link
          href={`/${restaurant}/${location}/${table}`}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Go Back
        </Link>
      </div>
    );
  }

  const { account: accountData, restaurant_name } = data;

  return (
    <div className="min-h-screen bg-zinc-50 pb-32 dark:bg-zinc-950">
      {/* Header */}
      {/* Header */}
      <PageHeader
        title="Split the Bill"
        subtitle={`Table ${table}`}
        backHref={`/${restaurant}/${location}/${table}`}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Restaurant Info */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="size-6 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]" />
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              {restaurant_name}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(accountData.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Instructions */}
        <p className="mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Select the items you want to pay for
        </p>

        {/* Items List */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <ItemSelectorContainer
            initialItems={splitItems}
            taxRate={accountData.subtotal > 0 ? accountData.tax / accountData.subtotal : 0.19}
            onPayNow={handlePayNow}
          />
        </div>
      </main>
    </div>
  );
}
