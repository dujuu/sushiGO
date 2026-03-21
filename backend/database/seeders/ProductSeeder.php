<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::query()->insert([
            [
                'name' => 'Spicy Tuna Roll',
                'description' => 'Atún, mayo spicy y pepino · 8 piezas.',
                'price' => 6990.00,
                'image' => 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=900&q=80&fit=crop',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ebi Tempura Roll',
                'description' => 'Camarón apanado, palta y tobiko · 8 piezas.',
                'price' => 7490.00,
                'image' => 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dragon Roll',
                'description' => 'Salmón, palta y salsa anguila · 8 piezas.',
                'price' => 8490.00,
                'image' => 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=900&q=80&fit=crop',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
