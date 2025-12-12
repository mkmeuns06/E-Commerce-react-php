<?php
declare(strict_types=1);

namespace Mini\Controllers\Api;

use Mini\Core\ApiController;
use Mini\Models\Cart;

final class CartApiController extends ApiController
{
    /**
     * GET /api/cart
     */
    public function index(): void
    {
        $cartDetails = Cart::getContents();
        $total = Cart::getTotal();
        
        $this->success([
            'items' => $cartDetails,
            'total' => $total,
            'count' => Cart::count()
        ]);
    }

    /**
     * POST /api/cart/add
     * Body: {"product_id": 1, "quantity": 1}
     */
    public function add(): void
    {
        $data = $this->getJsonBody();
        
        $productId = $data['product_id'] ?? null;
        $quantity = $data['quantity'] ?? 1;
        
        if (!$productId) {
            $this->error('ID produit manquant', 400);
        }
        
        if (Cart::add((int)$productId, (int)$quantity)) {
            $this->success(Cart::getSummary(), 'Produit ajouté au panier');
        } else {
            $this->error('Impossible d\'ajouter le produit (stock insuffisant)', 400);
        }
    }

    /**
     * POST /api/cart/update
     * Body: {"product_id": 1, "quantity": 2}
     */
    public function update(): void
    {
        $data = $this->getJsonBody();
        
        $productId = $data['product_id'] ?? null;
        $quantity = $data['quantity'] ?? 0;
        
        if (!$productId) {
            $this->error('ID produit manquant', 400);
        }
        
        if (Cart::update((int)$productId, (int)$quantity)) {
            $this->success(Cart::getSummary(), 'Panier mis à jour');
        } else {
            $this->error('Erreur lors de la mise à jour', 400);
        }
    }

    /**
     * POST /api/cart/remove
     * Body: {"product_id": 1}
     */
    public function remove(): void
    {
        $data = $this->getJsonBody();
        
        $productId = $data['product_id'] ?? null;
        
        if (!$productId) {
            $this->error('ID produit manquant', 400);
        }
        
        if (Cart::remove((int)$productId)) {
            $this->success(Cart::getSummary(), 'Produit retiré du panier');
        } else {
            $this->error('Produit non trouvé dans le panier', 404);
        }
    }

    /**
     * POST /api/cart/clear
     */
    public function clear(): void
    {
        Cart::clear();
        $this->success(null, 'Panier vidé');
    }
}