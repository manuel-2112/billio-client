/**
 * Klap Elements Wrapper Component
 * 
 * Wrapper for Klap payment buttons (Apple Pay / Google Pay).
 * Follows Single Responsibility Principle: only handles Klap integration.
 */

'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface KlapElementsWrapperProps {
  /**
   * Klap order ID (from checkout response)
   */
  orderId: string;
  /**
   * Success callback
   */
  onSuccess?: () => void;
  /**
   * Error callback
   */
  onError?: (error: string) => void;
}

const KLAP_SCRIPT_URL =
  process.env.NEXT_PUBLIC_KLAP_SCRIPT_URL ||
  'https://klap.cl/pagos/checkout-flex/v1/main.min.js';

/**
 * KlapElementsWrapper component
 * 
 * Initializes and renders Klap payment buttons.
 * Detects device type to show appropriate wallet (Apple Pay / Google Pay).
 * 
 * @example
 * ```tsx
 * <KlapElementsWrapper
 *   orderId="klap_order_123"
 *   onSuccess={() => router.push('/confirmacion')}
 *   onError={(error) => toast.error(error)}
 * />
 * ```
 */
export function KlapElementsWrapper({
  orderId,
  onSuccess,
  onError,
}: KlapElementsWrapperProps) {
  const applePayRef = useRef<HTMLDivElement>(null);
  const googlePayRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.KLAP_FLEX || isInitialized.current) {
      return;
    }

    const initWallets = () => {
      try {
        const userAgent = navigator.userAgent || navigator.vendor;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
        const isAndroid = /android/i.test(userAgent);

        const wallets: string[] = [];
        if (isIOS) {
          wallets.push('applePay');
        }
        if (isAndroid || !isIOS) {
          wallets.push('googlePay');
        }

        if (wallets.length === 0) {
          wallets.push('applePay', 'googlePay'); // Fallback
        }

        (window as any).KLAP_FLEX.initWallets({
          orderId,
          wallets,
          transparent: false, // Klap handles success screen
        });

        isInitialized.current = true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al inicializar pagos';
        onError?.(errorMessage);
      }
    };

    const timer = setTimeout(initWallets, 100);
    return () => clearTimeout(timer);
  }, [orderId, onError]);

  const handleScriptLoad = () => {
    if (!isInitialized.current) {
      setTimeout(() => {
        if ((window as any).KLAP_FLEX && !isInitialized.current) {
          const initFn = () => {
            try {
              const userAgent = navigator.userAgent || navigator.vendor;
              const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
              const isAndroid = /android/i.test(userAgent);

              const wallets: string[] = [];
              if (isIOS) {
                wallets.push('applePay');
              }
              if (isAndroid || !isIOS) {
                wallets.push('googlePay');
              }

              if (wallets.length === 0) {
                wallets.push('applePay', 'googlePay');
              }

              (window as any).KLAP_FLEX.initWallets({
                orderId,
                wallets,
                transparent: false,
              });

              isInitialized.current = true;
            } catch (error) {
              onError?.(error instanceof Error ? error.message : 'Error al inicializar');
            }
          };

          setTimeout(initFn, 200);
        }
      }, 100);
    }
  };

  return (
    <>
      <Script
        src={KLAP_SCRIPT_URL}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={() => onError?.('Error al cargar script de Klap')}
      />

      <div className="space-y-3">
        <div id="klap-apple-pay" ref={applePayRef} className="w-full" />
        <div id="klap-google-pay" ref={googlePayRef} className="w-full" />
      </div>
    </>
  );
}

// Extend Window type for TypeScript
declare global {
  interface Window {
    KLAP_FLEX?: {
      initWallets: (config: {
        orderId: string;
        wallets: string[];
        transparent?: boolean;
      }) => void;
    };
  }
}
