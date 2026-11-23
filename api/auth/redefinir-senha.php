<?php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
{
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido.']);
    exit();
}

require_once __DIR__ . '/../config/conexao-base.php';

$entrada = json_decode(file_get_contents('php://input'), true);
$email = trim($entrada['email'] ?? '');
$codigo = trim($entrada['codigo'] ?? '');
$novaSenha = $entrada['nova_senha'] ?? '';

if (empty($email) || empty($codigo) || strlen((string) $novaSenha) < 6)
{
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Informe e-mail, código e uma nova senha com pelo menos 6 caracteres.']);
    exit();
}

$arquivoFalhas = sys_get_temp_dir() . '/victoria_redefinir_' . md5($email) . '.txt';
$agora = time();
$falhas = [];

if (file_exists($arquivoFalhas))
{
    $conteudo = file_get_contents($arquivoFalhas);
    $falhas = array_filter(explode("\n", $conteudo), fn($ts) => ($agora - (int) $ts) < 3600);
    $falhas = array_map('intval', $falhas);
}

if (count($falhas) >= 5)
{
    http_response_code(429);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Muitas tentativas falhas. Tente novamente em 1 hora.']);
    exit();
}

$pdo = conectarBanco();

if (!$pdo)
{
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro de conexão com o banco de dados.']);
    exit();
}

$stmt = $pdo->prepare('
    SELECT id FROM usuarios
    WHERE email = :email
      AND token_recuperacao = :token
      AND expira_token > UTC_TIMESTAMP()
      AND status = 1
    LIMIT 1
');
$stmt->execute([
    ':email' => $email,
    ':token' => $codigo,
]);
$usuario = $stmt->fetch();

if (!$usuario)
{
    $falhas[] = (string) $agora;
    file_put_contents($arquivoFalhas, implode("\n", $falhas) . "\n");

    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Código inválido ou expirado. Solicite um novo código.']);
    exit();
}

$hashSenha = password_hash((string) $novaSenha, PASSWORD_DEFAULT);

$atualizar = $pdo->prepare('
    UPDATE usuarios
    SET senha = :senha,
        token_recuperacao = NULL,
        expira_token = NULL
    WHERE id = :id
');
$atualizar->execute([
    ':senha' => $hashSenha,
    ':id'    => $usuario['id'],
]);

if (file_exists($arquivoFalhas))
{
    unlink($arquivoFalhas);
}

echo json_encode(['sucesso' => true, 'mensagem' => 'Senha redefinida com sucesso!']);
