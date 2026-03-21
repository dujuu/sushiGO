<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly OrderService $orderService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->with(['items.product', 'user'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->value()))
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return $this->successResponse('Pedidos obtenidos correctamente.', OrderResource::collection($orders));
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        try {
            $order = $this->orderService->createOrder($request->user()?->id, $request->validated());

            return $this->successResponse('Pedido creado correctamente.', new OrderResource($order), 201);
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), 422);
        }
    }

    public function publicStatus(Order $order): JsonResponse
    {
        return $this->successResponse('Estado del pedido obtenido correctamente.', [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'updated_at' => $order->updated_at,
        ]);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        return $this->successResponse('Pedido obtenido correctamente.', new OrderResource($order->load(['items.product', 'user'])));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        try {
            $updatedOrder = $this->orderService->updateStatus($order, $request->validated('status'));

            return $this->successResponse('Estado del pedido actualizado correctamente.', new OrderResource($updatedOrder));
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), 422);
        }
    }

    public function cancel(Request $request, Order $order): JsonResponse
    {
        try {
            $cancelledOrder = $this->orderService->cancel($order);

            return $this->successResponse('Pedido cancelado correctamente.', new OrderResource($cancelledOrder));
        } catch (RuntimeException $exception) {
            return $this->errorResponse($exception->getMessage(), 422);
        }
    }
}
