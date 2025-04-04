<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $categories = Category::all();

        // Product type mapping
        $productTypes = [
            'Electronics' => ['Smartphone', 'Laptop', 'Headphone', 'Camera', 'Charger', 'Tablet'],
            'Clothing' => ['T-Shirt', 'Jeans', 'Jacket', 'Dress', 'Sweater', 'Shorts'],
            'Home & Kitchen' => ['Coffee Maker', 'Blender', 'Plate Set', 'Couch', 'Bed', 'Lamp'],
            'Books' => ['Hardcover', 'Paperback', 'eBook', 'Audiobook', 'Boxed Set'],
            'Beauty & Health' => ['Moisturizer', 'Shampoo', 'Vitamin', 'Serum', 'Lotion']
        ];

        // Color options
        $colors = [
            '#000000', // Black
            '#FFFFFF', // White
            '#FF0000', // Red
            '#0000FF', // Blue
            '#808080', // Gray
            '#FFC0CB', // Pink
            '#FFA500', // Orange
            '#800080', // Purple
            '#008000', // Green
            '#A52A2A', // Brown
            '#FFFF00', // Yellow
            '#00FFFF', // Cyan
            '#FF00FF', // Magenta
        ];

        // Size options by category
        $sizesByCategory = [
            'Electronics' => [], // Electronics typically don't have sizes
            'Clothing' => ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
            'Home & Kitchen' => ['Small', 'Medium', 'Large', 'One Size'],
            'Books' => [], // Books typically don't have sizes
            'Beauty & Health' => ['50ml', '100ml', '200ml', '500ml', 'One Size']
        ];

        // Create 100 products
        for ($i = 0; $i < 100; $i++) {
            // Randomly select a category
            $category = $faker->randomElement($categories);

            // Find the main category (parent)
            $mainCategory = $category->parent_id ? Category::find($category->parent_id) : $category;
            $mainCategoryName = $mainCategory->name;

            // Get appropriate types for this category
            $categoryTypes = $productTypes[$mainCategoryName] ?? ['General'];
            $type = $faker->randomElement($categoryTypes);

            // Get appropriate sizes for this category
            $availableSizes = $sizesByCategory[$mainCategoryName] ?? [];
            $sizes = [];
            if (count($availableSizes) > 0) {
                $sizeCount = $faker->numberBetween(2, count($availableSizes));
                $sizes = $faker->randomElements($availableSizes, $sizeCount);
            }

            // Random color selection (1-4 colors)
            $colorCount = $faker->numberBetween(1, 4);
            $productColors = $faker->randomElements($colors, $colorCount);

            // Random product name with the type
            $name = $faker->words(3, true) . ' ' . $type;
            $name = ucwords($name);

            // Generate a product
            $product = Product::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $faker->paragraphs(3, true),
                'price' => $faker->randomFloat(2, 9.99, 999.99),
                'colors' => $productColors,
                'sizes' => $sizes,
                'quantity' => $faker->numberBetween(0, 100),
                'sku' => strtoupper(Str::random(8)),
                'cover_image' => "https://source.unsplash.com/600x600/?{$type}",
                'preview_images' => [
                    "https://source.unsplash.com/600x600/?{$type},1",
                    "https://source.unsplash.com/600x600/?{$type},2",
                    "https://source.unsplash.com/600x600/?{$type},3"
                ],
                'type' => $type,
                'is_featured' => $faker->boolean(20), // 20% chance of being featured
                'is_active' => $faker->boolean(90), // 90% chance of being active
                'category_id' => $category->id
            ]);

            // Make some products out of stock
            if ($faker->boolean(10)) { // 10% chance
                $product->update(['quantity' => 0]);
            }

            // Make some products low in stock
            if ($faker->boolean(20)) { // 20% chance
                $product->update(['quantity' => $faker->numberBetween(1, 5)]);
            }
        }

        $this->command->info('Products seeded successfully!');
    }
}
