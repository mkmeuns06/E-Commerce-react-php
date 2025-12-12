-- ================================================================
-- SYSTÈME DE NOTATION DES PRODUITS
-- ================================================================

-- 1. Ajouter les colonnes de notation
ALTER TABLE produits ADD COLUMN IF NOT EXISTS note DECIMAL(2,1) DEFAULT 4.5;
ALTER TABLE produits ADD COLUMN IF NOT EXISTS nb_avis INT DEFAULT 0;

-- 2. Mettre à jour les notes pour chaque produit
-- Notes réalistes entre 3.8 et 4.9

-- ========================================
-- ÉLECTRONIQUE (Catégorie 1)
-- ========================================
UPDATE produits SET note = 4.8, nb_avis = 127 WHERE id = 1;  -- Smartphone XZ Pro
UPDATE produits SET note = 4.6, nb_avis = 89 WHERE id = 2;   -- Ordinateur Portable Ultra
UPDATE produits SET note = 4.9, nb_avis = 203 WHERE id = 3;  -- Écouteurs Bluetooth Premium
UPDATE produits SET note = 4.3, nb_avis = 56 WHERE id = 4;   -- Tablette tactile 10"

-- ========================================
-- VÊTEMENTS (Catégorie 2)
-- ========================================
UPDATE produits SET note = 4.7, nb_avis = 342 WHERE id = 5;  -- T-shirt coton bio
UPDATE produits SET note = 4.5, nb_avis = 178 WHERE id = 6;  -- Jean slim bleu
UPDATE produits SET note = 4.2, nb_avis = 67 WHERE id = 7;   -- Veste en cuir
UPDATE produits SET note = 4.8, nb_avis = 289 WHERE id = 8;  -- Baskets running

-- ========================================
-- MAISON & JARDIN (Catégorie 3)
-- ========================================
UPDATE produits SET note = 4.6, nb_avis = 145 WHERE id = 9;   -- Lampe de bureau LED
UPDATE produits SET note = 4.4, nb_avis = 92 WHERE id = 10;   -- Coussin décoratif
UPDATE produits SET note = 4.7, nb_avis = 234 WHERE id = 11;  -- Cafetière italienne
UPDATE produits SET note = 4.5, nb_avis = 123 WHERE id = 12;  -- Plante artificielle

-- ========================================
-- SPORTS & LOISIRS (Catégorie 4)
-- ========================================
UPDATE produits SET note = 4.9, nb_avis = 412 WHERE id = 13;  -- Tapis de yoga
UPDATE produits SET note = 4.6, nb_avis = 156 WHERE id = 14;  -- Haltères réglables
UPDATE produits SET note = 4.3, nb_avis = 78 WHERE id = 15;   -- Ballon de football

-- ========================================
-- LIVRES (Catégorie 5)
-- ========================================
UPDATE produits SET note = 4.8, nb_avis = 567 WHERE id = 16;  -- Le Guide du développeur PHP
UPDATE produits SET note = 4.5, nb_avis = 234 WHERE id = 17;  -- Roman Aventure
UPDATE produits SET note = 4.7, nb_avis = 189 WHERE id = 18;  -- BD Les Aventuriers

-- ========================================
-- VÉRIFICATION DES RÉSULTATS
-- ========================================
SELECT 
    id,
    nom,
    note,
    nb_avis,
    CASE 
        WHEN note >= 4.7 THEN '⭐⭐⭐⭐⭐ Excellent'
        WHEN note >= 4.3 THEN '⭐⭐⭐⭐ Très bon'
        WHEN note >= 4.0 THEN '⭐⭐⭐ Bon'
        ELSE '⭐⭐ Moyen'
    END as evaluation
FROM produits 
ORDER BY note DESC, nb_avis DESC;

-- ========================================
-- STATISTIQUES
-- ========================================
SELECT 
    'Note moyenne' as statistique,
    ROUND(AVG(note), 2) as valeur,
    'sur 5' as unite
FROM produits
UNION ALL
SELECT 
    'Total avis',
    SUM(nb_avis),
    'avis'
FROM produits
UNION ALL
SELECT 
    'Produit le mieux noté',
    MAX(note),
    '⭐'
FROM produits
UNION ALL
SELECT 
    'Produit le moins noté',
    MIN(note),
    '⭐'
FROM produits;

-- ========================================
-- TOP 5 DES PRODUITS LES MIEUX NOTÉS
-- ========================================
SELECT 
    nom,
    note,
    nb_avis,
    prix
FROM produits 
ORDER BY note DESC, nb_avis DESC 
LIMIT 5;

-- ========================================
-- FIN DU SCRIPT
-- ========================================
