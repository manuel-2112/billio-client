/**
 * TanStack Query Provider
 * 
 * Configuración centralizada del QueryClient para toda la aplicación.
 * Sigue Single Responsibility Principle: solo maneja configuración de queries.
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider component
 * 
 * Provides TanStack Query context to the application.
 * Creates a singleton QueryClient instance with optimized defaults.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 30 seconds
            staleTime: 30 * 1000,
            // Refetch on window focus (user returns to tab)
            refetchOnWindowFocus: true,
            // Retry failed requests once
            retry: 1,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
          },
          mutations: {
            // Don't retry mutations (user actions should fail fast)
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
