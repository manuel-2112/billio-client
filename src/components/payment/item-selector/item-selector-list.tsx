"use client";

import { AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ItemSelectorRow, type SplitItem } from "./item-selector-row";

interface ItemSelectorListProps {
  items: SplitItem[];
  onToggle: (id: string) => void;
  className?: string;
}

/**
 * ItemSelectorList - Presentational list of selectable items
 *
 * Renders a list of ItemSelectorRow components with layout animations.
 * For Split page to allow users to select which items they want to pay for.
 */
export function ItemSelectorList({
  items,
  onToggle,
  className,
}: ItemSelectorListProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <ItemSelectorRow key={item.id} item={item} onToggle={onToggle} />
        ))}
      </AnimatePresence>
    </div>
  );
}
