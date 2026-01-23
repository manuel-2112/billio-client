/**
 * Checkout Container Component
 * 
 * Container component that orchestrates checkout logic.
 * Follows Single Responsibility Principle: only handles checkout flow.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccountQuery } from '@/hooks/api/queries/use-account-query';
import { useCheckoutMutation } from '@/hooks/api/mutations';
import { CheckoutView } from './checkout-view';
import { isValidPaymentAmount } from '@/lib/utils/validation';
import { toast } from 'sonner';

interface CheckoutContainerProps {
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
   * Account ID
   */
  accountId: string;
  /**
   * Callback to go back
   */
  onBack?: () => void;
}

/**
 * CheckoutContainer component
 * 
 * Manages checkout flow: initializes Klap order and handles payment.
 * 
 * @example
 * ```tsx
 * <CheckoutContainer
 *   restaurant="demo"
 *   location="principal"
 *   table={1}
 *   accountId={account.id}
 *   onBack={() => setView('tip')}
 * />
 * ```
 */
export function CheckoutContainer({
  restaurant,
  location,
  table,
  accountId,
  onBack,
}: CheckoutContainerProps) {
  const router = useRouter();
  const { data } = useAccountQuery({
    restaurant,
    location,
    table,
  });

  const { mutate: checkout, isPending: isCheckingOut, data: checkoutData } =
    useCheckoutMutation({ accountId });

  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    if (!data?.account) return;
    const { account } = data;

    // Validate minimum payment
    if (!isValidPaymentAmount(account.total)) {
      toast.error('El monto mínimo de pago es $1,000 CLP');
      return;
    }

    setError(null);

    // Prepare checkout request
    const tipPercentage =
      account.tip > 0 && account.subtotal > 0
        ? Math.round((account.tip / account.subtotal) * 100)
        : undefined;

    checkout(
      {
        tip_percentage: tipPercentage,
        tip_amount: account.tip > 0 ? account.tip : undefined,
      },
      {
        onSuccess: (data) => {
          toast.success('Pago inicializado. Usa Apple Pay o Google Pay para continuar.');
        },
        onError: (err) => {
          const errorMessage =
            err instanceof Error ? err.message : 'Error al inicializar pago';
          setError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };

  const handlePaymentSuccess = () => {
    // Navigate to confirmation page
    router.push(`/confirmacion/${accountId}`);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error(`Error en el pago: ${errorMessage}`);
  };

  const handleCancel = () => {
    setError(null);
    if (onBack) {
      onBack();
    }
  };

  if (!data?.account) {
    return null;
  }

  const { account } = data;

  return (
    <CheckoutView
      total={account.total}
      tip={account.tip}
      orderId={checkoutData?.order_id || null}
      isLoading={isCheckingOut}
      error={error}
      onCheckout={handleCheckout}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentError={handlePaymentError}
      onCancel={handleCancel}
      onBack={onBack}
    />
  );
}
