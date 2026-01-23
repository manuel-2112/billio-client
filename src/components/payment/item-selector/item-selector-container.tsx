"use client";

import { useState, useMemo } from "react";
import { ItemSelectorList } from "./item-selector-list";
import { type SplitItem } from "./item-selector-row";
import { FloatingPaymentPanel } from "@/components/payment/checkout/floating-payment-panel";

interface ItemSelectorContainerProps {
  /** Initial items from the order */
  initialItems: SplitItem[];
  /** Tax rate as decimal (e.g., 0.085 for 8.5%) */
  taxRate?: number;
  /** Callback when user confirms payment */
  onPayNow?: (selectedItems: SplitItem[], total: number) => void;
}

/**
 * ItemSelectorContainer - Container component for Split page item selection
 *
 * Manages state for selected items and calculates totals.
 * Follows Container/Presentational pattern - handles logic, delegates UI to child components.
 */
export function ItemSelectorContainer({
  initialItems,
  taxRate = 0.085,
  onPayNow,
}: ItemSelectorContainerProps) {
  const [items, setItems] = useState<SplitItem[]>(initialItems);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const selectedItems = useMemo(
    () => items.filter((item) => item.completed),
    [items]
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const selectedSubtotal = selectedItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const tax = subtotal * taxRate;
    const selectedTax = selectedSubtotal * taxRate;

    return {
      subtotal,
      tax,
      total: subtotal + tax,
      selectedSubtotal,
      selectedTax,
      selectedTotal: selectedSubtotal + selectedTax,
      selectedCount: selectedItems.length,
    };
  }, [items, selectedItems, taxRate]);

  const handlePayNow = () => {
    onPayNow?.(selectedItems, totals.selectedTotal);
  };

  return (
    <>
      <ItemSelectorList items={items} onToggle={toggleItem} />

      <FloatingPaymentPanel
        selectedCount={totals.selectedCount}
        subtotal={totals.selectedSubtotal}
        tax={totals.selectedTax}
        total={totals.selectedTotal}
        onPayNow={handlePayNow}
        label="Continuar"
      />
    </>
  );
}

export type { SplitItem };
