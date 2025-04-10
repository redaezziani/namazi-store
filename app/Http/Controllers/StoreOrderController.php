<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StoreOrderController extends Controller
{
    /**
     * Get all orders for the authenticated user
     */
    public function getUserOrders()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $orders = Order::where('user_id', $user->id)
            ->with(['items' => function($query) {
                $query->with('product');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        $formattedOrders = $orders->map(function ($order) {
            $items = $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'size' => $item->size,
                    'color' => $item->color,
                    'image' => $item->product->cover_image,
                ];
            });

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => $order->total,
                'items_count' => $items->sum('quantity'),
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'shipping_address' => [
                    'name' => $order->shipping_name,
                    'address' => $order->shipping_address,
                    'city' => $order->shipping_city,
                    'state' => $order->shipping_state,
                    'postal_code' => $order->shipping_postal_code,
                    'country' => $order->shipping_country,
                    'phone' => $order->shipping_phone,
                ],
                'items' => $items,
            ];
        });

        return response()->json([
            'data' => $formattedOrders
        ]);
    }

    /**
     * Get a specific order by ID
     */
    public function getOrderById($id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['items' => function($query) {
                $query->with('product');
            }])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $items = $order->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'price' => $item->price,
                'quantity' => $item->quantity,
                'size' => $item->size,
                'color' => $item->color,
                'image' => $item->product->cover_image,
            ];
        });

        $formattedOrder = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'total' => $order->total,
            'items_count' => $items->sum('quantity'),
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'shipping_address' => [
                'name' => $order->shipping_name,
                'address' => $order->shipping_address,
                'city' => $order->shipping_city,
                'state' => $order->shipping_state,
                'postal_code' => $order->shipping_postal_code,
                'country' => $order->shipping_country,
                'phone' => $order->shipping_phone,
            ],
            'items' => $items,
        ];

        return response()->json($formattedOrder);
    }

    /**
     * Process a checkout and create a new order
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:2',
            'payment_method' => 'required|string|in:credit_card,paypal,apple_pay',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'shipping_cost' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create a new order
            $orderNumber = 'ORD-' . strtoupper(Str::random(8));

            $order = new Order([
                'user_id' => $user->id,
                'order_number' => $orderNumber,
                'status' => 'pending',
                'total' => $request->total_amount,
                'shipping_name' => $request->name,
                'shipping_address' => $request->address,
                'shipping_city' => $request->city,
                'shipping_state' => $request->state,
                'shipping_postal_code' => $request->postal_code,
                'shipping_country' => $request->country,
                'shipping_phone' => $request->phone,
                'payment_method' => $request->payment_method,
            ]);

            $order->save();

            // Create order items
            foreach ($request->items as $item) {
                $orderItem = new OrderItem([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'size' => $item['size'] ?? null,
                    'color' => $item['color'] ?? null,
                ]);

                $orderItem->save();

                // Update product quantity (if needed)
                $product = Product::find($item['product_id']);
                if ($product && $product->quantity !== null) {
                    $product->quantity = max(0, $product->quantity - $item['quantity']);
                    $product->save();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'id' => $order->id,
                'order_number' => $order->order_number,
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
