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
        $this->createProduct();
    }

    /**
     * Create a single product with specified attributes
     * 
     * @param array $attributes Custom attributes for the product
     * @return Product
     */
    public function createProduct(array $attributes = []): Product
    {
        $faker = Faker::create();
        
        // Default values
        $defaultCategory = Category::first() ?? Category::factory()->create();
        $type = 'General';
        
        // Find the main category if category_id is provided
        if (isset($attributes['category_id'])) {
            $category = Category::find($attributes['category_id']);
            if ($category) {
                $mainCategory = $category->parent_id ? Category::find($category->parent_id) : $category;
                $type = $attributes['type'] ?? $faker->randomElement([
                    'Clothing' => ['T-Shirt', 'Jeans', 'Jacket', 'Dress', 'Sweater', 'Shorts'],
                ][$mainCategory->name] ?? ['General'])[0];
            }
        }
        
        // Set default name if not provided
        if (!isset($attributes['name'])) {
            $name = $faker->words(3, true) . ' ' . $type;
            $attributes['name'] = ucwords($name);
        }
        
        // Create product with default values that can be overridden by provided attributes
        $productData = array_merge([
            'name' => "Take Whats Mine Crossover Denim Jorts - Vintage Wash" ?? ucwords($faker->words(3, true) . ' ' . $type),
            'slug' => $attributes['slug'] ?? Str::slug($attributes['name'] ?? ucwords($faker->words(3, true) . ' ' . $type)),
            'description' => $faker->paragraphs(3, true),
            'price' => $faker->randomFloat(2, 9.99, 999.99),
            'colors' => ['#0C2340', '#1E3F66', '#000000', '#4A4A4A', '#857E7B', '#D8C0A8'],
            'sizes' => ['M', 'L', 'XL'],
            'quantity' => $faker->numberBetween(1, 100),
            'sku' => strtoupper(Str::random(8)),
            'cover_image' => "https://cdn.shopify.com/s/files/1/0293/9277/files/01-11-24_S3_24_FN3001HSHTJ_VintageWash_CZ_SS_11-25-38_0749_PXF.jpg",
            'preview_images' => [
                "https://cdn.shopify.com/s/files/1/0293/9277/files/01-11-24_S3_24_FN3001HSHTJ_VintageWash_CZ_SS_11-25-38_0749_PXF.jpg",
                "https://cdn.shopify.com/s/files/1/0293/9277/files/01-11-24_S3_24_FN3001HSHTJ_VintageWash_CZ_SS_11-27-54_0769_PXF.jpg",
                "https://cdn.shopify.com/s/files/1/0293/9277/files/01-11-24_S3_24_FN3001HSHTJ_VintageWash_CZ_SS_11-28-51_0771_PXF.jpg"
            ],
            'type' => $type,
            'is_featured' => false,
            'is_active' => true,
            'category_id' => $defaultCategory->id
        ], $attributes);
        
        $product = Product::create($productData);
        
        $this->command->info('Product created successfully: ' . $product->name);
        
        return $product;
    }
}
