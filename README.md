# Liste des cours
- [Installation du projet](./docs/README_START.md)
- [Active Record](./docs/active-record.md)

# 🛒 E-Commerce PHP Vanilla

Projet d'application e-commerce développée en PHP pur (sans framework) avec PostgreSQL.

## 📋 Fonctionnalités

### ✅ Fonctionnalités principales
- ✅ Page d'accueil avec liste de produits
- ✅ Page détail produit
- ✅ Système de panier (ajout, suppression, modification quantité)
- ✅ Authentification utilisateur (inscription + connexion)
- ✅ Passage de commande (validation du panier)

### 🎁 Fonctionnalités bonus
- ✅ Espace client avec historique des commandes
- ✅ Filtrage des produits par catégorie
- ✅ Recherche de produits
- ✅ Gestion du stock
- ✅ Interface responsive

## 🏗️ Architecture

### Structure du projet
```
projet/
├── app/
│   ├── Controllers/     # Contrôleurs MVC
│   ├── Core/            # Classes core (Database, Router, Controller)
│   ├── Models/          # Modèles de données
│   └── Views/           # Vues (templates PHP)
├── public/
│   ├── css/             # Fichiers CSS
│   ├── images/          # Images des produits
│   ├── .htaccess        # Configuration Apache
│   └── index.php        # Point d'entrée
├── config.ini           # Configuration base de données
├── database.sql         # Script de création BDD
└── README.md
```

### Technologies utilisées
- **Backend :** PHP 8+ (vanilla)
- **Base de données :** PostgreSQL
- **Frontend :** HTML5, CSS3 (vanilla)
- **Architecture :** MVC (Model-View-Controller)

## 🚀 Installation

### Prérequis
- PHP 8.0 ou supérieur
- PostgreSQL 12 ou supérieur
- Serveur web (Apache/Nginx) avec mod_rewrite activé
- Composer (pour l'autoloader)

### Étape 1 : Cloner le projet
```bash
git clone <url-du-projet>
cd projet-ecommerce
```

### Étape 2 : Installer les dépendances
```bash
composer install
```

### Étape 3 : Créer la base de données

1. Connectez-vous à PostgreSQL :
```bash
psql -U postgres
```

2. Créez la base de données :
```sql
CREATE DATABASE ecommerce;
\c ecommerce
```

3. Importez le script SQL :
```bash
psql -U postgres -d ecommerce -f database.sql
```

### Étape 4 : Configuration

Modifiez le fichier `config.ini` avec vos informations :
```ini
DB_HOST=localhost
DB_NAME=ecommerce
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
```

### Étape 5 : Configurer le serveur web

#### Apache
Le fichier `.htaccess` est déjà configuré dans `public/`

#### Nginx
Ajoutez cette configuration :
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### Étape 6 : Démarrer le serveur

#### Serveur PHP intégré (développement)
```bash
cd public
php -S localhost:8000
```

#### Apache/Nginx
Configurez le DocumentRoot vers le dossier `public/`

### Étape 7 : Accéder à l'application

Ouvrez votre navigateur : `http://localhost:8000`

## 👤 Identifiants de test

### Utilisateurs
| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@test.com | password | Admin |
| jean@test.com | password | Client |
| marie@test.com | password | Client |

## 📊 Base de données

### Tables principales
- **users** : Utilisateurs du site
- **categories** : Catégories de produits
- **products** : Produits disponibles
- **orders** : Commandes passées
- **order_items** : Détails des commandes

### Relations
- Un produit appartient à une catégorie
- Une commande est associée à un utilisateur
- Une commande contient plusieurs articles (order_items)

## 🧪 Tests

### Scénario de test complet

1. **Page d'accueil**
   - Accéder à `/`
   - Vérifier l'affichage des produits

2. **Navigation produits**
   - Accéder à `/products`
   - Filtrer par catégorie
   - Rechercher un produit

3. **Détail produit**
   - Cliquer sur un produit
   - Vérifier l'affichage des détails

4. **Panier**
   - Ajouter des produits au panier
   - Modifier les quantités
   - Supprimer des articles

5. **Authentification**
   - S'inscrire avec un nouveau compte
   - Se connecter
   - Se déconnecter

6. **Commande**
   - Se connecter
   - Ajouter des produits au panier
   - Valider la commande
   - Vérifier la confirmation

7. **Espace client**
   - Accéder à `/account`
   - Consulter l'historique
   - Voir les détails d'une commande

## 📝 Notes techniques

### Sécurité
- ✅ Mots de passe hashés avec `password_hash()`
- ✅ Protection CSRF (sessions)
- ✅ Requêtes préparées (PDO)
- ✅ Validation des données
- ✅ Échappement HTML

### Gestion du panier
Le panier est géré en session PHP (`$_SESSION['cart']`)

### Messages flash
Les messages de succès/erreur sont stockés en session et affichés une seule fois

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez le fichier `config.ini`
- Vérifiez que PostgreSQL est démarré
- Testez la connexion : `psql -U postgres -d ecommerce`

### Page 404 sur toutes les routes
- Vérifiez que mod_rewrite est activé (Apache)
- Vérifiez le fichier `.htaccess`
- Vérifiez la configuration du DocumentRoot

### Erreur "Class not found"
- Exécutez `composer dump-autoload`
- Vérifiez les namespaces

## 👨‍💻 Auteur

Projet réalisé dans le cadre du TP E-Commerce en PHP Vanilla

## 📄 Licence

Ce projet est à usage éducatif uniquement.