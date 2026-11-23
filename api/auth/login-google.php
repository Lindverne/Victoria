<?php

require_once __DIR__ . '/../middleware/verificador-base.php';
header('Content-Type: application/json; charset=UTF-8');
include_once '../config/conexao.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();

$idClienteGoogle = getenv('GOOGLE_CLIENT_ID');

if (empty($idClienteGoogle))
{
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Configuração do Google não encontrada no servidor.',
    ]);
    exit();
}

$entrada = json_decode(file_get_contents('php://input'), true);
$tokenId = trim($entrada['id_token'] ?? '');

if (empty($tokenId))
{
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Token do Google não informado.',
    ]);
    exit();
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'desconhecido';
$arquivoLimite = sys_get_temp_dir() . '/victoria_ratelimit_' . md5($ip) . '.txt';
$agora = time();
$tentativas = [];

if (file_exists($arquivoLimite))
{
    $conteudo = file_get_contents($arquivoLimite);
    $tentativas = array_filter(explode("\n", $conteudo), fn($ts) => ($agora - (int) $ts) < 60);
}

if (count($tentativas) >= 10)
{
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Muitas tentativas. Tente novamente em 1 minuto.',
    ]);
    exit();
}

$tentativas[] = (string) $agora;
$manipulador = fopen($arquivoLimite, 'c');
if ($manipulador !== false)
{
    flock($manipulador, LOCK_EX);
    ftruncate($manipulador, 0);
    fwrite($manipulador, implode("\n", $tentativas) . "\n");
    fflush($manipulador);
    flock($manipulador, LOCK_UN);
    fclose($manipulador);
}
else
{
    file_put_contents($arquivoLimite, implode("\n", $tentativas) . "\n");
}

$partesJwt = explode('.', $tokenId);
if (count($partesJwt) !== 3)
{
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Formato de token inválido.',
    ]);
    exit();
}

$urlValidacao = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($tokenId);

$curl = curl_init($urlValidacao);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($curl, CURLOPT_TIMEOUT, 10);
$resposta = curl_exec($curl);
$codigoHttp = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($codigoHttp !== 200 || empty($resposta))
{
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Token do Google inválido ou expirado.',
    ]);
    exit();
}

$dadosGoogle = json_decode($resposta, true);

if (empty($dadosGoogle['email']) || ($dadosGoogle['aud'] ?? '') !== $idClienteGoogle)
{
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Token do Google inválido ou expirado.',
    ]);
    exit();
}

$email = $dadosGoogle['email'];
$nome  = $dadosGoogle['name'] ?? explode('@', $email)[0];
$foto  = $dadosGoogle['picture'] ?? null;

try
{
    $stmt = $conn->prepare('SELECT id, nome, email, tipo_usuario, status, avatar FROM usuarios WHERE email = :email LIMIT 1');
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario)
    {
        if ((int) $usuario['status'] !== 1)
        {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Esta conta está desativada.',
            ]);
            exit();
        }

        $upd = $conn->prepare('UPDATE usuarios SET ultimo_login = NOW(), email_verificado = 1 WHERE id = :id');
        $upd->bindParam(':id', $usuario['id']);
        $upd->execute();
    }
    else
    {
        $senhaHash = password_hash(bin2hex(random_bytes(32)), PASSWORD_DEFAULT);

        $ins = $conn->prepare('
            INSERT INTO usuarios (nome, email, senha, tipo_usuario, status, email_verificado, ultimo_login, avatar)
            VALUES (:nome, :email, :senha, 1, 1, 1, NOW(), :avatar)
        ');
        $ins->bindParam(':nome', $nome);
        $ins->bindParam(':email', $email);
        $ins->bindParam(':senha', $senhaHash);
        $ins->bindParam(':avatar', $foto);
        $ins->execute();

        $stmt = $conn->prepare('SELECT id, nome, email, tipo_usuario, status, avatar FROM usuarios WHERE email = :email LIMIT 1');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    $_SESSION['usuario_id'] = (int) $usuario['id'];
    session_regenerate_id(true);

    echo json_encode([
        'success' => true,
        'message' => 'Login com Google realizado com sucesso!',
        'user' => [
            'id'           => (int) $usuario['id'],
            'nome'         => $usuario['nome'],
            'email'        => $usuario['email'],
            'tipo_usuario' => (int) $usuario['tipo_usuario'],
            'avatar'       => $usuario['avatar'] ?? '',
        ],
    ]);
}

catch (PDOException $erro)
{
    error_log('login-google.php: ' . $erro->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro interno no servidor.',
    ]);
}
