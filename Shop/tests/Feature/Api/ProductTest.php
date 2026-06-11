<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_can_be_listed(): void
    {
        $category = Category::create([
            'name' => 'Camisetas',
            'slug' => 'camisetas',
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Camiseta Essential',
            'slug' => 'camiseta-essential',
            'price' => 19.90,
            'stock' => 10,
            'sizes' => ['S', 'M'],
            'colors' => ['Blanco'],
        ]);

        $response = $this->getJson('/api/products');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Camiseta Essential')
            ->assertJsonPath('data.0.category.slug', 'camisetas');
    }
}
