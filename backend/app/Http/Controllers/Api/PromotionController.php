<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePromotionRequest;
use App\Http\Requests\UpdatePromotionRequest;
use App\Http\Resources\PromotionResource;
use App\Models\Promotion;
use App\Services\PromotionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly PromotionService $promotionService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $promotions = Promotion::query()
            ->with('products')
            ->when(
                ! ($user?->isAdmin()),
                fn ($query) => $query->where('is_active', true),
            )
            ->when(
                $user?->isAdmin() && $request->filled('is_active'),
                fn ($query) => $query->where('is_active', filter_var($request->string('is_active')->value(), FILTER_VALIDATE_BOOL)),
            )
            ->latest('id')
            ->paginate((int) $request->integer('per_page', 15));

        return $this->successResponse('Promociones obtenidas correctamente.', PromotionResource::collection($promotions));
    }

    public function store(StorePromotionRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $products = $payload['products'] ?? [];
        unset($payload['products']);

        $promotion = Promotion::query()->create($payload);

        if (! empty($products)) {
            $this->promotionService->syncProducts($promotion, $products);
        }

        return $this->successResponse(
            'Promoción creada correctamente.',
            new PromotionResource($promotion->load('products')),
            201,
        );
    }

    public function show(Request $request, Promotion $promotion): JsonResponse
    {
        if (! $request->user()?->isAdmin() && ! $promotion->is_active) {
            return $this->errorResponse('Promoción no disponible.', 404);
        }

        return $this->successResponse('Promoción obtenida correctamente.', new PromotionResource($promotion->load('products')));
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion): JsonResponse
    {
        $payload = $request->validated();

        if (array_key_exists('products', $payload)) {
            $products = $payload['products'];
            unset($payload['products']);
            $this->promotionService->syncProducts($promotion, $products);
        }

        $promotion->update($payload);

        return $this->successResponse(
            'Promoción actualizada correctamente.',
            new PromotionResource($promotion->fresh()->load('products')),
        );
    }

    public function destroy(Promotion $promotion): JsonResponse
    {
        $promotion->delete();

        return $this->successResponse('Promoción eliminada correctamente.');
    }

    public function updateActivation(Request $request, Promotion $promotion): JsonResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $promotion->update(['is_active' => $validated['is_active']]);

        return $this->successResponse(
            'Estado de promoción actualizado correctamente.',
            new PromotionResource($promotion->fresh()->load('products')),
        );
    }

    public function syncProducts(Request $request, Promotion $promotion): JsonResponse
    {
        $validated = $request->validate([
            'products' => ['required', 'array'],
            'products.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $this->promotionService->syncProducts($promotion, $validated['products']);

        return $this->successResponse(
            'Productos de la promoción sincronizados correctamente.',
            new PromotionResource($promotion->fresh()->load('products')),
        );
    }
}
