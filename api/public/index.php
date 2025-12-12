<?php
declare(strict_types=1);

session_start();

require_once __DIR__ . '/../vendor/autoload.php';

use Mini\Core\Router;
use Mini\Controllers\Api\ProductApiController;
use Mini\Controllers\Api\CategoryApiController;
use Mini\Controllers\Api\AuthApiController;
use Mini\Controllers\Api\CartApiController;
use Mini\Controllers\Api\OrderApiController;

$router = new Router();

// ==================== API ROUTES ====================

// --- Products API ---
$router->get('/api/products', [ProductApiController::class, 'index']);
$router->get('/api/products/show', [ProductApiController::class, 'show']);
$router->get('/api/products/search', [ProductApiController::class, 'search']);
$router->get('/api/products/latest', [ProductApiController::class, 'latest']);

// --- Categories API ---
$router->get('/api/categories', [CategoryApiController::class, 'index']);
$router->get('/api/categories/show', [CategoryApiController::class, 'show']);

// --- Auth API ---
$router->post('/api/auth/login', [AuthApiController::class, 'login']);
$router->post('/api/auth/register', [AuthApiController::class, 'register']);  // ⭐ CETTE LIGNE !
$router->post('/api/auth/logout', [AuthApiController::class, 'logout']);
$router->get('/api/auth/me', [AuthApiController::class, 'me']);

// --- Cart API ---
$router->get('/api/cart', [CartApiController::class, 'index']);
$router->post('/api/cart/add', [CartApiController::class, 'add']);
$router->post('/api/cart/update', [CartApiController::class, 'update']);
$router->post('/api/cart/remove', [CartApiController::class, 'remove']);
$router->post('/api/cart/clear', [CartApiController::class, 'clear']);

// --- Orders API ---
$router->post('/api/orders/create', [OrderApiController::class, 'create']);
$router->get('/api/orders/history', [OrderApiController::class, 'history']);
$router->get('/api/orders/show', [OrderApiController::class, 'show']);

$router->dispatch();

// ✅ DEBUG - À SUPPRIMER APRÈS
if ($_GET['debug'] ?? false) {
    header('Content-Type: application/json');
    echo json_encode([
        'method' => $_SERVER['REQUEST_METHOD'],
        'uri' => $_SERVER['REQUEST_URI'],
        'routes' => array_keys($router->getRoutes()['POST'] ?? [])
    ]);
    exit;
}