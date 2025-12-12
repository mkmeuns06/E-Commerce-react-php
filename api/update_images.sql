-- ========================================
-- MISE À JOUR DES IMAGES DES PRODUITS
-- ========================================

-- Électronique (Catégorie 1)
UPDATE produits SET image_url = '/images/smartphone.jpg' WHERE id = 1;
UPDATE produits SET image_url = '/images/ordinateur.png' WHERE id = 2;
UPDATE produits SET image_url = '/images/ecouteurs.jpg' WHERE id = 3;
UPDATE produits SET image_url = '/images/tablette.png' WHERE id = 4;

-- Vêtements (Catégorie 2)
UPDATE produits SET image_url = '/images/tee-shirt.jpeg' WHERE id = 5;
UPDATE produits SET image_url = '/images/jeans.png' WHERE id = 6;
UPDATE produits SET image_url = '/images/veste.jpg' WHERE id = 7;
UPDATE produits SET image_url = '/images/baskets.jpeg' WHERE id = 8;

-- Maison & Jardin (Catégorie 3)
UPDATE produits SET image_url = '/images/lampe.jpg' WHERE id = 9;
UPDATE produits SET image_url = '/images/coussin.jpg' WHERE id = 10;
UPDATE produits SET image_url = '/images/cafetiere.jpg' WHERE id = 11;
UPDATE produits SET image_url = '/images/plante.jpg' WHERE id = 12;

-- Sports & Loisirs (Catégorie 4)
UPDATE produits SET image_url = '/images/tapis.jpg' WHERE id = 13;
UPDATE produits SET image_url = '/images/halteres.png' WHERE id = 14;
UPDATE produits SET image_url = '/images/ballon.png' WHERE id = 15;

-- Livres (Catégorie 5)
UPDATE produits SET image_url = '/images/php-livre.jpg' WHERE id = 16;
UPDATE produits SET image_url = '/images/livre.png' WHERE id = 17;
UPDATE produits SET image_url = '/images/bd.png' WHERE id = 18;

-- Vérifier les résultats
SELECT id, nom, image_url FROM produits ORDER BY id;