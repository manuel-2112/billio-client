/**
 * Payment Domain Types
 * 
 * Types específicos del dominio de Payment.
 * Sigue Single Responsibility Principle: solo define tipos del dominio.
 */

/**
 * Order item (producto en la cuenta)
 */
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
}

/**
 * Account status
 */
export type AccountStatus = 'open' | 'paid' | 'cancelled';

/**
 * Account (cuenta de mesa)
 */
export interface Account {
  id: string;
  table_id: string;
  status: AccountStatus;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  items: OrderItem[];
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
}

/**
 * Tip update request
 */
export interface TipUpdate {
  tip_amount?: number;
  tip_percentage?: number;
}

/**
 * Checkout request
 */
export interface CheckoutRequest {
  tip_amount?: number;
  tip_percentage?: number;
}

/**
 * Checkout response
 */
export interface CheckoutResponse {
  order_id: string;
  reference_id: string;
  account: Account;
}
