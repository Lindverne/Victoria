<?php

require_once __DIR__ . '/../middleware/verificador-admin.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();
require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../config/registrar-log.php';
require_once __DIR__ . '/../services/servico-upload.php';

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
{
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit();
}

$uploadService = new ServicoUpload($conn, $_SESSION['usuario_id'], 'noticias');

try
{
    
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK)
    {
        $resultado = $uploadService->processarUploadArquivo($_FILES['imagem']);
        echo json_encode($resultado);
        exit();
    }

    
    $input = json_decode(file_get_contents('php://input'), true);
    $base64Payload = $input['data'] ?? $input['image'] ?? null;

    if (!empty($base64Payload))
    {
        $resultado = $uploadService->processarUploadBase64($base64Payload);
        echo json_encode($resultado);
        exit();
    }

    
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nenhum arquivo enviado. Use multipart/form-data (campo "imagem") ou base64 data URI (campo "data" ou "image").']);

}

catch (Exception $e)
{
    error_log('[Noticias/Upload] ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
