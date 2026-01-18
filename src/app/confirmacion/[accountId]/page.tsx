/**
 * Payment Confirmation Page
 * 
 * Displays success message after payment completion.
 * Follows Single Responsibility Principle: only displays confirmation.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { MobileContainer } from '@/components/design-system/layout';

interface ConfirmationPageProps {
  params: {
    accountId: string;
  };
}

/**
 * ConfirmationPage component
 * 
 * Shows success message after payment.
 * Prevents back navigation to payment page.
 * 
 * @example
 * Navigate here after successful payment: /confirmacion/{accountId}
 */
export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Prevent back navigation to payment page
    const handlePopState = () => {
      router.replace('/');
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  // Extract last 8 characters of account ID for display
  const orderNumber = params.accountId.slice(-8).toUpperCase();

  return (
    <MobileContainer>
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="mx-auto max-w-md text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="mb-4 text-3xl font-bold">¡Pago Exitoso!</h1>
          <p className="mb-2 text-lg text-muted-foreground">
            Tu pago ha sido procesado correctamente
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Recibirás un comprobante por email
          </p>

          {/* Order Info */}
          <div className="mb-8 rounded-lg border bg-card p-6">
            <p className="mb-2 text-sm text-muted-foreground">Número de orden</p>
            <p className="font-mono text-lg font-semibold">{orderNumber}</p>
          </div>

          {/* Return Message */}
          <p className="text-sm text-muted-foreground">
            Gracias por tu visita. ¡Vuelve pronto!
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}
