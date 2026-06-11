<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
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
            'name' => 'Admin',
            'email' => 'admin@shop.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Cliente Test',
            'email' => 'cliente@shop.com',
            'password' => 'password',
            'role' => 'customer',
        ]);

        $categories = collect([
            ['name' => 'Camisetas', 'slug' => 'camisetas', 'description' => 'Prendas basicas y estampadas para uso diario.'],
            ['name' => 'Pantalones', 'slug' => 'pantalones', 'description' => 'Jeans, joggers y pantalones casuales.'],
            ['name' => 'Abrigos', 'slug' => 'abrigos', 'description' => 'Camperas, hoodies y prendas para clima fresco.'],
            ['name' => 'Accesorios', 'slug' => 'accesorios', 'description' => 'Gorras, bolsos y complementos.'],
        ])->mapWithKeys(fn (array $category) => [
            $category['slug'] => Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            ),
        ]);

        collect([
            [
                'category_id' => $categories['camisetas']->id,
                'name' => 'Camiseta Essential Blanca',
                'slug' => 'camiseta-essential-blanca',
                'description' => 'Camiseta de algodon suave con corte regular.',
                'price' => 19.90,
                'stock' => 25,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Blanco', 'Negro'],
                'image_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            ],
            [
                'category_id' => $categories['pantalones']->id,
                'name' => 'Jean Recto Azul',
                'slug' => 'jean-recto-azul',
                'description' => 'Jean clasico de tiro medio con lavado azul.',
                'price' => 49.90,
                'stock' => 18,
                'sizes' => ['38', '40', '42', '44'],
                'colors' => ['Azul'],
                'image_url' => 'https://images.unsplash.com/photo-1542272604-787c3835535d',
            ],
            [
                'category_id' => $categories['abrigos']->id,
                'name' => 'Hoodie Urbano Gris',
                'slug' => 'hoodie-urbano-gris',
                'description' => 'Buzo con capucha, bolsillo frontal y interior afelpado.',
                'price' => 39.90,
                'stock' => 20,
                'sizes' => ['S', 'M', 'L'],
                'colors' => ['Gris', 'Verde'],
                'image_url' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
            ],
            [
                'category_id' => $categories['accesorios']->id,
                'name' => 'Gorra Minimal Negra',
                'slug' => 'gorra-minimal-negra',
                'description' => 'Gorra ajustable de algodon con logo discreto.',
                'price' => 14.90,
                'stock' => 30,
                'sizes' => ['Unica'],
                'colors' => ['Negro'],
                'image_url' => 'https://images.unsplash.com/photo-1521369909029-2afed882baee',
            ],
        ])->each(fn (array $product) => Product::query()->updateOrCreate(
            ['slug' => $product['slug']],
            $product,
        ));
    }
}
