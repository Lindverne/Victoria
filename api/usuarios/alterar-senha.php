<?php

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../middleware/verificador.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();
require_once __DIR__ . '/../config/conexao.php';

$dados = json_decode(file_get_contents('php://input'), true);

$senhaAtual   = (string) ($dados['senha_atual'] ?? '');
$novaSenha    = (string) ($dados['nova_senha'] ?? '');
$confirmarSenha = (string) ($dados['confirmar_senha'] ?? '');

if ($senhaAtual === '' || $novaSenha === '' || $confirmarSenha === '')
{
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos de senha.']);
    exit();
}

if (strlen($novaSenha) < 6)
{
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'A nova senha deve ter no mínimo 6 caracteres.']);
    exit();
}

if ($novaSenha !== $confirmarSenha)
{
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'A nova senha e a confirmação não coincidem.']);
    exit();
}

try
{
    $stmt = $conn->prepare('SELECT senha FROM usuarios WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $usuario_id]);
    $hash = $stmt->fetchColumn();

    if ($hash === false || !password_verify($senhaAtual, $hash))
    {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Senha atual incorreta.']);
        exit();
    }

    if (password_verify($novaSenha, $hash))
    {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'A nova senha deve ser diferente da senha atual.']);
        exit();
    }

    $stmt = $conn->prepare('UPDATE usuarios SET senha = :senha WHERE id = :id');
    $stmt->execute([':senha' => password_hash($novaSenha, PASSWORD_DEFAULT), ':id' => $usuario_id]);

    echo json_encode(['success' => true, 'message' => 'Senha alterada com sucesso!']);
}

catch (PDOException $e)
{
    error_log('[alterar-senha.php] Erro PDO: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar a senha no banco de dados.']);
}
