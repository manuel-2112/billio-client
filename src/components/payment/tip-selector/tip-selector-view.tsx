/**
 * Tip Selector View Component
 * 
 * Presentational component for tip selection UI.
 * Follows Single Responsibility Principle: only renders tip selector UI.
 */

import { TipPresetButton } from './tip-preset-button';
import { TipCustomInput } from './tip-custom-input';
import { Card } from '@/registry/new-york-v4/ui/card';
import { Label } from '@/registry/new-york-v4/ui/label';
import { TIP_PRESETS } from '@/lib/constants/payment';
import { formatCLP } from '@/lib/utils/currency';

interface TipSelectorViewProps {
  /**
   * Subtotal amount (for percentage calculations)
   */
  subtotal: number;
  /**
   * Current tip amount
   */
  currentTip: number;
  /**
   * Selected preset percentage (null if custom)
   */
  selectedPreset: number | null;
  /**
   * Custom tip amount input value
   */
  customAmount: string;
  /**
   * Handler for preset selection
   */
  onPresetSelect: (percentage: number) => void;
  /**
   * Handler for custom amount change
   */
  onCustomAmountChange: (value: string) => void;
  /**
   * Whether selector is disabled
   */
  disabled?: boolean;
}

/**
 * TipSelectorView component
 * 
 * Displays tip selection UI with presets and custom input.
 * 
 * @example
 * ```tsx
 * <TipSelectorView
 *   subtotal={27500}
 *   currentTip={4125}
 *   selectedPreset={15}
 *   customAmount=""
 *   onPresetSelect={handlePresetClick}
 *   onCustomAmountChange={handleCustomChange}
 * />
 * ```
 */
export function TipSelectorView({
  subtotal,
  currentTip,
  selectedPreset,
  customAmount,
  onPresetSelect,
  onCustomAmountChange,
  disabled = false,
}: TipSelectorViewProps) {
  const tipPercentage =
    subtotal > 0 ? Math.round((currentTip / subtotal) * 100) : 0;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Propina</Label>
        <p className="text-sm text-muted-foreground">
          ¿Deseas agregar una propina?
        </p>
      </div>

      {/* Preset buttons */}
      <div className="grid grid-cols-4 gap-2">
        {TIP_PRESETS.map((percentage) => (
          <TipPresetButton
            key={percentage}
            percentage={percentage}
            isSelected={selectedPreset === percentage}
            onClick={() => onPresetSelect(percentage)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Custom amount input */}
      <TipCustomInput
        value={customAmount}
        onChange={onCustomAmountChange}
        tipPercentage={tipPercentage}
        disabled={disabled}
      />

      {/* Current tip display */}
      {currentTip > 0 && (
        <Card className="bg-muted/50 p-3 text-center">
          <p className="text-sm text-muted-foreground">Propina seleccionada</p>
          <p className="text-xl font-semibold">{formatCLP(currentTip)}</p>
        </Card>
      )}
    </div>
  );
}
