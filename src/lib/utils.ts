import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasApplePay() {
  return typeof window !== "undefined" && window.ApplePaySession;
}

export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString('es-CL')}`;
}