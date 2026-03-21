<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $products = Product::query()
            ->when(
                ! ($user?->isAdmin()),
                fn ($query) => $query->where('is_available', true),
            )
            ->when(
                $user?->isAdmin() && $request->filled('is_available'),
                fn ($query) => $query->where('is_available', filter_var($request->string('is_available')->value(), FILTER_VALIDATE_BOOL)),
            )
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return $this->successResponse('Productos obtenidos correctamente.', ProductResource::collection($products));
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::query()->create($request->validated());

        return $this->successResponse('Producto creado correctamente.', new ProductResource($product), 201);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        if (! $request->user()?->isAdmin() && ! $product->is_available) {
            return $this->errorResponse('Producto no disponible.', 404);
        }

        return $this->successResponse('Producto obtenido correctamente.', new ProductResource($product));
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        return $this->successResponse('Producto actualizado correctamente.', new ProductResource($product->fresh()));
    }

    public function destroy(Product $product): JsonResponse
    {
        if ($product->orderItems()->exists()) {
            $product->update(['is_available' => false]);

            return $this->errorResponse(
                'El producto tiene historial de pedidos y fue marcado como no disponible en lugar de eliminarse.',
                409,
            );
        }

        $product->delete();

        return $this->successResponse('Producto eliminado correctamente.', null, 200);
    }

    public function updateAvailability(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'is_available' => ['required', 'boolean'],
        ]);

        $product->update(['is_available' => $validated['is_available']]);

        return $this->successResponse('Disponibilidad del producto actualizada.', new ProductResource($product->fresh()));
    }
}
