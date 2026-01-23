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
import Counter from '@/components/ui/counter';

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
      <div className="flex flex-wrap gap-2">
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
      {/* Current tip display - Always visible */}
      <Card className="bg-muted/50 p-6 flex flex-col items-center justify-center gap-2 overflow-hidden relative min-h-[160px]">
        <p className="text-sm text-muted-foreground z-10 relative">Propina seleccionada</p>
        <div className="flex items-center justify-center z-10 relative">
          <span className="text-4xl font-bold text-[var(--foreground)] mr-2">$</span>
          <Counter
            value={currentTip}
            fontSize={48}
            padding={0}
            gap={2}
            textColor="var(--foreground)" // Adapt to theme
            fontWeight={700}
            // Dynamic places based on digits, e.g. 1500 -> [1000, 100, 10, 1]
            // We let the component auto-detect by passing 'places' based on value string length if needed,
            // but the component default logic handles exact digits of 'value'.
            // However, to ensure smooth animation when number of digits changes (e.g. 900 -> 1000), 
            // we might want fixed places like [10000, 1000, 100, 10, 1] but that would show leading zeros if not handled.
            // The provided component's default 'places' prop logic:
            // places = [...value.toString()].map(...)
            // This means it recalculates places on every render based on current value string.
            // This is fine for the requested effect found in the library usually.
            gradientFrom="var(--background)" 
            gradientTo="transparent"
            gradientHeight={32}
          />
        </div>
      </Card>
    </div>
  );
}
