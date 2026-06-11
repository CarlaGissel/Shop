<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_order(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $category = Category::create([
            'name' => 'Camisetas',
            'slug' => 'camisetas',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Camiseta Essential',
            'slug' => 'camiseta-essential',
            'price' => 19.90,
            'stock' => 10,
            'sizes' => ['S', 'M'],
            'colors' => ['Blanco'],
        ]);

        $response = $this->postJson('/api/orders', [
            'customer' => [
                'name' => 'Cliente Demo',
                'email' => 'cliente@example.com',
                'phone' => '0991000000',
            ],
            'shipping_address' => [
                'line1' => 'Av. Principal 123',
                'city' => 'Asuncion',
                'country' => 'Paraguay',
            ],
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'size' => 'M',
                    'color' => 'Blanco',
                ],
            ],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.total', '39.80')
            ->assertJsonPath('data.items.0.product_name', 'Camiseta Essential');

        $this->assertSame(8, $product->fresh()->stock);
    }
}
