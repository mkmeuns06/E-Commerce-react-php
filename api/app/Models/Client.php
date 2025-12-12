<?php
declare(strict_types=1);

namespace Mini\Models;

use Mini\Core\Database;
use PDO;

class Client
{
    /**
     * Trouver un client par email
     */
    public static function findByEmail(string $email): array|false
    {
        $pdo = Database::getPDO();
        $sql = "SELECT * FROM clients WHERE email = :email";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Trouver un client par ID
     */
    public static function findById(int $id): array|false
    {
        $pdo = Database::getPDO();
        $sql = "SELECT * FROM clients WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Créer un nouveau client
     */
    public static function create(
        string $nom,
        string $prenom,
        string $email,
        string $password,
        string $telephone,
        string $adresse,
        string $ville,
        string $codePostal,
        string $pays = 'France'
    ): int
    {
        $pdo = Database::getPDO();
        $sql = "INSERT INTO clients (nom, prenom, email, mot_de_passe, telephone, adresse, ville, code_postal, pays) 
                VALUES (:nom, :prenom, :email, :mot_de_passe, :telephone, :adresse, :ville, :code_postal, :pays) 
                RETURNING id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'mot_de_passe' => $password,
            'telephone' => $telephone,
            'adresse' => $adresse,
            'ville' => $ville,
            'code_postal' => $codePostal,
            'pays' => $pays
        ]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC)['id'];
    }

    /**
     * Mettre à jour un client
     */
    public static function update(
        int $id,
        string $nom,
        string $prenom,
        string $email,
        string $telephone = null,
        string $adresse = null,
        string $ville = null,
        string $codePostal = null
    ): bool
    {
        $pdo = Database::getPDO();
        $sql = "UPDATE clients 
                SET nom = :nom, prenom = :prenom, email = :email, 
                    telephone = :telephone, adresse = :adresse, ville = :ville, code_postal = :code_postal
                WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'telephone' => $telephone,
            'adresse' => $adresse,
            'ville' => $ville,
            'code_postal' => $codePostal,
            'id' => $id
        ]);
    }

    /**
     * Mettre à jour le mot de passe
     */
    public static function updatePassword(int $id, string $password): bool
    {
        $pdo = Database::getPDO();
        $sql = "UPDATE clients SET mot_de_passe = :mot_de_passe WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([
            'mot_de_passe' => $password,
            'id' => $id
        ]);
    }

    /**
     * Récupérer tous les clients
     */
    public static function findAll(): array
    {
        $pdo = Database::getPDO();
        $sql = "SELECT id, nom, prenom, email, telephone, ville, date_inscription 
                FROM clients 
                ORDER BY date_inscription DESC";
        
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Obtenir le nom complet
     */
    public static function getFullName(array $client): string
    {
        return trim($client['prenom'] . ' ' . $client['nom']);
    }
}