<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => Order::query()
                ->whereBelongsTo($request->user())
                ->with('items')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'customer.name' => ['required', 'string', 'max:255'],
            'customer.email' => ['required', 'email', 'max:255'],
            'customer.phone' => ['nullable', 'string', 'max:40'],
            'shipping_address.line1' => ['required', 'string', 'max:255'],
            'shipping_address.city' => ['required', 'string', 'max:120'],
            'shipping_address.country' => ['required', 'string', 'max:120'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'items.*.size' => ['nullable', 'string', 'max:30'],
            'items.*.color' => ['nullable', 'string', 'max:40'],
        ]);

        $order = DB::transaction(function () use ($data, $request): Order {
            $productIds = collect($data['items'])->pluck('product_id')->unique();
            $products = Product::query()
                ->whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $totalCents = 0;
            $items = [];

            foreach ($data['items'] as $item) {
                $product = $products->get($item['product_id']);

                if (! $product || ! $product->is_active || $product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["No hay stock suficiente para {$product?->name}."],
                    ]);
                }

                $unitPriceCents = (int) round(((float) $product->price) * 100);
                $subtotalCents = $unitPriceCents * $item['quantity'];
                $totalCents += $subtotalCents;

                $items[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'size' => $item['size'] ?? null,
                    'color' => $item['color'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => number_format($subtotalCents / 100, 2, '.', ''),
                ];

                $product->decrement('stock', $item['quantity']);
                $product->stock -= $item['quantity'];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'customer' => $data['customer'],
                'shipping_address' => $data['shipping_address'],
                'total' => number_format($totalCents / 100, 2, '.', ''),
            ]);

            $order->items()->createMany($items);

            return $order->load('items');
        });

        return response()->json(['data' => $order], 201);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 404);

        return response()->json([
            'data' => $order->load('items'),
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        $orders = Order::query()
            ->with(['items', 'user:id,name,email'])
            ->latest()
            ->paginate(20);

        return response()->json($orders);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,delivered,cancelled'],
        ]);

        $order->update($data);

        return response()->json(['data' => $order]);
    }
}
