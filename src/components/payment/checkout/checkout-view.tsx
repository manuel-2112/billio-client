/**
 * Checkout View Component
 * 
 * Presentational component for checkout UI.
 * Follows Single Responsibility Principle: only renders checkout UI.
 */

import { Button } from '@/registry/new-york-v4/ui/button';
import { PaymentTotalCard } from './payment-total-card';
import { CheckoutErrorState } from './checkout-error-state';
import { KlapElementsWrapper } from './klap-elements-wrapper';
import { isValidPaymentAmount } from '@/lib/utils/validation';
import { MIN_PAYMENT_AMOUNT } from '@/lib/constants/payment';

interface CheckoutViewProps {
  /**
   * Total amount to pay
   */
  total: number;
  /**
   * Tip amount
   */
  tip: number;
  /**
   * Klap order ID (null if not initialized)
   */
  orderId: string | null;
  /**
   * Whether checkout is loading
   */
  isLoading: boolean;
  /**
   * Error message (if any)
   */
  error: string | null;
  /**
   * Handler to initialize checkout
   */
  onCheckout: () => void;
  /**
   * Handler when payment succeeds
   */
  onPaymentSuccess: () => void;
  /**
   * Handler when payment fails
   */
  onPaymentError: (error: string) => void;
  /**
   * Handler to cancel checkout
   */
  onCancel?: () => void;
  /**
   * Handler to go back
   */
  onBack?: () => void;
}

/**
 * CheckoutView component
 * 
 * Displays checkout UI with payment total and Klap Elements.
 * 
 * @example
 * ```tsx
 * <CheckoutView
 *   total={36850}
 *   tip={4125}
 *   orderId={orderId}
 *   isLoading={false}
 *   error={null}
 *   onCheckout={handleCheckout}
 *   onPaymentSuccess={handleSuccess}
 *   onPaymentError={handleError}
 * />
 * ```
 */
export function CheckoutView({
  total,
  tip,
  orderId,
  isLoading,
  error,
  onCheckout,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
  onBack,
}: CheckoutViewProps) {
  const canPay = isValidPaymentAmount(total);

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-2">
          ← Volver
        </Button>
      )}

      {/* Payment Total */}
      <PaymentTotalCard total={total} tip={tip} isProcessing={isLoading} />

      {/* Error State */}
      {error && (
        <CheckoutErrorState
          message={error}
          onDismiss={onCancel}
          onRetry={onCheckout}
        />
      )}

      {/* Payment Section */}
      {orderId ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Método de pago</h2>
          <KlapElementsWrapper
            orderId={orderId}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
          />
          {onCancel && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar pago
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={onCheckout}
            disabled={isLoading || !canPay}
            className="h-14 w-full text-base font-semibold"
            size="lg"
          >
            {isLoading ? 'Inicializando...' : 'Pagar ahora'}
          </Button>
          {!canPay && (
            <p className="text-center text-xs text-muted-foreground">
              El monto mínimo de pago es ${MIN_PAYMENT_AMOUNT.toLocaleString('es-CL')} CLP
            </p>
          )}
        </div>
      )}
    </div>
  );
}
