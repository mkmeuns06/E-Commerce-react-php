<?php
declare(strict_types=1);

namespace Mini\Controllers\Api;

use Mini\Core\ApiController;
use Mini\Models\Order;
use Mini\Models\Cart;
use Mini\Models\Product;

final class OrderApiController extends ApiController
{
    /**
     * POST /api/orders/create
     * Body: {"adresse": "...", "ville": "...", "code_postal": "...", "pays": "France"}
     */
    public function create(): void
    {
        // Vérifier l'authentification
        if (!isset($_SESSION['client'])) {
            $this->error('Non authentifié', 401);
        }
        
        // Vérifier que le panier n'est pas vide
        if (Cart::isEmpty()) {
            $this->error('Panier vide', 400);
        }
        
        $data = $this->getJsonBody();
        $client = $_SESSION['client'];
        
        // Récupérer l'adresse de livraison
        $adresse = $data['adresse'] ?? $client['adresse'];
        $ville = $data['ville'] ?? $client['ville'];
        $codePostal = $data['code_postal'] ?? $client['code_postal'];
        $pays = $data['pays'] ?? $client['pays'] ?? 'France';
        
        // Valider le stock avant de créer la commande
        $errors = Cart::validateStock();
        if (!empty($errors)) {
            $this->error(implode(', ', $errors), 400);
        }
        
        try {
            $total = Cart::getTotal();
            $cartItems = Cart::prepareForOrder();
            
            // Créer la commande
            $commandeId = Order::create(
                $client['id'],
                $total,
                $adresse,
                $ville,
                $codePostal,
                $pays
            );
            
            // Ajouter les lignes de commande
            Order::addItems($commandeId, $cartItems);
            
            // Mettre à jour les stocks
            foreach ($cartItems as $item) {
                Product::updateStock($item['product_id'], $item['quantite']);
            }
            
            // Vider le panier
            Cart::clear();
            
            // Récupérer la commande créée
            $order = Order::findById($commandeId);
            $this->success($order, 'Commande créée avec succès', 201);
            
        } catch (\Exception $e) {
            $this->error('Erreur lors de la création de la commande: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/orders/history
     */
    public function history(): void
    {
        if (!isset($_SESSION['client'])) {
            $this->error('Non authentifié', 401);
        }
        
        $orders = Order::findByClient($_SESSION['client']['id']);
        $this->success($orders);
    }

    /**
     * GET /api/orders/show?id=X
     */
    public function show(): void
    {
        if (!isset($_SESSION['client'])) {
            $this->error('Non authentifié', 401);
        }
        
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            $this->error('ID commande manquant', 400);
        }
        
        $order = Order::findById((int)$id);
        
        if (!$order || $order['client_id'] != $_SESSION['client']['id']) {
            $this->error('Commande introuvable', 404);
        }
        
        $orderDetails = Order::getOrderDetails((int)$id);
        
        $this->success([
            'order' => $order,
            'items' => $orderDetails
        ]);
    }
}