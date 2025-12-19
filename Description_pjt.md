# 🎓 EXPLICATION COMPLÈTE DE LA STRUCTURE DU PROJET

---

## 🏗️ VUE D'ENSEMBLE

```
projet/
├── api/              ← Backend PHP (API REST)
└── frontend/         ← Frontend React (Interface utilisateur)
```

**Architecture :** Application **découplée** (Backend et Frontend séparés)

---

# 📁 PARTIE 1 : BACKEND (API)

```
api/
├── app/
│   ├── Controllers/
│   │   └── Api/
│   ├── Core/
│   ├── Models/
│   └── Views/
├── public/
├── vendor/
├── config.ini
├── composer.json
├── composer.lock
└── database.sql
```

---

## 📂 `api/app/` - Logique métier

### **`app/Controllers/`** - Contrôleurs (Logique de traitement)

```
app/Controllers/Api/
├── ProductApiController.php
├── CategoryApiController.php
├── AuthApiController.php
├── CartApiController.php
└── OrderApiController.php
```

**Rôle :** Gérer les requêtes HTTP et retourner des réponses JSON

**Exemple :** `ProductApiController.php`
- Reçoit : `GET /api/products`
- Fait : Appelle `Product::findAll()`
- Retourne : `{"success": true, "data": [...]}`

**Analogie :** C'est le **serveur dans un restaurant** qui prend les commandes et apporte les plats.

---

### **`app/Core/`** - Classes système

```
app/Core/
├── ApiController.php      ← Classe de base pour tous les controllers API
├── Controller.php         ← Classe de base (ancienne, non utilisée)
├── Database.php          ← Connexion à PostgreSQL
└── Router.php            ← Gestion des routes (URL → Controller)
```

**Rôle :** Infrastructure de base de l'application

**`ApiController.php`** :
```php
- json()     → Envoyer du JSON
- success()  → Réponse de succès
- error()    → Réponse d'erreur
```

**`Database.php`** :
```php
- getPDO()   → Obtenir la connexion PostgreSQL
```

**`Router.php`** :
```php
- get()      → Enregistrer route GET
- post()     → Enregistrer route POST
- dispatch() → Exécuter la bonne route
```

**Analogie :** C'est la **cuisine et les outils** du restaurant.

---

### **`app/Models/`** - Modèles (Accès aux données)

```
app/Models/
├── Client.php
├── Product.php
├── Category.php
├── Cart.php
└── Order.php
```

**Rôle :** Interagir avec la base de données PostgreSQL

**Exemple :** `Product.php`
```php
- findAll()              → SELECT * FROM produits
- findById($id)          → SELECT * WHERE id = ?
- findByCategory($catId) → SELECT * WHERE categorie_id = ?
- search($keyword)       → SELECT * WHERE nom LIKE ?
```

**Analogie :** C'est le **magasin/garde-manger** où on va chercher les ingrédients.

---

### **`app/Views/`** - SUPPRIMÉ ❌

**Avant :** Contenait les fichiers HTML/PHP pour afficher les pages

**Maintenant :** Plus utilisé car React gère l'affichage côté frontend

---

## 📂 `api/public/` - Point d'entrée web

```
api/public/
├── .htaccess         ← Réécriture d'URL + CORS
├── index.php         ← Point d'entrée unique (toutes les requêtes arrivent ici)
├── css/              ← Anciens styles (non utilisés)
└── images/           ← Images (optionnel, si pas dans frontend)
```

**`index.php`** :
```php
1. Démarrer la session
2. Charger Composer autoload
3. Enregistrer toutes les routes
4. Dispatcher la requête
```

**`.htaccess`** :
```apache
1. Rediriger toutes les URLs vers index.php
2. Ajouter les headers CORS pour React
3. Gérer les requêtes OPTIONS
```

**Analogie :** C'est la **porte d'entrée** du restaurant.

---

## 📂 `api/vendor/` - Dépendances Composer

**Rôle :** Bibliothèques PHP installées via Composer

**Contenu :** Autoloader PSR-4 pour charger automatiquement les classes

**Généré par :** `composer install`

**Ne JAMAIS modifier !** Ce dossier est auto-généré.

---

## 📄 Fichiers de configuration Backend

### **`config.ini`** - Configuration de la base de données

