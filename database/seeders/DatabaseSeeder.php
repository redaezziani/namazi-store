<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Run CategorySeeder first since Products depend on Categories
            CategorySeeder::class,
            ProductSeeder::class,
            // Add other seeders here
        ]);
    }
}
