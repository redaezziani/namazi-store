<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'original_price',
        'discount',
        'currency',
        'rating',
        'shipping',
        'colors',
        'sizes',
        'quantity',
        'sku',
        'cover_image',
        'preview_images',
        'type',
        'is_featured',
        'is_active',
        'category_id',
    ];


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'colors' => 'array',
        'sizes' => 'array',
        'preview_images' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'float',
        'original_price' => 'float',
        'rating' => 'integer',
        'quantity' => 'integer',
    ];


    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the discounts for the product.
     */
    public function discounts()
    {
        return $this->belongsToMany(Discount::class);
    }

    /**
     * Get the users who favorited this product.
     */
    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    /**
     * Get the order items for the product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
