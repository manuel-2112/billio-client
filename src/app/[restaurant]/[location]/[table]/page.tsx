/**
 * Customer Payment Page
 * 
 * Main page that orchestrates the 3 views: Order Summary, Tip Selector, Checkout.
 * Follows Single Responsibility Principle: only orchestrates views.
 */

'use client';

import { useState, useEffect } from 'react';
import { MobileContainer, PageHeader, Section } from '@/components/design-system/layout';
import { OrderSummaryContainer } from '@/components/payment/order-summary/order-summary-container';
import { TipSelectorContainer } from '@/components/payment/tip-selector/tip-selector-container';
import { CheckoutContainer } from '@/components/payment/checkout/checkout-container';
import { useAccountQuery } from '@/hooks/api/queries/use-account-query';

type View = 'summary' | 'tip' | 'checkout';

interface CustomerPageProps {
  params: {
    restaurant: string;
    location: string;
    table: string;
  };
}

/**
 * Customer Payment Page
 * 
 * Orchestrates the payment flow with 3 views:
 * 1. Order Summary - View items and totals
 * 2. Tip Selector - Add tip
 * 3. Checkout - Complete payment
 * 
 * Uses query params or state to manage current view.
 */
export default function CustomerPage({ params }: CustomerPageProps) {
  const tableNumber = parseInt(params.table, 10);
  const [currentView, setCurrentView] = useState<View>('summary');
  const [accountId, setAccountId] = useState<string | null>(null);

  // Fetch account to get accountId
  const { data: account } = useAccountQuery({
    restaurant: params.restaurant,
    location: params.location,
    table: tableNumber,
    enabled: !accountId, // Stop fetching once we have accountId
  });

  // Update accountId when account is loaded
  useEffect(() => {
    if (account && !accountId) {
      setAccountId(account.id);
    }
  }, [account, accountId]);

  // Validate table number
  if (isNaN(tableNumber)) {
    return (
      <MobileContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Mesa inválida</h1>
            <p className="mt-4 text-muted-foreground">
              El número de mesa no es válido
            </p>
          </div>
        </div>
      </MobileContainer>
    );
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  return (
    <MobileContainer>
      <PageHeader
        title={`Mesa ${tableNumber}`}
        subtitle={
          currentView === 'summary'
            ? 'Revisa tu cuenta'
            : currentView === 'tip'
              ? 'Agrega propina'
              : 'Completa el pago'
        }
      />

      <div className="space-y-6 pb-24">
        {/* View 1: Order Summary */}
        {currentView === 'summary' && (
          <Section spacing="lg">
            <OrderSummaryContainer
              restaurant={params.restaurant}
              location={params.location}
              table={tableNumber}
              onAddTip={() => handleViewChange('tip')}
            />
          </Section>
        )}

        {/* View 2: Tip Selector */}
        {currentView === 'tip' && accountId && (
          <Section spacing="lg">
            <TipSelectorContainer
              restaurant={params.restaurant}
              location={params.location}
              table={tableNumber}
              accountId={accountId}
              onConfirm={() => handleViewChange('checkout')}
              onBack={() => handleViewChange('summary')}
            />
          </Section>
        )}

        {/* View 3: Checkout */}
        {currentView === 'checkout' && accountId && (
          <Section spacing="lg">
            <CheckoutContainer
              restaurant={params.restaurant}
              location={params.location}
              table={tableNumber}
              accountId={accountId}
              onBack={() => handleViewChange('tip')}
            />
          </Section>
        )}
      </div>
    </MobileContainer>
  );
}
