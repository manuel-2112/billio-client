/**
 * Page Header Component
 * 
 * Reusable page header for mobile views.
 * Follows Single Responsibility Principle: only renders header UI.
 */

import type { ReactNode } from 'react';

interface PageHeaderProps {
  /**
   * Main title
   */
  title: string;
  /**
   * Optional subtitle
   */
  subtitle?: string;
  /**
   * Optional action button
   */
  action?: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * PageHeader component
 * 
 * Provides consistent header styling across pages.
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="Mesa 5"
 *   subtitle="Revisa tu cuenta"
 * />
 * ```
 */
export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={`border-b bg-card px-4 py-4 ${className || ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
