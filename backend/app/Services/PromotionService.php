<?php

namespace App\Services;

use App\Models\Promotion;

class PromotionService
{
    public function syncProducts(Promotion $promotion, array $products): void
    {
        $pivotData = collect($products)
            ->keyBy(static fn (array $item): int => (int) $item['product_id'])
            ->map(static fn (array $item): array => ['quantity' => (int) $item['quantity']])
            ->all();

        $promotion->products()->sync($pivotData);
    }
}
