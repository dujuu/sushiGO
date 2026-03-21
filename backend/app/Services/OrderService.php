<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OrderService
{
    public function createOrder(?int $userId, array $payload): Order
    {
        return DB::transaction(function () use ($userId, $payload): Order {
            $orderItemsPayload = [];
            $subtotal = 0;

            foreach ($payload['items'] as $item) {
                $product = Product::query()
                    ->lockForUpdate()
                    ->find((int) $item['product_id']);

                if (! $product) {
                    throw new RuntimeException('Uno de los productos seleccionados ya no existe.');
                }

                if (! $product->is_available) {
                    throw new RuntimeException("El producto {$product->name} no está disponible.");
                }

                $quantity = (int) $item['quantity'];
                $unitPrice = (float) $product->price;
                $lineSubtotal = $unitPrice * $quantity;

                $subtotal += $lineSubtotal;

                $orderItemsPayload[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => number_format($unitPrice, 2, '.', ''),
                    'quantity' => $quantity,
                    'subtotal' => number_format($lineSubtotal, 2, '.', ''),
                ];
            }

            $discount = $this->calculateDiscount($subtotal, $payload);
            $total = max($subtotal - $discount, 0);

            $order = Order::query()->create([
                'user_id' => $userId,
                'order_number' => $this->generateUniqueOrderNumber(),
                'status' => Order::STATUS_PENDING,
                'subtotal' => number_format($subtotal, 2, '.', ''),
                'discount' => number_format($discount, 2, '.', ''),
                'total' => number_format($total, 2, '.', ''),
                'notes' => $payload['notes'] ?? null,
            ]);

            $order->items()->createMany($orderItemsPayload);

            return $order->load(['user', 'items.product']);
        });
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);

        return $order->fresh(['user', 'items.product']);
    }

    public function cancel(Order $order): Order
    {
        if (in_array($order->status, [Order::STATUS_COMPLETED, Order::STATUS_CANCELLED], true)) {
            throw new RuntimeException('No se puede cancelar un pedido completado o ya cancelado.');
        }

        $order->update(['status' => Order::STATUS_CANCELLED]);

        return $order->fresh(['user', 'items.product']);
    }

    private function calculateDiscount(float $subtotal, array $payload): float
    {
        return 0.0;
    }

    private function generateUniqueOrderNumber(): string
    {
        do {
            $orderNumber = 'ORD-'.now()->format('Ymd').'-'.str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}
