<?php
require_once __DIR__ . '/verificador-base.php';
header('Content-Type: application/json; charset=UTF-8');

if (isset($_SESSION['usuario_id']))
{
    echo json_encode([
        'success' => true,
        'usuario_id' => (int) $_SESSION['usuario_id'],
    ]);
}

else
{
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Sessão expirada.',
    ]);
}
