<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $promotion = Promotion::query()->create([
            'name' => 'Combo Familiar 2+1',
            'description' => 'Lleva 3 rolls por precio especial para compartir.',
            'original_price' => 22990.00,
            'promo_price' => 19990.00,
            'image' => 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
            'is_active' => true,
        ]);

        $products = Product::query()->limit(2)->pluck('id');

        $pivotData = $products
            ->mapWithKeys(static fn (int $productId): array => [$productId => ['quantity' => 1]])
            ->all();

        $promotion->products()->sync($pivotData);
    }
}
