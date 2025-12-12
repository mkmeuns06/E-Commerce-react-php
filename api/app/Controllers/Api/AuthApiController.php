<?php
declare(strict_types=1);

namespace Mini\Controllers\Api;

use Mini\Core\ApiController;
use Mini\Models\Client;

final class AuthApiController extends ApiController
{
    /**
     * POST /api/auth/login
     */
    public function login(): void
    {
        $data = $this->getJsonBody();
        
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            $this->error('Email et mot de passe requis', 400);
        }
        
        $client = Client::findByEmail($email);
        
        if (!$client || !password_verify($password, $client['mot_de_passe'])) {
            $this->error('Identifiants incorrects', 401);
        }
        
        // Démarrer la session et stocker le client
        unset($client['mot_de_passe']);
        $_SESSION['client'] = $client;
        
        $this->success($client, 'Connexion réussie');
    }

    /**
     * POST /api/auth/register
     */
    public function register(): void
    {
        $data = $this->getJsonBody();
        
        // Validation
        if (empty($data['nom']) || empty($data['prenom']) || empty($data['email']) || 
            empty($data['password']) || empty($data['adresse']) || empty($data['ville']) || 
            empty($data['code_postal'])) {
            $this->error('Tous les champs obligatoires doivent être remplis', 400);
        }
        
        // Vérifier si l'email existe déjà
        if (Client::findByEmail($data['email'])) {
            $this->error('Cet email est déjà utilisé', 409);
        }
        
        // Créer le client
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        try {
            $clientId = Client::create(
                $data['nom'],
                $data['prenom'],
                $data['email'],
                $hashedPassword,
                $data['telephone'] ?? '',
                $data['adresse'],
                $data['ville'],
                $data['code_postal'],
                $data['pays'] ?? 'France'
            );
            
            if ($clientId) {
                $this->success(['id' => $clientId], 'Inscription réussie', 201);
            } else {
                $this->error('Erreur lors de l\'inscription', 500);
            }
        } catch (\Exception $e) {
            $this->error('Erreur : ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/auth/logout
     */
    public function logout(): void
    {
        session_destroy();
        $this->success(null, 'Déconnexion réussie');
    }

    /**
     * GET /api/auth/me
     */
    public function me(): void
    {
        if (!isset($_SESSION['client'])) {
            $this->error('Non authentifié', 401);
        }
        
        $this->success($_SESSION['client']);
    }
}