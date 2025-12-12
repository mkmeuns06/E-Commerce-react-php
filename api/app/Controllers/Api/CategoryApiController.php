<?php
declare(strict_types=1);

namespace Mini\Controllers\Api;

use Mini\Core\ApiController;
use Mini\Models\Category;

final class CategoryApiController extends ApiController
{
    /**
     * GET /api/categories
     */
    public function index(): void
    {
        $categories = Category::findAll();
        $this->success($categories);
    }

    /**
     * GET /api/categories/show?id=X
     */
    public function show(): void
    {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            $this->error('ID catégorie manquant', 400);
        }
        
        $category = Category::findById((int)$id);
        
        if (!$category) {
            $this->error('Catégorie introuvable', 404);
        }
        
        $this->success($category);
    }
}