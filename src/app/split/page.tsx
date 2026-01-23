"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ItemSelectorContainer, type SplitItem } from "@/components/payment/item-selector";

// Demo data - In production, this would come from the API via TanStack Query
const demoItems: SplitItem[] = [
  { id: "1", text: "Grilled Salmon", completed: false, quantity: 2, price: 28.99 },
  { id: "2", text: "Caesar Salad", completed: false, quantity: 1, price: 12.50 },
  { id: "3", text: "Truffle Fries", completed: false, quantity: 1, price: 9.99 },
  { id: "4", text: "Sparkling Water", completed: false, quantity: 2, price: 4.50 },
  { id: "5", text: "Tiramisu", completed: false, quantity: 2, price: 11.00 },
];

export default function SplitPage() {
  const handlePayNow = (selectedItems: SplitItem[], total: number) => {
    console.log("Pay for items:", selectedItems);
    console.log("Total:", total);
    // TODO: Navigate to checkout or integrate with payment flow
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-32 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-lg items-center gap-4 px-4 py-4">
          <Link
            href="/"
            className="-ml-2 rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="size-5 text-zinc-600 dark:text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Split the Bill
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Order #4821 - Table 12
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Restaurant Info */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="size-6 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]" />
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              The Golden Fork
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Jan 22, 2026 - Server: Maria S.
          </p>
        </div>

        {/* Instructions */}
        <p className="mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Select the items you want to pay for
        </p>

        {/* Items List */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <ItemSelectorContainer
            initialItems={demoItems}
            taxRate={0.085}
            onPayNow={handlePayNow}
          />
        </div>
      </main>
    </div>
  );
}
