<?php

namespace Mini\Models;

use Mini\Core\Database;
use PDO;

class Category
{
    /**
     * Récupérer toutes les catégories
     */
    public static function findAll()
    {
        $pdo = Database::getPDO();
        $sql = "SELECT * FROM categories ORDER BY nom ASC";
        
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Récupérer une catégorie par son ID
     */
    public static function findById($id)
    {
        $pdo = Database::getPDO();
        $sql = "SELECT * FROM categories WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Créer une nouvelle catégorie
     */
    public static function create($nom, $description = null)
    {
        $pdo = Database::getPDO();
        $sql = "INSERT INTO categories (nom, description) 
                VALUES (:nom, :description) 
                RETURNING id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'nom' => $nom,
            'description' => $description
        ]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC)['id'];
    }

    /**
     * Compter le nombre de produits par catégorie
     */
    public static function getProductCount($categoryId)
    {
        $pdo = Database::getPDO();
        $sql = "SELECT COUNT(*) as count FROM products WHERE category_id = :category_id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['category_id' => $categoryId]);
        return $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    }
}