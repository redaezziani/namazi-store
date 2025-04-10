import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import StoreHeader from './ui/store-header';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
  id: string | number;
  product_id: string | number;
  product_name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  id: string | number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items_count: number;
  created_at: string;
  updated_at: string;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
}

export default function OrderConfirmation() {
  const { props } = usePage();
  const { orderId } = props as { orderId: string };
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/store/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load your order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <>
      <Head title="Order Confirmation" />
      <StoreHeader />

      <main className="container mx-auto mt-20 px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <h1 className="text-xl font-medium text-red-800">{error}</h1>
            <p className="mt-2 text-red-600">Please try again or contact customer support.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.href = '/orders'}
            >
              Go to My Orders
            </Button>
          </div>
        ) : order ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-medium text-gray-900">Order Confirmed!</h1>
              <p className="mt-2 text-gray-600">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>

            <div className="rounded-lg border mb-6">
              <div className="border-b p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-medium">Order #{order.order_number}</h2>
                    <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.created_at)}</p>
                  </div>
                  <Badge className="self-start md:self-auto">
                    {order.status === 'pending' ? (
                      <>Processing</>
                    ) : (
                      <>{order.status}</>
                    )}
                  </Badge>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        {item.image ? (
                          <div className="h-20 w-16 bg-gray-100 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-20 w-16 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{item.product_name}</h4>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <p>Qty: {item.quantity}</p>
                            {item.size && <p>Size: {item.size}</p>}
                            {item.color && (
                              <p className="flex items-center">
                                Color:
                                <span
                                  className="ml-1 h-3 w-3 rounded-full inline-block"
                                  style={{ backgroundColor: item.color }}
                                ></span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <address className="text-sm text-gray-600 not-italic">
                      {order.shipping_address.name}<br />
                      {order.shipping_address.address}<br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                      {order.shipping_address.country}<br />
                      {order.shipping_address.phone}
                    </address>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.total - 10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{formatCurrency(10)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Link href="/orders">
                <Button variant="outline">
                  View All Orders
                </Button>
              </Link>

              <Link href="/products">
                <Button className="group">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border p-6 text-center">
            <h1 className="text-xl font-medium">Order not found</h1>
            <p className="mt-2 text-gray-600">We couldn't find the order you're looking for.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.href = '/orders'}
            >
              Go to My Orders
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
