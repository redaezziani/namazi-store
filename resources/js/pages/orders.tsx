import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import StoreHeader from './ui/store-header';
import { Button } from '@/components/ui/button';
import { PackageIcon, Eye, ShoppingBag, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { formatDistance } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { auth } = usePage().props as any;

  useEffect(() => {
    if (!auth?.user) {
      window.location.href = '/login';
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/store/orders');
      setOrders(response.data.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <PackageIcon className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

    switch (status) {
      case 'pending':
        variant = 'outline';
        break;
      case 'processing':
        variant = 'secondary';
        break;
      case 'shipped':
        variant = 'default';
        break;
      case 'delivered':
        variant = 'default';
        break;
      case 'cancelled':
        variant = 'destructive';
        break;
    }

    return (
      <Badge variant={variant} className="capitalize">
        {getStatusIcon(status)}
        <span className="ml-1">{getStatusText(status)}</span>
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getRelativeTime = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  return (
    <>
      <Head title="My Orders" />
      <StoreHeader />

      <main className="container mx-auto mt-20 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">My Orders</h1>
          <p className="mt-1 text-gray-500">Track and manage your order history</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded text-red-700 mb-6">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              You haven't placed any orders with us yet. Browse our products and make your first purchase!
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <h3 className="font-medium">Order #{order.order_number}</h3>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({getRelativeTime(order.created_at)})
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span>{order.items_count} {order.items_count === 1 ? 'item' : 'items'}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="font-medium">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 lg:mt-0 gap-3">
                    {getStatusBadge(order.status)}

                    <Button
                      variant="outline"
                      className="ml-auto"
                      onClick={() => openOrderDetails(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order details dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Order #{selectedOrder.order_number}</span>
                    {getStatusBadge(selectedOrder.status)}
                  </DialogTitle>
                  <DialogDescription>
                    Placed on {formatDate(selectedOrder.created_at)}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Shipping Address</h4>
                    <address className="text-sm text-gray-600 not-italic">
                      {selectedOrder.shipping_address.name}<br />
                      {selectedOrder.shipping_address.address}<br />
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}<br />
                      {selectedOrder.shipping_address.country}<br />
                      {selectedOrder.shipping_address.phone}
                    </address>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          {item.image && (
                            <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.product_name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 flex flex-col">
                            <span className="font-medium text-sm">{item.product_name}</span>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              {item.size && <span className="mr-2">Size: {item.size}</span>}
                              {item.color && (
                                <span className="flex items-center">
                                  Color:
                                  <span
                                    className="ml-1 h-3 w-3 rounded-full inline-block"
                                    style={{ backgroundColor: item.color }}
                                  ></span>
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-700 mt-auto">
                              {formatCurrency(item.price)} × {item.quantity}
                            </div>
                          </div>
                          <div className="text-right font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.total - 10)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatCurrency(10)}</span>
                    </div>
                    <div className="flex items-center justify-between font-medium text-base pt-1.5">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
