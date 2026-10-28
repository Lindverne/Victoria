<?php
require_once __DIR__ . '/verificador-base.php';

if (!isset($_SESSION['usuario_id']))
{
    $aceitaJson = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false || strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false;

    if ($aceitaJson)
    {
        http_response_code(401);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => false,
            'message' => 'Acesso não autorizado. Faça login para continuar.',
            'redirect' => 'login.php',
        ]);
    }

    else
    {
        renderizarAcessoNegado('Faça login para acessar esta página.');
    }

    exit();
}

$usuario_id = (int) $_SESSION['usuario_id'];