```ini
DB_HOST=localhost
DB_NAME=ecommerce
DB_USERNAME=postgres
DB_PASSWORD=mk
```

**Rôle :** Stocker les identifiants de connexion PostgreSQL

---

### **`composer.json`** - Configuration Composer

```json
{
  "autoload": {
    "psr-4": {
      "Mini\\": "app/"
    }
  }
}
```

**Rôle :** 
- Définir l'autoloading des classes
- Gérer les dépendances PHP (si besoin)

---

### **`composer.lock`** - Versions exactes

**Rôle :** Fixer les versions exactes des dépendances installées

**Ne JAMAIS modifier manuellement !**

---

### **`database.sql`** - Structure de la base

**Rôle :** Script SQL pour créer les tables

```sql
CREATE TABLE produits (...);
CREATE TABLE clients (...);
CREATE TABLE commandes (...);
...
```

---

# 📁 PARTIE 2 : FRONTEND (REACT)

```
frontend/
├── node_modules/
├── public/
├── src/
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## 📂 `frontend/node_modules/` - Dépendances NPM

**Rôle :** Toutes les bibliothèques JavaScript installées

**Contenu :** React, Bootstrap, Axios, etc.

**Généré par :** `npm install`

**Poids :** Peut être très lourd (plusieurs centaines de Mo)

**Ne JAMAIS commit sur Git !** (ajouté dans `.gitignore`)

---

## 📂 `frontend/public/` - Fichiers statiques

```
public/
├── images/           ← Images des produits
│   ├── smartphone.jpg
│   ├── tablette.png
│   └── ...
└── vite.svg         ← Logo Vite
```

**Rôle :** Fichiers accessibles directement par URL

**Exemple :** `http://localhost:5173/images/smartphone.jpg`

**Important :** Ces fichiers ne passent PAS par le bundler Vite

---

## 📂 `frontend/src/` - Code source React

```
src/
├── components/       ← Composants réutilisables
├── pages/           ← Pages complètes
├── services/        ← Appels API
├── context/         ← État global (Context API)
├── App.jsx          ← Composant racine
├── main.jsx         ← Point d'entrée
└── index.css        ← Styles globaux
```

---

### **`src/components/`** - Composants réutilisables

```
components/
├── Navbar.jsx          ← Barre de navigation
├── Footer.jsx          ← Pied de page
├── ProductCard.jsx     ← Carte produit (réutilisable)
├── CartItem.jsx        ← Ligne de panier
├── Loader.jsx          ← Spinner de chargement
├── PrivateRoute.jsx    ← Protection des routes
├── StarRating.jsx      ← Affichage des étoiles
└── ThemeToggle.jsx     ← Bouton dark mode
```

**Rôle :** Morceaux d'interface réutilisables dans plusieurs pages

**Exemple :** `ProductCard` est utilisé dans `Home.jsx` ET `Products.jsx`

**Analogie :** Ce sont les **LEGO** avec lesquels on construit les pages.

---

### **`src/pages/`** - Pages complètes

```
pages/
├── Home.jsx                 ← Page d'accueil
├── Products.jsx             ← Liste des produits
├── ProductDetail.jsx        ← Détail d'un produit
├── Cart.jsx                 ← Panier
├── Login.jsx                ← Connexion
├── Register.jsx             ← Inscription
├── Checkout.jsx             ← Validation de commande
├── OrderConfirmation.jsx    ← Confirmation
├── OrderHistory.jsx         ← Historique commandes
├── OrderDetail.jsx          ← Détail d'une commande
└── Account.jsx              ← Espace client
```

**Rôle :** Pages complètes de l'application (une URL = une page)

**Exemple :** `Products.jsx` correspond à `/products`

**Analogie :** Ce sont les **salles** du restaurant (salle principale, terrasse, salon privé).

---

### **`src/services/`** - Communication avec l'API

```
services/
├── api.js               ← Configuration Axios (base URL, interceptors)
├── authService.js       ← Appels API authentification
├── productService.js    ← Appels API produits
├── categoryService.js   ← Appels API catégories
├── cartService.js       ← Appels API panier
└── orderService.js      ← Appels API commandes
```

**Rôle :** Centraliser tous les appels HTTP vers le backend

**Exemple :** `productService.js`
```javascript
export const getAll = () => api.get('/products');
export const getById = (id) => api.get(`/products/show?id=${id}`);
```

