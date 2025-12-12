-- ========================================
-- BASE DE DONNÉES E-COMMERCE - POSTGRESQL
-- ========================================

-- Suppression des tables si elles existent
DROP TABLE IF EXISTS lignes_commande CASCADE;
DROP TABLE IF EXISTS commandes CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS administrateurs CASCADE;

-- Suppression des types ENUM s'ils existent
DROP TYPE IF EXISTS statut_commande CASCADE;
DROP TYPE IF EXISTS role_admin CASCADE;

-- Création des types ENUM
CREATE TYPE statut_commande AS ENUM ('en_attente', 'payee', 'expediee', 'livree', 'annulee');
CREATE TYPE role_admin AS ENUM ('admin', 'super_admin');

-- ========================================
-- 1. TABLE CATEGORIES
-- ========================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. TABLE PRODUITS
-- ========================================
CREATE TABLE produits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    prix DECIMAL(10, 2) NOT NULL CHECK (prix >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE,
    categorie_id INT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE INDEX idx_produits_categorie ON produits(categorie_id);
CREATE INDEX idx_produits_actif ON produits(actif);

-- ========================================
-- 3. TABLE CLIENTS
-- ========================================
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    adresse VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    pays VARCHAR(100) DEFAULT 'France',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_email ON clients(email);

-- ========================================
-- 4. TABLE COMMANDES
-- ========================================
CREATE TABLE commandes (
    id SERIAL PRIMARY KEY,
    numero_commande VARCHAR(50) NOT NULL UNIQUE,
    client_id INT NOT NULL,
    statut statut_commande DEFAULT 'en_attente',
    montant_total DECIMAL(10, 2) NOT NULL CHECK (montant_total >= 0),
    
    -- Adresse de livraison
    adresse_livraison VARCHAR(255) NOT NULL,
    ville_livraison VARCHAR(100) NOT NULL,
    code_postal_livraison VARCHAR(10) NOT NULL,
    pays_livraison VARCHAR(100) DEFAULT 'France',
    
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT
);

CREATE INDEX idx_commandes_client ON commandes(client_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
CREATE INDEX idx_commandes_date ON commandes(date_commande);

-- ========================================
-- 5. TABLE LIGNES DE COMMANDE
-- ========================================
CREATE TABLE lignes_commande (
    id SERIAL PRIMARY KEY,
    commande_id INT NOT NULL,
    produit_id INT NOT NULL,
    quantite INT NOT NULL CHECK (quantite > 0),
    prix_unitaire DECIMAL(10, 2) NOT NULL CHECK (prix_unitaire >= 0),
    sous_total DECIMAL(10, 2) NOT NULL CHECK (sous_total >= 0),
    
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE RESTRICT
);

CREATE INDEX idx_lignes_commande ON lignes_commande(commande_id);
CREATE INDEX idx_lignes_produit ON lignes_commande(produit_id);

-- ========================================
-- 6. TABLE ADMINISTRATEURS
-- ========================================
CREATE TABLE administrateurs (
    id SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    role role_admin DEFAULT 'admin',
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP NULL
);

CREATE INDEX idx_admin_username ON administrateurs(nom_utilisateur);
CREATE INDEX idx_admin_email ON administrateurs(email);

-- ========================================
-- TRIGGER POUR MISE À JOUR AUTOMATIQUE
-- ========================================

-- Fonction pour mettre à jour date_modification
CREATE OR REPLACE FUNCTION update_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour chaque table
CREATE TRIGGER trg_categories_update
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER trg_produits_update
    BEFORE UPDATE ON produits
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER trg_clients_update
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER trg_commandes_update
    BEFORE UPDATE ON commandes
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

-- ========================================
-- DONNÉES D'EXEMPLE
-- ========================================

-- Insertion de catégories
INSERT INTO categories (nom, description) VALUES
('Électronique', 'Produits électroniques et high-tech'),
('Vêtements', 'Mode et accessoires'),
('Maison & Jardin', 'Décoration et équipement pour la maison'),
('Sports & Loisirs', 'Équipements sportifs et loisirs créatifs'),
('Livres', 'Romans, BD, mangas et livres techniques');

-- Insertion de produits
INSERT INTO produits (nom, description, prix, stock, categorie_id, actif) VALUES
-- Électronique
('Smartphone XZ Pro', 'Smartphone dernière génération avec écran OLED 6.5 pouces, 128 Go de stockage et appareil photo 48 MP', 699.99, 25, 1, TRUE),
('Ordinateur Portable Ultra', 'PC portable 15 pouces, processeur Intel i7, 16 Go RAM, SSD 512 Go', 1299.99, 15, 1, TRUE),
('Écouteurs Bluetooth Premium', 'Écouteurs sans fil avec réduction de bruit active et autonomie 30h', 149.99, 50, 1, TRUE),
('Tablette tactile 10"', 'Tablette Android 10 pouces, 64 Go, idéale pour la lecture et les vidéos', 299.99, 30, 1, TRUE),

-- Vêtements
('T-shirt coton bio', 'T-shirt 100% coton biologique, disponible en plusieurs couleurs', 19.99, 100, 2, TRUE),
('Jean slim bleu', 'Jean confortable coupe slim, denim de qualité supérieure', 59.99, 60, 2, TRUE),
('Veste en cuir', 'Veste en cuir véritable, style motard, doublure intérieure', 249.99, 20, 2, TRUE),
('Baskets running', 'Chaussures de sport confortables avec amorti renforcé', 89.99, 45, 2, TRUE),

-- Maison & Jardin
('Lampe de bureau LED', 'Lampe design avec variateur d''intensité et port USB', 39.99, 40, 3, TRUE),
('Coussin décoratif', 'Coussin en velours 45x45 cm, plusieurs coloris disponibles', 24.99, 80, 3, TRUE),
('Cafetière italienne', 'Cafetière moka traditionnelle en aluminium, 6 tasses', 34.99, 35, 3, TRUE),
('Plante artificielle', 'Plante verte décorative en pot, sans entretien', 29.99, 50, 3, TRUE),

-- Sports & Loisirs
('Tapis de yoga', 'Tapis antidérapant 180x60 cm avec sac de transport', 29.99, 70, 4, TRUE),
('Haltères réglables', 'Paire d''haltères 2-10 kg, gain de place', 79.99, 25, 4, TRUE),
('Ballon de football', 'Ballon officiel taille 5, cousu main', 24.99, 60, 4, TRUE),

-- Livres
('Le Guide du développeur PHP', 'Livre technique complet pour maîtriser PHP et ses frameworks', 39.99, 40, 5, TRUE),
('Roman Aventure', 'Roman best-seller, prix Goncourt', 19.99, 100, 5, TRUE),
('BD Les Aventuriers', 'Bande dessinée humoristique, tome 1', 12.99, 75, 5, TRUE);

-- Insertion de clients de test (mot de passe: "password")
INSERT INTO clients (nom, prenom, email, mot_de_passe, telephone, adresse, ville, code_postal) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0612345678', '123 Rue de la Paix', 'Paris', '75001'),
('Martin', 'Marie', 'marie.martin@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0623456789', '456 Avenue des Champs', 'Lyon', '69001'),
('Bernard', 'Sophie', 'sophie.bernard@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0634567890', '789 Boulevard Victor Hugo', 'Marseille', '13001');

-- Insertion d'un administrateur (mot de passe: "admin123")
INSERT INTO administrateurs (nom_utilisateur, email, mot_de_passe, nom, prenom, role) VALUES
('admin', 'admin@ecommerce.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Principal', 'super_admin');

-- Insertion de commandes de test
INSERT INTO commandes (numero_commande, client_id, montant_total, statut, adresse_livraison, ville_livraison, code_postal_livraison) VALUES
('CMD-20241206-ABC123', 1, 849.98, 'livree', '123 Rue de la Paix', 'Paris', '75001'),
('CMD-20241205-DEF456', 1, 199.98, 'en_attente', '123 Rue de la Paix', 'Paris', '75001'),
('CMD-20241204-GHI789', 2, 119.97, 'expediee', '456 Avenue des Champs', 'Lyon', '69001');

-- Insertion des lignes de commande
INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire, sous_total) VALUES
-- Commande 1
(1, 1, 1, 699.99, 699.99),
(1, 3, 1, 149.99, 149.99),
-- Commande 2
(2, 5, 2, 19.99, 39.98),
(2, 9, 1, 39.99, 39.99),
(2, 13, 4, 29.99, 119.96),
-- Commande 3
(3, 6, 2, 59.99, 119.98);