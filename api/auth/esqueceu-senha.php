<?php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
{
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido.']);
    exit();
}

require_once __DIR__ . '/../config/conexao-base.php';
require_once __DIR__ . '/../config/email.php';

$entrada = json_decode(file_get_contents('php://input'), true);
$email = trim($entrada['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL))
{
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Informe um e-mail válido.']);
    exit();
}

$arquivoLimite = sys_get_temp_dir() . '/victoria_recuperacao_' . md5($email) . '.txt';
$agora = time();
$tentativas = [];

if (file_exists($arquivoLimite))
{
    $conteudo = file_get_contents($arquivoLimite);
    $tentativas = array_filter(explode("\n", $conteudo), fn($ts) => ($agora - (int) $ts) < 3600);
}

if (count($tentativas) >= 3)
{
    http_response_code(429);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Muitas solicitações para este e-mail. Tente novamente em 1 hora.']);
    exit();
}

$tentativas[] = (string) $agora;
file_put_contents($arquivoLimite, implode("\n", $tentativas) . "\n");

$pdo = conectarBanco();

if (!$pdo)
{
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro de conexão com o banco de dados.']);
    exit();
}

$stmt = $pdo->prepare('SELECT id, nome FROM usuarios WHERE email = :email AND status = 1 LIMIT 1');
$stmt->execute([':email' => $email]);
$usuario = $stmt->fetch();

if (!$usuario)
{
    echo json_encode(['sucesso' => true, 'mensagem' => 'Se o e-mail estiver cadastrado, enviaremos um código de recuperação.']);
    exit();
}

$codigo = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

$atualizar = $pdo->prepare('
    UPDATE usuarios
    SET token_recuperacao = :token,
        expira_token = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE)
    WHERE id = :id
');
$atualizar->execute([
    ':token' => $codigo,
    ':id'    => $usuario['id'],
]);

$nomeSeguro = htmlspecialchars($usuario['nome'], ENT_QUOTES, 'UTF-8');
$html = "
    <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;'>
        <h2 style='color: #1e293b;'>Olá, {$nomeSeguro}!</h2>
        <p style='color: #475569;'>Recebemos uma solicitação para redefinir a sua senha no Victória.</p>
        <p style='color: #475569;'>Use o código abaixo:</p>
        <div style='background: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;'>
            <span style='font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb;'>{$codigo}</span>
        </div>
        <p style='color: #64748b; font-size: 13px;'>Este código expira em 30 minutos. Se você não pediu essa alteração, ignore este e-mail.</p>
    </div>
";

$enviado = enviarEmailComResend($email, 'Código de Recuperação de Senha - Victória', $html);

if (!$enviado)
{
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Não foi possível enviar o e-mail agora. Tente novamente.']);
    exit();
}

echo json_encode(['sucesso' => true, 'mensagem' => 'Se o e-mail estiver cadastrado, enviaremos um código de recuperação.']);
