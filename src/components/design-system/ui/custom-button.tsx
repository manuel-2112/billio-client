'use client';

import * as React from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonProps = React.ComponentProps<typeof Button>;

export interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
  color?: string;
  textColor?: string;
}

/**
 * CustomButton Component
 * 
 * Extended button component for the Design System.
 * Supports all standard variants plus 'brand' handling via CSS variables.
 * Includes built-in loading state support.
 */
export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, color, textColor, ...props }, ref) => {
    
    // Use inline style to set the button color dynamically
    const style = {
      '--btn-color': color || 'var(--brand-primary)',
      '--btn-text-color': textColor || 'white',
    } as React.CSSProperties;

    // Base classes for the premium look requested
    const premiumClasses = "shadow-[0_4px_14px_0_color-mix(in_srgb,var(--btn-color),transparent_61%)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:bg-[color-mix(in_srgb,var(--btn-color),transparent_10%)] px-8 py-2 bg-[var(--btn-color)] rounded-md text-[var(--btn-text-color,white)] font-light transition duration-200 ease-linear hover:opacity-95";

    // If variant is 'default' (or undefined), we apply the premium style.
    // Ideally we should have a 'premium' variant, but user asked to make default primary.
    // We will apply this style when variant is 'default' and NOT 'ghost'/'outline'/'secondary' etc if we want strict adherence,
    // but the existing `Button` component from shadcn applies its own classes based on variant.
    
    // To cleanly override, we conditionally apply the premium classes only when variant is default/undefined
    const isDefault = !variant || variant === 'default';
    
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        style={isDefault ? style : undefined}
        className={cn(
          isDefault && premiumClasses,
          // Remove default shadcn bg/hover for default variant since we handle it
          isDefault && "hover:bg-[var(--btn-color)]", 
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  }
);
CustomButton.displayName = 'CustomButton';
