<?php
declare(strict_types=1);

namespace Mini\Controllers\Api;

use Mini\Core\ApiController;
use Mini\Models\Product;

final class ProductApiController extends ApiController
{
    /**
     * GET /api/products
     * GET /api/products?category=X
     */
    public function index(): void
    {
        $categoryId = $_GET['category'] ?? null;
        
        if ($categoryId) {
            $products = Product::findByCategory((int)$categoryId);
        } else {
            $products = Product::findAll();
        }
        
        $this->success($products);
    }

    /**
     * GET /api/products/show?id=X
     */
    public function show(): void
    {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            $this->error('ID produit manquant', 400);
        }
        
        $product = Product::findById((int)$id);
        
        if (!$product) {
            $this->error('Produit introuvable', 404);
        }
        
        $this->success($product);
    }

    /**
     * GET /api/products/search?q=keyword
     */
    public function search(): void
    {
        $keyword = $_GET['q'] ?? '';
        
        if (empty($keyword)) {
            $this->error('Mot-clé manquant', 400);
        }
        
        $products = Product::search($keyword);
        $this->success($products);
    }

    /**
     * GET /api/products/latest?limit=8
     */
    public function latest(): void
    {
        $limit = $_GET['limit'] ?? 8;
        $products = Product::getLatest((int)$limit);
        $this->success($products);
    }
}