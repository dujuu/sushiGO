<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin SushiGo',
            'email' => 'admin@sushigo.local',
            'role' => User::ROLE_ADMIN,
        ]);

        User::factory()->create([
            'name' => 'Cliente Demo',
            'email' => 'cliente@sushigo.local',
            'role' => User::ROLE_CUSTOMER,
        ]);

        $this->call([
            ProductSeeder::class,
            PromotionSeeder::class,
        ]);
    }
}
