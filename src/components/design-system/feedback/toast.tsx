'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast as sonnerToast, ToasterProps } from 'sonner';

/**
 * Design System Toast Component
 * 
 * Provides a standardized way to show notifications using the project's design system.
 * Wraps 'sonner' with consistent styling.
 */

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium',
          error: 'group-[.toaster]:text-destructive group-[.toaster]:border-destructive/30',
          success: 'group-[.toaster]:text-[var(--brand-primary)] group-[.toaster]:border-[var(--brand-primary)]/30',
          warning: 'group-[.toaster]:text-amber-500 group-[.toaster]:border-amber-500/30',
          info: 'group-[.toaster]:text-blue-500 group-[.toaster]:border-blue-500/30',
        },
      }}
      {...props}
    />
  );
};

// Re-export toast function to be callable from anywhere
export const toast = sonnerToast;
export { Toaster };
