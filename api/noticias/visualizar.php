<?php
require_once __DIR__ . '/../middleware/verificador-base.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();
require_once __DIR__ . '/../config/conexao.php';

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
{
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input)
{
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
    exit();
}

try
{
    $id = (int) ($input['id'] ?? 0);

    if ($id <= 0)
    {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID inválido.']);
        exit();
    }

    $stmt = $conn->prepare('UPDATE noticias SET visualizacoes = visualizacoes + 1 WHERE id = ? AND status = 1');
    $stmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'message' => 'Visualização registrada.',
    ]);
}

catch (PDOException $e)
{
    error_log('[Noticias Visualizar] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao registrar visualização.']);
}
