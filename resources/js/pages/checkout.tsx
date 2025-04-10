import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import StoreHeader from './ui/store-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Checkout() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const shippingCost = 10.00;
  const taxRate = 0.07; // 7% tax
  const taxAmount = getTotalPrice() * taxRate;
  const totalAmount = getTotalPrice() + shippingCost + taxAmount;

  // Form handling
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    payment_method: 'credit_card',
    card_number: '',
    card_expiry: '',
    card_cvc: '',
  });

  useEffect(() => {
    // Redirect to cart if no items
    if (items.length === 0) {
      window.location.href = '/cart';
    }

    // Set payment method from form data
    setPaymentMethod(data.payment_method);
  }, [items, data.payment_method]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create order with items and shipping info
      const response = await axios.post('/api/store/checkout', {
        ...data,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size || null,
          color: item.color || null,
        })),
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      });

      // Show success message
      toast.success('Order submitted successfully!', {
        description: `Your order #${response.data.order_number} has been placed.`,
      });

      // Clear cart after successful order
      clearCart();

      // Redirect to order confirmation page
      window.location.href = `/orders/${response.data.id}`;
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Failed to process your order', {
        description: err.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head title="Checkout" />
      <StoreHeader />

      <main className="container mx-auto mt-20 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Checkout</h1>
          <p className="mt-1 text-gray-500">Complete your order details</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Order details (right side) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping information */}
              <div className="rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-medium">Shipping Information</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      required
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      required
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={data.phone}
                      onChange={e => setData('phone', e.target.value)}
                      required
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={data.address}
                      onChange={e => setData('address', e.target.value)}
                      required
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={data.city}
                      onChange={e => setData('city', e.target.value)}
                      required
                    />
                    {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      value={data.state}
                      onChange={e => setData('state', e.target.value)}
                      required
                    />
                    {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={data.postal_code}
                      onChange={e => setData('postal_code', e.target.value)}
                      required
                    />
                    {errors.postal_code && <p className="text-sm text-red-500">{errors.postal_code}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={data.country}
                      onValueChange={(value) => setData('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="JP">Japan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                  </div>
                </div>
              </div>

              {/* Payment information */}
              <div className="rounded-lg border p-6">
                <h2 className="mb-4 text-lg font-medium">Payment Method</h2>

                <RadioGroup
                  value={data.payment_method}
                  onValueChange={(value) => setData('payment_method', value)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Credit / Debit Card
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M19.0369 6.47018C19.1036 5.97107 19.0369 5.63751 18.8704 5.3039C18.5706 4.63674 17.737 4.2366 16.7702 4.2366H12.0697C11.9031 4.2366 11.7366 4.37002 11.6699 4.50345L10.1363 11.6385C10.1363 11.772 10.2031 11.9054 10.3697 11.9054H12.2363C12.403 11.9054 12.5364 11.772 12.5364 11.6385V11.572L12.9028 9.53746H14.2366C15.9037 9.53746 17.137 8.8703 17.5039 7.13757C17.5039 7.07081 17.5039 7.00401 17.5039 6.93725C17.437 6.93725 17.437 6.93725 19.0369 6.47018Z" fill="#040E17"/>
                        <path d="M6.13644 12.6718L5.10314 18.8734C5.10314 19.0068 5.16988 19.1403 5.33648 19.1403H7.13608C7.30264 19.1403 7.46928 19.0068 7.53604 18.8734L8.53608 13.1387C8.53608 13.0053 8.46936 12.8718 8.3028 12.8718H6.36952C6.26952 12.8053 6.20276 12.7385 6.13644 12.6718Z" fill="#040E17"/>
                        <path d="M5.6029 8.43733C5.46952 9.30405 6.06944 9.7039 6.66936 9.7039H8.9364C9.10296 9.7039 9.2696 9.57047 9.33632 9.43705L9.7698 7.43733C9.83656 7.30391 9.7698 7.17048 9.60324 7.17048H7.06976C6.56976 7.17048 5.73632 7.5039 5.6029 8.43733Z" fill="#040E17"/>
                        <path d="M14.3031 4.2366H9.53624C9.36968 4.2366 9.20304 4.37002 9.13632 4.50345L7.60272 11.6385C7.60272 11.772 7.66944 11.9054 7.836 11.9054H9.70296C9.86952 11.9054 10.0362 11.772 10.1029 11.6385V11.572L10.4693 9.53746H11.8031C13.4702 9.53746 14.7035 8.8703 15.0703 7.13757C15.2036 6.57091 15.137 6.10421 14.97 5.77065C14.7035 4.90393 13.8035 4.2366 14.3031 4.2366Z" fill="#040E17"/>
                      </svg>
                      PayPal
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="apple_pay" id="apple_pay" />
                    <Label htmlFor="apple_pay" className="flex items-center">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M17.2125 9.42C16.5517 9.97333 15.4867 10.4325 14.6775 10.4C14.345 8.26083 15.5592 7.01333 15.5592 7.01333C15.5592 7.01333 14.8042 6.3775 13.76 6.21833C12.9167 6.08667 11.9575 6.625 11.5142 6.625C11.0292 6.625 10.1642 6.24583 9.55167 6.24583C7.9125 6.27333 6.09167 7.68 6.09167 10.5475C6.09167 11.93 6.53167 13.3858 7.14 14.4142C7.88667 15.6925 8.57083 16.7867 9.61833 16.7592C10.575 16.7317 11.1358 16.1133 12.3508 16.1133C13.5383 16.1133 14.0642 16.7592 15.1392 16.7592C16.1975 16.7317 16.8408 15.775 17.5608 14.4967C18.06 13.6183 18.4092 12.7125 18.6125 11.93L17.2125 9.42Z" fill="#040E17"/>
                        <path d="M14.5275 5.31999C14.9908 4.75249 15.3125 3.95916 15.2033 3.16666C14.5275 3.19416 13.7242 3.59249 13.2333 4.15999C12.7975 4.65999 12.3983 5.47916 12.5367 6.24833C13.265 6.30416 14.0367 5.88749 14.5275 5.31999Z" fill="#040E17"/>
                      </svg>
                      Apple Pay
                    </Label>
                  </div>
                </RadioGroup>

                {/* Credit card details (shown only when credit card selected) */}
                {paymentMethod === 'credit_card' && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card_number">Card Number</Label>
                      <Input
                        id="card_number"
                        placeholder="•••• •••• •••• ••••"
                        value={data.card_number}
                        onChange={e => setData('card_number', e.target.value)}
                        required={paymentMethod === 'credit_card'}
                      />
                      {errors.card_number && <p className="text-sm text-red-500">{errors.card_number}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card_expiry">Expiration Date</Label>
                        <Input
                          id="card_expiry"
                          placeholder="MM/YY"
                          value={data.card_expiry}
                          onChange={e => setData('card_expiry', e.target.value)}
                          required={paymentMethod === 'credit_card'}
                        />
                        {errors.card_expiry && <p className="text-sm text-red-500">{errors.card_expiry}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="card_cvc">CVC</Label>
                        <Input
                          id="card_cvc"
                          placeholder="•••"
                          value={data.card_cvc}
                          onChange={e => setData('card_cvc', e.target.value)}
                          required={paymentMethod === 'credit_card'}
                        />
                        {errors.card_cvc && <p className="text-sm text-red-500">{errors.card_cvc}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <Link href="/cart" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  ← Back to cart
                </Link>

                <Button
                  type="submit"
                  className="px-6 py-3 bg-black hover:bg-gray-800"
                  disabled={submitting || processing || items.length === 0}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Place Order (${formatCurrency(totalAmount)})`
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Order summary (right sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-medium">Order Summary</h2>

              <div className="space-y-4">
                <div className="max-h-80 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="h-16 w-16 bg-gray-100 flex-shrink-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                          <div className="flex text-xs text-gray-500 mt-1">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span className="ml-2">Size: {item.size}</span>}
                          </div>
                        </div>
                        <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
