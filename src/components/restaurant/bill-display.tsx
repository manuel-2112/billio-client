"use client";

interface BillItem {
  name: string;
  quantity: number;
  price: number;
}

interface RestaurantBillDisplayProps {
  /** Restaurant name */
  restaurantName: string;
  /** Restaurant address */
  address?: string;
  /** Restaurant phone */
  phone?: string;
  /** Table number */
  table: number | string;
  /** Server name */
  serverName?: string;
  /** Order date */
  orderDate?: string;
  /** Order ID */
  orderId?: string | number;
  /** Bill items */
  items: BillItem[];
  /** Tax rate as decimal (e.g., 0.085 for 8.5%) */
  taxRate?: number;
}

/**
 * RestaurantBillDisplay - Receipt-style bill display
 *
 * Renders a restaurant bill in classic receipt style with
 * header, order info, items grid, and totals.
 */
export function RestaurantBillDisplay({
  restaurantName,
  address,
  phone,
  table,
  serverName,
  orderDate,
  orderId,
  items,
  taxRate = 0.085,
}: RestaurantBillDisplayProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="flex h-full w-full flex-col overflow-auto bg-white p-4 md:p-8 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-4 border-b border-dashed border-zinc-300 pb-4 text-center dark:border-zinc-700">
        <h2 className="text-xl font-bold text-zinc-900 md:text-2xl dark:text-white">
          {restaurantName}
        </h2>
        {address && (
          <p className="mt-1 text-xs text-zinc-500 md:text-sm dark:text-zinc-400">
            {address}
          </p>
        )}
        {phone && (
          <p className="text-xs text-zinc-500 md:text-sm dark:text-zinc-400">
            Tel: {phone}
          </p>
        )}
      </div>

      {/* Order Info */}
      <div className="mb-4 flex justify-between text-xs text-zinc-600 md:text-sm dark:text-zinc-400">
        <div>
          <p>Table: {table}</p>
          {serverName && <p>Server: {serverName}</p>}
        </div>
        <div className="text-right">
          {orderDate && <p>Date: {orderDate}</p>}
          {orderId && <p>Order #: {orderId}</p>}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 border-b border-t border-zinc-200 py-3 dark:border-zinc-700">
        <div className="mb-2 grid grid-cols-12 px-1 text-xs font-semibold text-zinc-700 md:text-sm dark:text-zinc-300">
          <span className="col-span-6">Item</span>
          <span className="col-span-2 text-center">Qty</span>
          <span className="col-span-4 text-right">Price</span>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 rounded px-1 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 md:text-sm dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <span className="col-span-6">{item.name}</span>
            <span className="col-span-2 text-center">{item.quantity}</span>
            <span className="col-span-4 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-1.5 pt-3">
        <div className="flex justify-between text-xs text-zinc-600 md:text-sm dark:text-zinc-400">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-zinc-600 md:text-sm dark:text-zinc-400">
          <span>Tax ({(taxRate * 100).toFixed(1)}%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900 md:text-lg dark:border-zinc-700 dark:text-white">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Thank You */}
      <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Thank you for dining with us!
      </p>
    </div>
  );
}
