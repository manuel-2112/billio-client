/**
 * Customer Payment Page
 * 
 * Main page that orchestrates the 3 views: Order Summary, Tip Selector, Checkout.
 * Follows Single Responsibility Principle: only orchestrates views.
 */

'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, MobileContainer } from '@/components/design-system/layout';
import { TipSelectorContainer } from '@/components/payment/tip-selector/tip-selector-container';
import { CheckoutContainer } from '@/components/payment/checkout/checkout-container';
import { HeroBillContainer } from '@/components/payment/hero-bill/hero-bill-container';
import { useAccountQuery } from '@/hooks/api/queries/use-account-query';

type View = 'hero' | 'tip' | 'checkout';

interface CustomerPageProps {
  params: Promise<{
    restaurant: string;
    location: string;
    table: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Customer Payment Page
 * 
 * Orchestrates the payment flow with 3 views:
 * 1. Hero View - Immersive bill display
 * 2. Tip Selector - Add tip
 * 3. Checkout - Complete payment
 * 
 * Uses query params or state to manage current view.
 */
export default function CustomerPage({ params, searchParams }: CustomerPageProps) {
  const router = useRouter();
  const { restaurant, location, table } = use(params);
  const { view, amount, subtotal, tax } = use(searchParams); // Read query params
  
  const tableNumber = parseInt(table, 10);
  
  // Initialize view based on query param or default to 'hero'
  const [currentView, setCurrentView] = useState<View>((view as View) || 'hero');
  const [accountId, setAccountId] = useState<string | null>(null);

  // Parse split amounts if present
  const splitSubtotal = amount ? parseFloat(amount as string) : null;
  // If we have a split amount, strictly speaking we should probably pass the subtotal/tax explicitly if we want perfect accuracy,
  // or derive them. For now let's assume 'amount' passed from split is the subtotal (base to tip on) or the total?
  // Usually tip is calculated on subtotal.
  // Let's assume the Split Page passes 'subtotal' and 'tax' separately if possible, or just 'amount' as the subtotal equivalent.
  // Actually, TipSelectorView takes 'subtotal' to calculate percentages.
  // So SplitPage should pass 'subtotal'.

  // Fetch account data
  const { data, isLoading, error } = useAccountQuery({
    restaurant,
    location,
    table: tableNumber,
    // Always fetch initial data for hero, then stop if handling checkout flow manually if needed
    // But generally we want fresh data.
  });

  // Update accountId when account is loaded
  useEffect(() => {
    if (data?.account && !accountId) {
      setAccountId(data.account.id);
    }
  }, [data, accountId]);

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

  const handleSplit = () => {
    router.push(`/${restaurant}/${location}/${table}/split`);
  };

  // View 1: Hero Bill (Replaces Order Summary)
  if (currentView === 'hero') {
    return (
      <HeroBillContainer
        restaurant={restaurant}
        location={location}
        table={tableNumber}
        onPay={() => handleViewChange('tip')}
        onSplit={handleSplit}
      />
    );
  }

  // Views 2 & 3: Standard Flow (Tip & Checkout)
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title={`Mesa ${tableNumber}`}
        subtitle={
          currentView === 'tip'
            ? 'Agrega propina'
            : 'Completa el pago'
        }
        onBack={() => {
          if (currentView === 'tip') {
            handleViewChange('hero');
          } else if (currentView === 'checkout') {
            handleViewChange('tip');
          }
        }}
      />

      <main className="mx-auto max-w-lg px-4 py-6 pb-24 space-y-6">
        {/* View 2: Tip Selector */}
        {currentView === 'tip' && accountId && (
          <TipSelectorContainer
            restaurant={restaurant}
            location={location}
            table={tableNumber}
            accountId={accountId}
            onConfirm={() => handleViewChange('checkout')}
            // If splitSubtotal is present, we use it to override the account subtotal
            overrideSubtotal={splitSubtotal || undefined}
          />
        )}

        {/* View 3: Checkout */}
        {currentView === 'checkout' && accountId && (
          <CheckoutContainer
            restaurant={restaurant}
            location={location}
            table={tableNumber}
            accountId={accountId}
            onBack={() => handleViewChange('tip')}
          />
        )}
      </main>
    </div>
  );
}
