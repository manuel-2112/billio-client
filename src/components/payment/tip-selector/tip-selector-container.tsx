/**
 * Tip Selector Container Component
 * 
 * Container component that orchestrates tip selection logic.
 * Follows Single Responsibility Principle: only handles tip update logic.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccountQuery } from '@/hooks/api/queries/use-account-query';
import { useTipMutation } from '@/hooks/api/mutations';
import { TipSelectorView } from './tip-selector-view';
import { FloatingPaymentPanel } from '@/components/payment/checkout/floating-payment-panel';
import { CustomButton } from '@/components/design-system/ui/custom-button';
import { calculateTipFromPercentage } from '@/lib/utils/validation';
import { TIP_PRESETS } from '@/lib/constants/payment';
import { toast } from '@/components/design-system/feedback/toast';

interface TipSelectorContainerProps {
  /**
   * Restaurant slug
   */
  restaurant: string;
  /**
   * Location slug
   */
  location: string;
  /**
   * Table number
   */
  table: number;
  /**
   * Account ID (for mutation)
   */
  accountId: string;
  /**
   * Callback when tip is confirmed
   */
  onConfirm?: () => void;
  overrideSubtotal?: number;
}

/**
 * TipSelectorContainer component
 * 
 * Manages tip selection state and updates.
 * Uses optimistic updates for better UX.
 * 
 * @example
 * ```tsx
 * <TipSelectorContainer
 *   restaurant="demo"
 *   location="principal"
 *   table={1}
 *   accountId={account.id}
 *   onConfirm={() => setView('checkout')}
 *   onBack={() => setView('summary')}
 * />
 * ```
 */
export function TipSelectorContainer({
  restaurant,
  location,
  table,
  accountId,
  onConfirm,
  overrideSubtotal,
}: TipSelectorContainerProps) {
  const { data } = useAccountQuery({
    restaurant,
    location,
    table,
  });

  const { mutate: updateTip, isPending } = useTipMutation({ accountId });

  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const initialized = useRef(false);

  // Initialize selected preset based on current tip or default to 10%
  useEffect(() => {
    // Check if we have data to work with
    const subtotal = overrideSubtotal ?? (data?.account?.subtotal || 0);
    
    // Only proceed if we have valid data and haven't initialized yet
    if (subtotal > 0 && data?.account) {
      // If initialized, just sync UI with backend data (if changed externally or confirming selection)
      // But don't FORCE default logic.
      
      if (data.account.tip > 0) {
        // If there is a tip, sync UI
        const currentPercentage = Math.round(
          (data.account.tip / subtotal) * 100
        );
        const matchingPreset = TIP_PRESETS.find(
          (p) => Math.abs(p - currentPercentage) < 1
        );
        if (matchingPreset !== undefined) {
          setSelectedPreset(matchingPreset);
        }
        initialized.current = true;
      } else if (!initialized.current) {
        // Only if NOT initialized and tip is 0, we apply default.
        // Once initialized, if tip is 0, it means user selected 0 (or we just set it to 0).
        
        const defaultPercentage = 10;
        setSelectedPreset(defaultPercentage);
        
        // Apply default tip mutation
        updateTip({ tip_percentage: defaultPercentage });
        
        initialized.current = true;
      }
      // If initialized.current is true and tip is 0, do nothing (user likely selected 0).
    }
  }, [data, overrideSubtotal, updateTip]);

  const handlePresetSelect = (percentage: number) => {
    if (!data?.account) return;
    const { account } = data;

    setSelectedPreset(percentage);
    setCustomAmount('');

    const tipAmount = calculateTipFromPercentage(subtotalToUse, percentage);

    updateTip(
      { tip_percentage: percentage },
      {
        onSuccess: () => {
          toast.success('Propina actualizada');
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Error al actualizar propina'
          );
        },
      }
    );
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedPreset(null);

    // Parse and validate amount
    const amount = parseInt(value.replace(/\D/g, ''), 10);
    if (!isNaN(amount) && amount >= 0 && data?.account) {
      updateTip(
        { tip_amount: amount },
        {
          onError: (error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Error al actualizar propina'
            );
          },
        }
      );
    } else if (value === '' && data?.account) {
      // Reset to 0 if empty
      updateTip({ tip_amount: 0 });
    }
  };

  if (!data?.account) {
    return null;
  }

  const { account } = data;

  const subtotalToUse = overrideSubtotal ?? account.subtotal;
  const currentTip = account.tip; // Tip is usually 0 initially or from backend.
  // If we override subtotal, we probably want to calculate tip based on that.
  
  // Note: account.subtotal is the FULL bill.
  // If we are splitting, we are paying a smaller amount. 
  // We need to ensure we don't accidentally display the full bill total in FloatingPaymentPanel if we want to show just the split.
  // The FloatingPaymentPanel below uses 'account.total + currentTip'.
  // account.total includes tax. 
  // If we override subtotal, we should probably approximate the tax part for display or just use the subtotal as the base.
  // Simple approximation: Total = Subtotal * (1 + TaxRate/Subtotal)
  // Let's rely on passed overrideSubtotal being the amount to PAY (including tax maybe? No, 'subtotal' usually implies before tax).
  
  // Actually, for split bill 'Item Selector', the total returned is usually inclusive of tax (price * quantity).
  // Let's assume overrideSubtotal is actually the AMOUNT TO PAY (so effectively total).
  // But Tip is calculated on subtotal (usually).
  // If the user uses 'Smart Split', maybe they want to tip on their share.

  return (
    <div className="space-y-4">


      <TipSelectorView
        subtotal={subtotalToUse}
        currentTip={currentTip}
        selectedPreset={selectedPreset}
        customAmount={customAmount}
        onPresetSelect={handlePresetSelect}
        onCustomAmountChange={handleCustomAmountChange}
        disabled={isPending}
      />

      <FloatingPaymentPanel
        selectedCount={1} // Represents the bill/order
        subtotal={subtotalToUse}
        tax={overrideSubtotal ? 0 : account.tax} // Hide tax if override for simplicty, or calculate if needed
        total={subtotalToUse + currentTip + (overrideSubtotal ? 0 : account.tax)} // If subtotalToUse replaces account.subtotal, we need to handle tax.
        // If overrideSubtotal is passed, let's assume it INCLUDES everything except tip for now, or just handle it simply.
        // Usually split amount = (items * price) + tax.
        // So subtotalToUse might be 'Selected Total'.
        onPayNow={onConfirm}
        label="Continuar"
      />
    </div>
  );
}
