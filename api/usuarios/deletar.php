<?php

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../middleware/verificador.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();
require_once __DIR__ . '/../config/conexao.php';

try
{
    $stmt = $conn->prepare('SELECT senha, tipo_usuario FROM usuarios WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $usuario_id]);
    $usuario = $stmt->fetch();

    if ($usuario === false)
    {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Conta não encontrada.']);
        exit();
    }

    if ((int) $usuario['tipo_usuario'] >= 2)
    {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Administradores não podem excluir a própria conta pelo perfil.']);
        exit();
    }

    $dados = json_decode(file_get_contents('php://input'), true);
    $senhaAtual = (string) ($dados['senha_atual'] ?? '');

    if ($senhaAtual === '' || !password_verify($senhaAtual, $usuario['senha']))
    {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Senha atual incorreta.']);
        exit();
    }

    $stmt = $conn->prepare('DELETE FROM gastos WHERE id_usuario = :id');
    $stmt->execute([':id' => $usuario_id]);

    $stmt = $conn->prepare('DELETE FROM noticias WHERE id_autor = :id');
    $stmt->execute([':id' => $usuario_id]);

    $stmt = $conn->prepare('DELETE FROM usuarios WHERE id = :id');
    $stmt->execute([':id' => $usuario_id]);

    session_destroy();

    echo json_encode(['success' => true, 'message' => 'Conta excluída com sucesso.']);
}

catch (PDOException $e)
{
    error_log('[deletar.php] Erro PDO: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao excluir a conta do banco de dados.']);
}
