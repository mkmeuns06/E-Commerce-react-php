<?php

declare(strict_types=1);

namespace Mini\Core;

abstract class Controller
{
    /**
     * Afficher une vue avec le layout
     */
    protected function render(string $viewName, array $params = []): void
    {
        // Extraire les données pour les utiliser comme variables
        extract($params);
        
        // Capturer le contenu de la vue
        ob_start();
        require_once __DIR__ . '/../Views/' . $viewName . '.php';
        $content = ob_get_clean();
        
        // Inclure le layout avec le contenu
        require_once __DIR__ . '/../Views/layout.php';
    }
}