**Analogie :** Ce sont les **téléphones** pour appeler le backend.

---

### **`src/context/`** - État global

```
context/
├── AuthContext.jsx      ← État utilisateur connecté
└── CartContext.jsx      ← État du panier
```

**Rôle :** Partager des données entre tous les composants (sans props drilling)

**Exemple :** `AuthContext`
```javascript
- user              → Données de l'utilisateur
- isAuthenticated   → true/false
- login()           → Se connecter
- logout()          → Se déconnecter
```

**Analogie :** C'est le **tableau d'affichage** du restaurant où tout le monde peut voir les infos.

---

### **`src/App.jsx`** - Composant racine

**Rôle :** 
- Définir les routes (React Router)
- Wrapper avec les Context Providers
- Structurer l'application (Navbar + Pages + Footer)

```jsx
<AuthProvider>
  <CartProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        ...
      </Routes>
      <Footer />
    </BrowserRouter>
  </CartProvider>
</AuthProvider>
```

---

### **`src/main.jsx`** - Point d'entrée

**Rôle :** Monter l'application React dans le DOM

```jsx
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

**Analogie :** C'est le **chef d'orchestre** qui lance tout.

---

### **`src/index.css`** - Styles globaux

**Rôle :** CSS personnalisé (animations, dark mode, overrides Bootstrap)

```css
- Variables CSS (:root)
- Utilitaires (.gradient-bg, .btn-gradient)
- Animations (@keyframes)
- Dark mode (body.dark-mode)
```

---

## 📄 Fichiers de configuration Frontend

### **`index.html`** - Page HTML de base

**Rôle :** Point d'entrée HTML (Vite injecte le JS ici)

```html
<div id="root"></div>           ← React monte ici
<script src="/src/main.jsx">    ← Vite charge React
```

---

### **`package.json`** - Configuration NPM

```json
{
  "scripts": {
    "dev": "vite",              ← npm run dev
    "build": "vite build",      ← npm run build
    "preview": "vite preview"   ← npm run preview
  },
  "dependencies": {
    "react": "^18.2.0",
    "axios": "^1.6.2",
    "bootstrap": "^5.3.2",
    ...
  }
}
```

**Rôle :** Définir les dépendances et les scripts NPM

---

### **`package-lock.json`** - Versions exactes

**Rôle :** Fixer les versions exactes des dépendances

**Ne JAMAIS modifier manuellement !**

---

### **`vite.config.js`** - Configuration Vite

```javascript
export default {
  server: {
    port: 5173,
    open: true
  }
}
```

**Rôle :** Configurer le serveur de développement Vite

---

### **`.gitignore`** - Fichiers à ignorer

```
node_modules/
dist/
.env
```

**Rôle :** Éviter de commit les fichiers inutiles sur Git

---

# 🎯 FLUX DE DONNÉES COMPLET

```
┌─────────────────────────────────────────────────────┐
│                   UTILISATEUR                        │
│              http://localhost:5173                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│              FRONTEND (React)                        │
│  - Components (UI)                                   │
│  - Pages (Routes)                                    │
│  - Services (API calls)                              │
│  - Context (État global)                             │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓ HTTP Request (Axios)
                     │
┌─────────────────────────────────────────────────────┐
│              BACKEND (PHP API)                       │
│  - Router (Routes)                                   │
│  - Controllers (Logique)                             │
│  - Models (Base de données)                          │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓ SQL Query
                     │
┌─────────────────────────────────────────────────────┐
│           BASE DE DONNÉES (PostgreSQL)               │
│  - produits, clients, commandes, etc.                │
└─────────────────────────────────────────────────────┘
```

---

# 📊 RÉCAPITULATIF PAR FONCTION

| Dossier | Fonction | Langage | Framework |
|---------|----------|---------|-----------|
| **api/app/Controllers/** | Traiter les requêtes HTTP | PHP | - |
| **api/app/Models/** | Accéder à la BDD | PHP | PDO |
| **api/app/Core/** | Infrastructure système | PHP | - |
| **frontend/src/components/** | UI réutilisable | JavaScript | React |
| **frontend/src/pages/** | Pages complètes | JavaScript | React |
| **frontend/src/services/** | Appels API | JavaScript | Axios |
| **frontend/src/context/** | État global | JavaScript | React Context |

---
