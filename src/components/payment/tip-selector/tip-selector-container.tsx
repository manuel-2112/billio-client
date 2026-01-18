/**
 * Tip Selector Container Component
 * 
 * Container component that orchestrates tip selection logic.
 * Follows Single Responsibility Principle: only handles tip update logic.
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccountQuery } from '@/hooks/api/queries/use-account-query';
import { useTipMutation } from '@/hooks/api/mutations';
import { TipSelectorView } from './tip-selector-view';
import { Button } from '@/registry/new-york-v4/ui/button';
import { calculateTipFromPercentage } from '@/lib/utils/validation';
import { TIP_PRESETS } from '@/lib/constants/payment';
import { toast } from 'sonner';

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
  /**
   * Callback to go back
   */
  onBack?: () => void;
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
  onBack,
}: TipSelectorContainerProps) {
  const { data: account } = useAccountQuery({
    restaurant,
    location,
    table,
  });

  const { mutate: updateTip, isPending } = useTipMutation({ accountId });

  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  // Initialize selected preset based on current tip
  useEffect(() => {
    if (account && account.tip > 0 && account.subtotal > 0) {
      const currentPercentage = Math.round(
        (account.tip / account.subtotal) * 100
      );
      const matchingPreset = TIP_PRESETS.find(
        (p) => Math.abs(p - currentPercentage) < 1
      );
      if (matchingPreset !== undefined) {
        setSelectedPreset(matchingPreset);
      }
    }
  }, [account]);

  const handlePresetSelect = (percentage: number) => {
    if (!account) return;

    setSelectedPreset(percentage);
    setCustomAmount('');

    const tipAmount = calculateTipFromPercentage(account.subtotal, percentage);

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
    if (!isNaN(amount) && amount >= 0 && account) {
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
    } else if (value === '' && account) {
      // Reset to 0 if empty
      updateTip({ tip_amount: 0 });
    }
  };

  if (!account) {
    return null;
  }

  const currentTip = account.tip;

  return (
    <div className="space-y-4">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-2">
          ← Volver
        </Button>
      )}

      <TipSelectorView
        subtotal={account.subtotal}
        currentTip={currentTip}
        selectedPreset={selectedPreset}
        customAmount={customAmount}
        onPresetSelect={handlePresetSelect}
        onCustomAmountChange={handleCustomAmountChange}
        disabled={isPending}
      />

      {onConfirm && (
        <Button
          onClick={onConfirm}
          className="w-full"
          size="lg"
          disabled={isPending}
        >
          {isPending ? 'Actualizando...' : 'Continuar al pago'}
        </Button>
      )}
    </div>
  );
}
