<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define main categories
        $mainCategories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic devices, gadgets, and accessories',
                'image' => 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                'subcategories' => [
                    'Smartphones',
                    'Laptops',
                    'Audio',
                    'Cameras',
                    'Accessories'
                ]
            ],
            [
                'name' => 'Clothing',
                'description' => 'Apparel and fashion items',
                'image' => 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                'subcategories' => [
                    'Men',
                    'Women',
                    'Kids',
                    'Activewear',
                    'Shoes',
                    'Accessories'
                ]
            ],
            [
                'name' => 'Home & Kitchen',
                'description' => 'Items for your home and kitchen',
                'image' => 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                'subcategories' => [
                    'Furniture',
                    'Kitchen Appliances',
                    'Cookware',
                    'Decor',
                    'Bedding',
                    'Bath'
                ]
            ],
            [
                'name' => 'Books',
                'description' => 'Books across various genres',
                'image' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                'subcategories' => [
                    'Fiction',
                    'Non-fiction',
                    'Educational',
                    'Children',
                    'Comics',
                    'Self-help'
                ]
            ],
            [
                'name' => 'Beauty & Health',
                'description' => 'Beauty products and health essentials',
                'image' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                'subcategories' => [
                    'Skincare',
                    'Haircare',
                    'Makeup',
                    'Personal Care',
                    'Vitamins & Supplements'
                ]
            ]
        ];

        // Create main categories and their subcategories
        foreach ($mainCategories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
                'description' => $categoryData['description'],
                'image' => $categoryData['image'],
                'is_active' => true
            ]);

            // Create subcategories
            foreach ($categoryData['subcategories'] as $subName) {
                // Create unique slug by combining parent category and subcategory names
                $uniqueSlug = Str::slug($categoryData['name'] . '-' . $subName);

                Category::create([
                    'name' => $subName,
                    'slug' => $uniqueSlug, // Use the parent-prefixed slug to ensure uniqueness
                    'description' => "Subcategory of {$categoryData['name']}",
                    'parent_id' => $category->id,
                    'is_active' => true
                ]);
            }
        }

        $this->command->info('Categories and subcategories created successfully!');
    }
}
