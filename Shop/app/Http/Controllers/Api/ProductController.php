<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category' => ['nullable', 'string', 'exists:categories,slug'],
            'gender' => ['nullable', 'in:hombre,mujer'],
            'search' => ['nullable', 'string', 'max:120'],
            'sort' => ['nullable', 'in:newest,price_asc,price_desc'],
        ]);

        $products = Product::query()
            ->with('category:id,name,slug')
            ->where('is_active', true)
            ->when($data['category'] ?? null, fn ($query, $slug) => $query->whereRelation('category', 'slug', $slug))
            // Una sección de género incluye las prendas unisex.
            ->when($data['gender'] ?? null, fn ($query, $gender) => $query->whereIn('gender', [$gender, 'unisex']))
            ->when($data['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when(($data['sort'] ?? 'newest') === 'price_asc', fn ($query) => $query->orderBy('price'))
            ->when(($data['sort'] ?? 'newest') === 'price_desc', fn ($query) => $query->orderByDesc('price'))
            ->when(($data['sort'] ?? 'newest') === 'newest', fn ($query) => $query->latest())
            ->paginate(12);

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        abort_unless($product->is_active, 404);

        return response()->json([
            'data' => $product->load('category:id,name,slug'),
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        $products = Product::query()
            ->with('category:id,name,slug')
            ->latest()
            ->paginate(20);

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id'  => ['required', 'integer', 'exists:categories,id'],
            'gender'       => ['required', 'in:hombre,mujer,unisex'],
            'name'         => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'price'        => ['required', 'numeric', 'min:0'],
            'stock'        => ['required', 'integer', 'min:0'],
            'image_url'    => ['nullable', 'url', 'max:500'],
            'is_active'    => ['boolean'],
        ]);

        $data['slug'] = Str::slug($data['name']);

        $product = Product::create($data);

        return response()->json(['data' => $product], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'category_id'  => ['sometimes', 'integer', 'exists:categories,id'],
            'gender'       => ['sometimes', 'in:hombre,mujer,unisex'],
            'name'         => ['sometimes', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'price'        => ['sometimes', 'numeric', 'min:0'],
            'stock'        => ['sometimes', 'integer', 'min:0'],
            'image_url'    => ['nullable', 'url', 'max:500'],
            'is_active'    => ['boolean'],
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $product->update($data);

        return response()->json(['data' => $product]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->update(['is_active' => false]);

        return response()->json(['message' => 'Producto desactivado.']);
    }
}
