"use client";

import { motion, AnimatePresence } from "motion/react";
import { formatCurrency } from "@/lib/utils";
import { CustomButton } from "@/components/design-system/ui/custom-button";

interface FloatingPaymentPanelProps {
  /** Number of selected items */
  selectedCount: number;
  /** Subtotal of selected items */
  subtotal: number;
  /** Tax amount for selected items */
  tax: number;
  /** Total including tax */
  total: number;
  /** Callback when Pay Now is clicked */
  onPayNow?: () => void;
  /** Label for the action button */
  label?: string;
}

/**
 * FloatingPaymentPanel - Fixed bottom payment summary panel
 *
 * Appears when items are selected, shows summary and Pay Now button.
 * Animates in/out from bottom of screen.
 */
export function FloatingPaymentPanel({
  selectedCount,
  subtotal,
  tax,
  total,
  onPayNow,
  label = "Pay Now",
}: FloatingPaymentPanelProps) {
  const isVisible = selectedCount > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50"
        >
          <div className="border-t border-zinc-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <div className="mx-auto max-w-lg px-4 py-4">
              {/* Main row: count, total, button */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {selectedCount} elemento{selectedCount > 1 ? "s" : ""} seleccionado{selectedCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-xl font-semibold text-zinc-900 dark:text-white">
                    {formatCurrency(total)}
                  </p>
                </div>
                <CustomButton
                  onClick={onPayNow}
                  className="px-8 py-3"
                >
                  {label}
                </CustomButton>
              </div>

              {/* Details row: subtotal, tax */}
              <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
                <span>Subtotal: {formatCurrency(subtotal)}</span>
                <span>IVA: {formatCurrency(tax)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
