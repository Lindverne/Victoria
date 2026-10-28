<?php

require_once __DIR__ . '/../middleware/verificador-base.php';
header('Content-Type: application/json; charset=UTF-8');
include_once '../config/conexao.php';

if (!isset($_SESSION['usuario_id']))
{
    echo json_encode(['success' => false, 'message' => 'Nenhuma sessão ativa.']);
    exit();
}

$usuarioId = (int) $_SESSION['usuario_id'];

try
{
    $stmt = $conn->prepare(
        "SELECT id, nome, email, tipo_usuario, avatar, wallpaper, bio, cidade, profissao, website, telefone, data_nascimento, data_cadastro, ultimo_login
         FROM usuarios WHERE id = :id LIMIT 1",
    );
    $stmt->bindParam(':id', $usuarioId);
    $stmt->execute();

    if ($stmt->rowCount() === 0)
    {
        echo json_encode(['success' => false, 'message' => 'Sessão inválida.']);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

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
    error_log('sessao.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro interno no servidor.']);
}

?>
