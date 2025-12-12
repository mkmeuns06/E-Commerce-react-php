<?php
declare(strict_types=1);

namespace Mini\Models;

use Mini\Core\Database;
use PDO;

/**
 * Classe Cart - Gestion du panier en session
 */
class Cart
{
    /**
     * Initialiser le panier en session
     */
    private static function init(): void
    {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
    }

    /**
     * Ajouter un produit au panier
     */
    public static function add(int $productId, int $quantity = 1): bool
    {
        self::init();
        
        // Vérifier que le produit existe
        $product = Product::findById($productId);
        if (!$product) {
            return false;
        }
        
        // Calculer la nouvelle quantité
        $currentQty = $_SESSION['cart'][$productId] ?? 0;
        $newQty = $currentQty + $quantity;
        
        // Vérifier le stock
        if (!Product::isAvailable($productId, $newQty)) {
            return false;
        }
        
        // Ajouter au panier
        $_SESSION['cart'][$productId] = $newQty;
        return true;
    }

    /**
     * Mettre à jour la quantité d'un produit
     */
    public static function update(int $productId, int $quantity): bool
    {
        self::init();
        
        if ($quantity <= 0) {
            return self::remove($productId);
        }
        
        // Vérifier le stock
        if (!Product::isAvailable($productId, $quantity)) {
            return false;
        }
        
        $_SESSION['cart'][$productId] = $quantity;
        return true;
    }

    /**
     * Supprimer un produit du panier
     */
    public static function remove(int $productId): bool
    {
        self::init();
        
        if (isset($_SESSION['cart'][$productId])) {
            unset($_SESSION['cart'][$productId]);
            return true;
        }
        
        return false;
    }

    /**
     * Vider le panier
     */
    public static function clear(): void
    {
        $_SESSION['cart'] = [];
    }

    /**
     * Obtenir le contenu du panier avec les détails des produits
     */
    public static function getContents(): array
    {
        self::init();
        
        $cartDetails = [];
        $cart = $_SESSION['cart'];
        
        foreach ($cart as $productId => $quantity) {
            $product = Product::findById((int)$productId);
            
            if ($product) {
                $subtotal = $product['prix'] * $quantity;
                
                $cartDetails[] = [
                    'product_id' => $productId,
                    'product' => $product,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal
                ];
            }
        }
        
        return $cartDetails;
    }

    /**
     * Calculer le total du panier
     */
    public static function getTotal(): float
    {
        $contents = self::getContents();
        $total = 0;
        
        foreach ($contents as $item) {
            $total += $item['subtotal'];
        }
        
        return $total;
    }

    /**
     * Compter le nombre d'articles dans le panier
     */
    public static function count(): int
    {
        self::init();
        return count($_SESSION['cart']);
    }

    /**
     * Compter le nombre total d'items (quantités cumulées)
     */
    public static function countItems(): int
    {
        self::init();
        
        $total = 0;
        foreach ($_SESSION['cart'] as $quantity) {
            $total += $quantity;
        }
        
        return $total;
    }

    /**
     * Vérifier si le panier est vide
     */
    public static function isEmpty(): bool
    {
        self::init();
        return empty($_SESSION['cart']);
    }

    /**
     * Vérifier si un produit est dans le panier
     */
    public static function has(int $productId): bool
    {
        self::init();
        return isset($_SESSION['cart'][$productId]);
    }

    /**
     * Obtenir la quantité d'un produit dans le panier
     */
    public static function getQuantity(int $productId): int
    {
        self::init();
        return $_SESSION['cart'][$productId] ?? 0;
    }

    /**
     * Valider le stock de tous les produits du panier
     */
    public static function validateStock(): array
    {
        self::init();
        
        $errors = [];
        
        foreach ($_SESSION['cart'] as $productId => $quantity) {
            $product = Product::findById((int)$productId);
            
            if (!$product) {
                $errors[] = "Un produit du panier n'existe plus.";
                self::remove((int)$productId);
                continue;
            }
            
            if (!Product::isAvailable((int)$productId, $quantity)) {
                $errors[] = "Stock insuffisant pour : " . $product['nom'];
            }
        }
        
        return $errors;
    }

    /**
     * Préparer les items du panier pour une commande
     */
    public static function prepareForOrder(): array
    {
        $contents = self::getContents();
        $orderItems = [];
        
        foreach ($contents as $item) {
            $orderItems[] = [
                'product_id' => $item['product_id'],
                'quantite' => $item['quantity'],
                'prix' => $item['product']['prix']
            ];
        }
        
        return $orderItems;
    }

    /**
     * Obtenir un résumé du panier (pour affichage rapide)
     */
    public static function getSummary(): array
    {
        return [
            'count' => self::count(),
            'items' => self::countItems(),
            'total' => self::getTotal(),
            'isEmpty' => self::isEmpty()
        ];
    }
}