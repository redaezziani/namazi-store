import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreHeader from './ui/store-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { items, getTotalItems, getTotalPrice, removeItem, updateQuantity, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState('');

  const handleRemoveItem = (id: string | number, size?: string, color?: string) => {
    removeItem(id, size, color);
  };

  const handleQuantityChange = (id: string | number, newQuantity: number, size?: string, color?: string) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity, size, color);
  };

  const handlePromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate the promo code here
    alert(`Promo code ${promoCode} applied!`);
  };

  return (
    <>
      <Head title="Your Cart" />
      <StoreHeader />

      <main className="container mx-auto mt-20 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Your Cart</h1>
          <p className="mt-1 text-gray-500">Review and modify your items before checkout</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart items (left side) */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-medium">Shopping Cart ({getTotalItems()})</h2>
                    <button
                      onClick={() => clearCart()}
                      className="text-sm text-gray-500 hover:text-red-500 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear Cart
                    </button>
                  </div>

                  <Separator className="mb-6" />

                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                        <div className="h-32 w-24 bg-gray-100 flex-shrink-0">
                          {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-1">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.name}</h3>
                              <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500 space-y-1">
                              {item.size && <p>Size: {item.size}</p>}
                              {item.color && (
                                <p className="flex items-center">
                                  Color:
                                  <span
                                    className="ml-1.5 h-3 w-3 rounded-full inline-block"
                                    style={{ backgroundColor: item.color }}
                                  ></span>
                                </p>
                              )}
                              <p>SKU: {item.sku}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border">
                              <button
                                className="p-2 text-gray-500 hover:text-gray-700"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size, item.color)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-4 py-2 text-center min-w-[40px]">{item.quantity}</span>
                              <button
                                className="p-2 text-gray-500 hover:text-gray-700"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size, item.color)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="text-sm text-gray-500 hover:text-red-500 flex items-center"
                              onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Link href="/products">
                  <Button variant="outline" className="border-gray-300">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order summary (right sidebar) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-medium">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>

                  {/* Promo code input */}
                  <div className="pt-4">
                    <form onSubmit={handlePromoCodeSubmit} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={!promoCode.trim()}
                      >
                        Apply
                      </Button>
                    </form>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Estimated Total</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>

                  <Link href="/checkout" className="w-full">
                    <Button className="w-full py-6 bg-black hover:bg-gray-800 text-white">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="flex justify-center gap-2 pt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm text-gray-500">Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
