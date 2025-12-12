<?php
declare(strict_types=1);

namespace Mini\Models;

use Mini\Core\Database;
use PDO;

class Order
{
    /**
     * Générer un numéro de commande unique
     */
    private static function generateOrderNumber(): string
    {
        return 'CMD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }

    /**
     * Créer une nouvelle commande
     */
    public static function create(
        int $clientId,
        float $montantTotal,
        string $adresse,
        string $ville,
        string $codePostal,
        string $pays = 'France',
        string $statut = 'en_attente'
    ): int
    {
        $pdo = Database::getPDO();
        $numeroCommande = self::generateOrderNumber();
        
        $sql = "INSERT INTO commandes (
                    numero_commande, client_id, statut, montant_total,
                    adresse_livraison, ville_livraison, code_postal_livraison, pays_livraison
                ) VALUES (
                    :numero_commande, :client_id, :statut::statut_commande, :montant_total,
                    :adresse_livraison, :ville_livraison, :code_postal_livraison, :pays_livraison
                ) RETURNING id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'numero_commande' => $numeroCommande,
            'client_id' => $clientId,
            'statut' => $statut,
            'montant_total' => $montantTotal,
            'adresse_livraison' => $adresse,
            'ville_livraison' => $ville,
            'code_postal_livraison' => $codePostal,
            'pays_livraison' => $pays
        ]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC)['id'];
    }

    /**
     * Ajouter des lignes de commande
     */
    public static function addItems(int $commandeId, array $cartItems): bool
    {
        $pdo = Database::getPDO();
        $sql = "INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire, sous_total) 
                VALUES (:commande_id, :produit_id, :quantite, :prix_unitaire, :sous_total)";
        
        $stmt = $pdo->prepare($sql);
        
        foreach ($cartItems as $item) {
            $sousTotal = $item['quantite'] * $item['prix'];
            
            $stmt->execute([
                'commande_id' => $commandeId,
                'produit_id' => $item['product_id'],
                'quantite' => $item['quantite'],
                'prix_unitaire' => $item['prix'],
                'sous_total' => $sousTotal
            ]);
        }
        
        return true;
    }

    /**
     * Récupérer toutes les commandes d'un client
     */
    public static function findByClient(int $clientId): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT * FROM commandes 
                WHERE client_id = :client_id 
                ORDER BY date_commande DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['client_id' => $clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Récupérer une commande par son ID
     */
    public static function findById(int $commandeId): array|false
    {
        $pdo = Database::getPDO();
        $sql = "SELECT c.*, cl.nom as client_nom, cl.prenom as client_prenom, cl.email as client_email 
                FROM commandes c
                JOIN clients cl ON c.client_id = cl.id
                WHERE c.id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $commandeId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Récupérer les détails (lignes) d'une commande
     */
    public static function getOrderDetails(int $commandeId): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT lc.*, p.nom as produit_nom, p.image_url, p.description
                FROM lignes_commande lc
                JOIN produits p ON lc.produit_id = p.id
                WHERE lc.commande_id = :commande_id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['commande_id' => $commandeId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Mettre à jour le statut d'une commande
     */
    public static function updateStatus(int $commandeId, string $statut): bool
    {
        $pdo = Database::getPDO();
        $sql = "UPDATE commandes SET statut = :statut::statut_commande WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([
            'statut' => $statut,
            'id' => $commandeId
        ]);
    }

    /**
     * Récupérer toutes les commandes (admin)
     */
    public static function findAll(): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT c.*, cl.nom as client_nom, cl.prenom as client_prenom, cl.email as client_email 
                FROM commandes c
                JOIN clients cl ON c.client_id = cl.id
                ORDER BY c.date_commande DESC";
        
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Calculer le total d'une commande depuis les lignes
     */
    public static function calculateTotal(int $commandeId): float
    {
        $pdo = Database::getPDO();
        $sql = "SELECT SUM(sous_total) as total 
                FROM lignes_commande 
                WHERE commande_id = :commande_id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['commande_id' => $commandeId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return (float)($result['total'] ?? 0);
    }

    /**
     * Traduire le statut en français
     */
    public static function getStatutLabel(string $statut): string
    {
        $labels = [
            'en_attente' => 'En attente',
            'payee' => 'Payée',
            'expediee' => 'Expédiée',
            'livree' => 'Livrée',
            'annulee' => 'Annulée'
        ];
        
        return $labels[$statut] ?? $statut;
    }
}