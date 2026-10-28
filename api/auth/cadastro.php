<?php

require_once __DIR__ . '/../middleware/verificador-base.php';
header('Content-Type: application/json; charset=UTF-8');
include_once '../config/conexao.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();

$data = json_decode(file_get_contents('php://input'));

if (!$data || empty($data->nome) || empty($data->email) || empty($data->senha))
{
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos.']);
    exit();
}

if (!filter_var($data->email, FILTER_VALIDATE_EMAIL))
{
    echo json_encode(['success' => false, 'message' => 'E-mail inválido.']);
    exit();
}

if (strlen($data->senha) < 6)
{
    echo json_encode(['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres.']);
    exit();
}

$tipoUsuario = 1;

try
{
    $check = $conn->prepare('SELECT id FROM usuarios WHERE email = :email');
    $check->bindParam(':email', $data->email);
    $check->execute();

    if ($check->rowCount() > 0)
    {
        echo json_encode(['success' => false, 'message' => 'Este e-mail já está cadastrado.']);
        exit();
    }

    $senha_hash = password_hash($data->senha, PASSWORD_DEFAULT);

    $stmt = $conn->prepare('INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (:nome, :email, :senha, :tipo_usuario)');
    $stmt->bindParam(':nome', $data->nome);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':senha', $senha_hash);
    $stmt->bindParam(':tipo_usuario', $tipoUsuario, PDO::PARAM_INT);

    if ($stmt->execute())
    {
        echo json_encode([
            'success' => true,
            'message' => 'Cadastro realizado com sucesso!',
        ]);
    }

    else
    {
        echo json_encode(['success' => false, 'message' => 'Não foi possível cadastrar.']);
    }

}

catch (PDOException $e)
{
    error_log('cadastro.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro interno no servidor.']);
}

?>
