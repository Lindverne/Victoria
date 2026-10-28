<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../middleware/verificador.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();
require_once __DIR__ . '/../config/conexao.php';

$dados = json_decode(file_get_contents('php://input'), true);

$camposPermitidos = ['nome', 'email', 'bio', 'cidade', 'profissao', 'website', 'avatar', 'wallpaper', 'telefone', 'data_nascimento'];
$camposSet = [];
$params = [':id' => $usuario_id];

if (isset($dados['email']))
{
    $email = trim($dados['email']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Formato de e-mail inválido.']);
        exit();
    }
    
    if (isset($dados['senha_atual']))
    {
        $stmtSenha = $conn->prepare('SELECT senha FROM usuarios WHERE id = :id LIMIT 1');
        $stmtSenha->execute([':id' => $usuario_id]);
        $hash = $stmtSenha->fetchColumn();

        if (!password_verify($dados['senha_atual'], $hash))
        {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Senha atual incorreta.']);
            exit();
        }

    }

    $check = $conn->prepare('SELECT id FROM usuarios WHERE email = :email AND id != :id LIMIT 1');
    $check->execute([':email' => $email, ':id' => $usuario_id]);

    if ($check->fetch())
    {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Este e-mail já está em uso por outra conta.']);
        exit();
    }

}

foreach ($camposPermitidos as $campo)
{

    if (!isset($dados[$campo]))
    {
        continue;
    }

    $val = trim((string) $dados[$campo]);

    if ($campo === 'nome' && $val === '')
    {
        continue;
    }
    
    if ($campo === 'data_nascimento' && $val === '')
    {
        $val = null;
    }

    $camposSet[] = "$campo = :$campo";
    $params[":$campo"] = $val;
}

if (count($camposSet) === 0)
{
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nenhum dado novo fornecido.']);
    exit();
}

$sql = 'UPDATE usuarios SET ' . implode(', ', $camposSet) . ' WHERE id = :id';
try
{
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    echo json_encode(['success' => true, 'message' => 'Perfil atualizado!']);
}

catch (PDOException $e)
{
    error_log('[atualizacao.php] Erro PDO: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar no banco de dados.']);
}
