<?php

require_once __DIR__ . '/../middleware/verificador-base.php';
header('Content-Type: application/json; charset=UTF-8');
include_once '../config/conexao.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();

$data = json_decode(file_get_contents('php://input'));

if (!$data || empty($data->email) || empty($data->senha))
{
    echo json_encode(['success' => false, 'message' => 'Preencha e-mail e senha.']);
    exit();
}

try
{
    $stmt = $conn->prepare(
        "SELECT id, nome, email, senha, tipo_usuario, avatar, wallpaper, bio, cidade, profissao, website, telefone, data_nascimento, data_cadastro, ultimo_login
         FROM usuarios WHERE email = :email LIMIT 1",
    );
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if ($stmt->rowCount() === 0)
    {
        echo json_encode(['success' => false, 'message' => 'E-mail ou senha incorretos.']);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!password_verify($data->senha, $user['senha']))
    {
        echo json_encode(['success' => false, 'message' => 'E-mail ou senha incorretos.']);
        exit();
    }

    $_SESSION['usuario_id'] = $user['id'];

    
    session_regenerate_id(true);

    $upd = $conn->prepare('UPDATE usuarios SET ultimo_login = NOW() WHERE id = :id');
    $upd->bindParam(':id', $user['id']);
    $upd->execute();

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'nome' => $user['nome'],
            'email' => $user['email'],
            'tipo_usuario' => (int) $user['tipo_usuario'],
            'avatar' => $user['avatar'] ?? '',
            'wallpaper' => $user['wallpaper'] ?? '',
            'bio' => $user['bio'] ?? '',
            'cidade' => $user['cidade'] ?? '',
            'profissao' => $user['profissao'] ?? '',
            'website' => $user['website'] ?? '',
            'telefone' => $user['telefone'] ?? '',
            'data_nascimento' => $user['data_nascimento'] ?? '',
            'data_cadastro' => $user['data_cadastro'] ?? '',
            'ultimo_login' => $user['ultimo_login'] ?? '',
        ],
    ]);
}

catch (PDOException $e)
{
    error_log('login.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro interno no servidor.']);
}

?>
