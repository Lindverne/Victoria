<?php

require_once __DIR__ . '/../config/csrf.php';

function verificarCsrf(): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    
    if (in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH']))
    {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] 
                 ?? $_POST['csrf_token'] 
                 ?? null;
        
        if ($token === null && $method !== 'GET')
        {
            $input = json_decode(file_get_contents('php://input'), true);
            $token = $input['csrf_token'] ?? null;
        }
        
        if (!validarCsrfToken($token))
        {
            http_response_code(403);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode([
                'success' => false,
                'message' => 'Token CSRF inválido. Recarregue a página e tente novamente.',
            ]);
            exit();
        }

    }

}
