<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'original_price',
        'promo_price',
        'image',
        'is_active',
    ];

    protected $casts = [
        'original_price' => 'decimal:2',
        'promo_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'promotion_product')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function isRealPromotion(): bool
    {
        $promoPrice = (float) $this->promo_price;

        if ($this->original_price !== null) {
            return $promoPrice < (float) $this->original_price;
        }

        if ($this->relationLoaded('products') && $this->products->isNotEmpty()) {
            $calculatedOriginalPrice = $this->products->sum(
                fn (Product $product) => (float) $product->price * max(1, (int) ($product->pivot->quantity ?? 1)),
            );

            return $promoPrice < (float) $calculatedOriginalPrice;
        }

        return false;
    }
}
