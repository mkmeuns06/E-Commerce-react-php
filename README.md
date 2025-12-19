# E-Commerce - Application Full Stack

Application e-commerce moderne développée avec **PHP (API REST)** et **React** avec un design disco vibrant !

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **PHP** >= 8.0 ([XAMPP](https://www.apachefriends.org/) recommandé)
- **PostgreSQL** >= 16 ([Télécharger](https://www.postgresql.org/download/))
- **Node.js** >= 18 ([Télécharger](https://nodejs.org/))
- **Composer** ([Télécharger](https://getcomposer.org/))
- **Git** ([Télécharger](https://git-scm.com/))

---

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/mkmeuns06/E-Commerce-react-php.git
cd "e-commerce php react"
```

### 2. Installation des dépendances Backend (PHP)
```bash
cd api
composer install
composer dump-autoload
cd ..
```

### 3. Installation des dépendances Frontend (React)
```bash
cd frontend
npm install
cd ..
```

---

## Configuration de la base de données

### Étape 1 : Démarrer PostgreSQL

#### **Via XAMPP Control Panel :**
1. Ouvrez **XAMPP Control Panel**
2. Cliquez sur **"Start"** à côté de **PostgreSQL**

#### **Via ligne de commande :**
```bash
# Windows
net start postgresql-x64-16

# Linux/Mac
sudo service postgresql start
```

---

### Étape 2 : Créer la base de données

#### **Méthode 1 : Via pgAdmin**

1. Ouvrez **pgAdmin 4**
2. Connectez-vous avec le mot de passe : `mk`
3. Clic droit sur **"Databases"** → **"Create"** → **"Database"**
4. Nom : `ecommerce`
5. Cliquez sur **"Save"**

#### **Méthode 2 : Via ligne de commande**
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE ecommerce;

# Se connecter à la base
\c ecommerce

# Quitter psql
\q
```

---

### Étape 3 : Importer la structure et les données

#### **Via pgAdmin :**

1. Clic droit sur la base **ecommerce** → **"Query Tool"**
2. Copiez-collez le contenu du fichier `api/database.sql`
3. Cliquez sur **Execute**

#### **Via ligne de commande :**
```bash
# Depuis la racine du projet
psql -U postgres -d ecommerce -f api/database.sql
```

---

### Étape 4 : Vérifier l'installation
```sql
-- Se connecter à la base
psql -U postgres -d ecommerce

-- Lister les tables
\dt

-- Compter les produits
SELECT COUNT(*) FROM produits;

-- Résultat attendu : 18 produits
```

---

### Étape 5 : Configuration du backend

Vérifiez le fichier **`api/config.ini`** :
```ini
DB_HOST=localhost
DB_NAME=ecommerce
DB_USERNAME=postgres
DB_PASSWORD=mk
```

> **Note :** Modifiez ces valeurs selon votre configuration PostgreSQL.

---

## Lancement du projet

### Terminal 1 : Backend (API PHP)
```bash
# Aller dans le dossier api/public
cd api/public

# Lancer le serveur PHP
php -S localhost:8000

# Le backend est maintenant accessible sur http://localhost:8000
```

**Logs attendus :**
```
[Fri Dec 20 10:00:00 2025] PHP 8.2.12 Development Server (http://localhost:8000) started
```

---

### Terminal 2 : Frontend (React)

**Ouvrez un NOUVEAU terminal** (ne pas fermer celui du backend)
```bash
# Aller dans le dossier frontend
cd frontend

# Lancer le serveur Vite
npm run dev

# Le frontend est maintenant accessible sur http://localhost:5173
```

**Logs attendus :**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Accéder à l'application

Ouvrez votre navigateur et allez sur :

** http://localhost:5173 **

---

## Identifiants de test

### Utilisateur
```
Email    : mireille.moutarde@email.com
Mot de passe : mireillemoutarde02

---

## Structure du projet
```
ecommerce-disco/
│
├── api/                          
│   ├── app/
│   │   ├── Controllers/
│   │   │   └── Api/             
│   │   │       ├── ProductApiController.php
│   │   │       ├── CategoryApiController.php
│   │   │       ├── AuthApiController.php
│   │   │       ├── CartApiController.php
│   │   │       └── OrderApiController.php
│   │   ├── Core/
│   │   │   ├── ApiController.php   
│   │   │   ├── Database.php        
│   │   │   └── Router.php          
│   │   └── Models/
│   │       ├── Client.php
│   │       ├── Product.php
│   │       ├── Category.php
│   │       ├── Cart.php
│   │       └── Order.php
│   ├── public/
│   │   ├── .htaccess             
│   │   └── index.php             
│   ├── vendor/                   
│   ├── config.ini                
│   ├── composer.json
│   └── database.sql              
│
├── frontend/                     
│   ├── public/
│   │   ├── images/               
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/           
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/                
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   └── Account.jsx
│   │   ├── services/             
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── categoryService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   ├── context/              
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── App.jsx               
│   │   ├── main.jsx              
│   │   └── index.css             
│   ├── node_modules/             
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md                     
```

---

## Technologies utilisées

### Backend
- **PHP 8.2** - Langage serveur
- **PostgreSQL 16** - Base de données relationnelle
- **Composer** - Gestionnaire de dépendances PHP
- **Architecture MVC** - Pattern de conception

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool et dev server
- **React Router** - Gestion des routes
- **Axios** - Client HTTP
- **Bootstrap 5** - Framework CSS
- **React Bootstrap** - Composants Bootstrap pour React
- **React Hot Toast** - Notifications toast

---

## Fonctionnalités

### Catalogue
- Affichage des produits par catégorie
- Recherche de produits
- Filtrage par catégorie
- Pagination (12 produits par page)
- Système de notation (étoiles)
- Images des produits

### Panier
- Ajout/suppression de produits
- Modification des quantités
- Calcul du total en temps réel
- Persistance du panier (session)

### Authentification
- Inscription utilisateur
- Connexion/déconnexion
- Protection des routes privées
- Gestion de session

### Commandes
- Validation de commande
- Historique des commandes
- Détail d'une commande
- Statuts de commande (En attente, En préparation, Expédiée, Livrée)

### Interface
- Design disco responsive
- Mode sombre/clair
- Animations fluides
- Notifications toast
- Loader pendant le chargement

---

## API Endpoints

### Produits
```
GET    /api/products              # Liste des produits
GET    /api/products/show?id=X   # Détail d'un produit
GET    /api/products/search?q=X  # Recherche
GET    /api/products/latest?limit=8  # Derniers produits
```

### Catégories
```
GET    /api/categories            # Liste des catégories
GET    /api/categories/show?id=X # Produits d'une catégorie
```

### Authentification
```
POST   /api/auth/register         # Inscription
POST   /api/auth/login            # Connexion
POST   /api/auth/logout           # Déconnexion
GET    /api/auth/me               # Utilisateur connecté
```

### Panier
```
GET    /api/cart                  # Récupérer le panier
POST   /api/cart/add              # Ajouter un produit
POST   /api/cart/update           # Modifier la quantité
POST   /api/cart/remove           # Supprimer un produit
POST   /api/cart/clear            # Vider le panier
```

### Commandes
```
POST   /api/orders/create         # Créer une commande
GET    /api/orders/history        # Historique des commandes
GET    /api/orders/show?id=X      # Détail d'une commande
```

---

## Dépannage

### Problème : Port 8000 déjà utilisé
```bash
# Trouver le processus
netstat -ano | findstr :8000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

---

### Problème : Port 5173 déjà utilisé
```bash
# Trouver le processus
netstat -ano | findstr :5173

# Tuer le processus
taskkill /PID <PID> /F
```

---

### Problème : PostgreSQL ne démarre pas
```bash
# Vérifier le statut
sc query postgresql-x64-16

# Redémarrer le service
net stop postgresql-x64-16
net start postgresql-x64-16
```

---

### Problème : Erreur CORS

**Vérifier :**
1. Backend sur `localhost:8000`
2. Frontend sur `localhost:5173`
3. `api/public/.htaccess` contient les headers CORS
4. `withCredentials: true` dans `api.js`

---

### Problème : "Cannot connect to database"

**Vérifier `api/config.ini` :**
```ini
DB_HOST=localhost
DB_NAME=ecommerce
DB_USERNAME=postgres
DB_PASSWORD=mk
```

**Tester la connexion :**
```bash
psql -U postgres -d ecommerce
# Mot de passe : mk
```

---

### Problème : Composer autoload manquant
```bash
cd api
composer install
composer dump-autoload
```

---

### Problème : Images des produits ne s'affichent pas

**Vérifier :**
1. Images dans `frontend/public/images/`
2. URLs dans la BDD : `/images/smartphone.jpg`
3. Tester : `http://localhost:5173/images/smartphone.jpg`

---

### Problème : Boutons ne fonctionnent pas

**Vider le cache du navigateur :**
```
Ctrl + Shift + R
```

**Vérifier la console (F12) pour les erreurs JavaScript**

---

## Scripts utiles

### Backend
```bash
# Lancer le serveur
cd api/public && php -S localhost:8000

# Tester une route
curl http://localhost:8000/api/products

# Regénérer l'autoload
cd api && composer dump-autoload
```

### Frontend
```bash
# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

### Base de données
```bash
# Se connecter
psql -U postgres -d ecommerce

# Exporter la BDD
pg_dump -U postgres ecommerce > backup.sql

# Importer la BDD
psql -U postgres -d ecommerce < backup.sql
```

---

## Auteur

- GitHub: [@mkmeuns06](https://github.com/mkmeuns06)

---

