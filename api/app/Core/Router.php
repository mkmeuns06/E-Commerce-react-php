<?php
declare(strict_types=1);

namespace Mini\Core;

class Router
{
    private array $routes = [];

    /**
     * Enregistrer une route GET
     */
    public function get(string $path, array $handler): void
    {
        $this->routes['GET'][$path] = $handler;
    }

    /**
     * Enregistrer une route POST
     */
    public function post(string $path, array $handler): void
    {
        $this->routes['POST'][$path] = $handler;
    }

    /**
     * Dispatcher la requête
     */
    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // ✅ Gérer les requêtes OPTIONS (preflight CORS)
        if ($method === 'OPTIONS') {
            http_response_code(200);
            header('Access-Control-Allow-Origin: http://localhost:5173');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            header('Access-Control-Allow-Credentials: true');
            exit;
        }

        // Vérifier si la route existe pour cette méthode
        if (!isset($this->routes[$method])) {
            $this->sendError404($method, $uri);
            return;
        }

        // Chercher la route exacte
        if (isset($this->routes[$method][$uri])) {
            $this->callHandler($this->routes[$method][$uri]);
            return;
        }

        // Chercher les routes avec paramètres dynamiques
        foreach ($this->routes[$method] as $route => $handler) {
            $pattern = preg_replace('/\{[^\}]+\}/', '([^/]+)', $route);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches); // Enlever le match complet
                $_GET['id'] = $matches[0] ?? null; // Pour compatibilité
                $this->callHandler($handler);
                return;
            }
        }

        // Aucune route trouvée
        $this->sendError404($method, $uri);
    }

    /**
     * Appeler le handler de la route
     */
    private function callHandler(array $handler): void
    {
        [$controllerClass, $method] = $handler;
        $controller = new $controllerClass();
        $controller->$method();
    }

    /**
     * Envoyer une erreur 404
     */
    private function sendError404(string $method, string $uri): void
    {
        http_response_code(404);
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: http://localhost:5173');
        header('Access-Control-Allow-Credentials: true');
        
        echo json_encode([
            'success' => false,
            'message' => "Route non trouvée: $method $uri"
        ]);
        exit;
    }
}