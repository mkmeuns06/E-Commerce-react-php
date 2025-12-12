<?php
declare(strict_types=1);

namespace Mini\Models;

use Mini\Core\Database;
use PDO;

class Product
{
    /**
     * Récupérer tous les produits actifs avec leurs catégories
     */
    public static function findAll(): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT p.*, c.nom as categorie_nom 
                FROM produits p
                LEFT JOIN categories c ON p.categorie_id = c.id
                WHERE p.actif = TRUE
                ORDER BY p.date_creation DESC";
        
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Récupérer un produit par son ID
     */
    public static function findById(int $id): array|false
    {
        $pdo = Database::getPDO();
        $sql = "SELECT p.*, c.nom as categorie_nom 
                FROM produits p
                LEFT JOIN categories c ON p.categorie_id = c.id
                WHERE p.id = :id AND p.actif = TRUE";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Récupérer les produits par catégorie
     */
    public static function findByCategory(int $categoryId): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT p.*, c.nom as categorie_nom 
                FROM produits p
                LEFT JOIN categories c ON p.categorie_id = c.id
                WHERE p.categorie_id = :categorie_id AND p.actif = TRUE
                ORDER BY p.nom ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['categorie_id' => $categoryId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Rechercher des produits par nom
     */
    public static function search(string $keyword): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT p.*, c.nom as categorie_nom 
                FROM produits p
                LEFT JOIN categories c ON p.categorie_id = c.id
                WHERE (p.nom ILIKE :keyword OR p.description ILIKE :keyword) 
                AND p.actif = TRUE
                ORDER BY p.nom ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['keyword' => '%' . $keyword . '%']);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Récupérer les produits en stock
     */
    public static function findInStock(): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT p.*, c.nom as categorie_nom 
                FROM produits p
                LEFT JOIN categories c ON p.categorie_id = c.id
                WHERE p.stock > 0 AND p.actif = TRUE
                ORDER BY p.date_creation DESC";
        
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Mettre à jour le stock d'un produit
     */
    public static function updateStock(int $id, int $quantity): bool
    {
        $pdo = Database::getPDO();
        $sql = "UPDATE produits SET stock = stock - :quantity WHERE id = :id AND stock >= :quantity";
        
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([
            'quantity' => $quantity,
            'id' => $id
        ]);
    }

    /**
     * Vérifier la disponibilité d'un produit
     */
    public static function isAvailable(int $id, int $quantity): bool
    {
        $pdo = Database::getPDO();
        $sql = "SELECT stock FROM produits WHERE id = :id AND actif = TRUE";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $product && $product['stock'] >= $quantity;
    }

    /**
     * Récupérer les derniers produits ajoutés
     */
    public static function getLatest(int $limit = 8): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT p.*, c.nom as categorie_nom 
                FROM produits p
                LEFT JOIN categories c ON p.categorie_id = c.id
                WHERE p.actif = TRUE
                ORDER BY p.date_creation DESC
                LIMIT :limit";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Créer un nouveau produit
     */
    public static function create(array $data): int
    {
        $pdo = Database::getPDO();
        $sql = "INSERT INTO produits (nom, description, prix, stock, categorie_id, image_url, actif) 
                VALUES (:nom, :description, :prix, :stock, :categorie_id, :image_url, :actif) 
                RETURNING id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($data);
        
        return $stmt->fetch(PDO::FETCH_ASSOC)['id'];
    }
}