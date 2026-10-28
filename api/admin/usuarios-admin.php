<?php
require_once __DIR__ . '/../middleware/verificador-admin.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();
require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../config/registrar-log.php';

header('Content-Type: application/json; charset=UTF-8');

$method = $_SERVER['REQUEST_METHOD'];

try
{

    if ($method === 'GET')
    {
        $stmt = $conn->query("
            SELECT id, nome, email, tipo_usuario, status, email_verificado,
                   DATE_FORMAT(data_cadastro, '%Y-%m-%d %H:%i:%s') as data_cadastro,
                   DATE_FORMAT(ultimo_login, '%Y-%m-%d %H:%i:%s') as ultimo_login,
                   cidade, profissao, telefone
            FROM usuarios
            ORDER BY data_cadastro DESC
        ");
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $usuarios,
            'total' => count($usuarios),
        ]);
        exit();
    }

    if ($method === 'POST')
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input)
        {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
            exit();
        }

        if (isset($input['action']) && $input['action'] === 'delete')
        {
            $id = (int) ($input['id'] ?? 0);

            if ($id <= 0)
            {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID inválido.']);
                exit();
            }

            if ($id === (int) $_SESSION['usuario_id'])
            {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Você não pode excluir seu próprio usuário.']);
                exit();
            }

            
            $stmtCheck = $conn->prepare('SELECT tipo_usuario FROM usuarios WHERE id = ?');
            $stmtCheck->execute([$id]);
            $targetUser = $stmtCheck->fetch();

            if (!$targetUser)
            {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Usuário não encontrado.']);
                exit();
            }

            $targetTipo = (int) $targetUser['tipo_usuario'];
            $currentUserTipo = 2; 

            
            
            if ($targetTipo >= $currentUserTipo)
            {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Permissão insuficiente para excluir este usuário.']);
                exit();
            }

            $stmt = $conn->prepare('DELETE FROM usuarios WHERE id = ?');
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0)
            {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Usuário não encontrado.']);
                exit();
            }

            registrarLog($conn, $_SESSION['usuario_id'], 'admin', 'Excluiu usuário', "Usuário ID {$id} excluído");

            echo json_encode(['success' => true, 'message' => 'Usuário excluído com sucesso.']);
            exit();
        }

        if (!isset($input['id']))
        {
            $nome = trim($input['nome'] ?? '');
            $email = trim($input['email'] ?? '');
            $senha = $input['senha'] ?? '';
            $tipo = (int) ($input['tipo_usuario'] ?? 1);
            $status = (int) ($input['status'] ?? 1);

            if (empty($nome) || empty($email) || empty($senha))
            {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Nome, email e senha são obrigatórios.']);
                exit();
            }

            if (strlen($senha) < 6)
            {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Senha deve ter no mínimo 6 caracteres.']);
                exit();
            }

            $stmt = $conn->prepare('SELECT id FROM usuarios WHERE email = ?');
            $stmt->execute([$email]);

            if ($stmt->fetch())
            {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'Este email já está cadastrado.']);
                exit();
            }

            $hash = password_hash($senha, PASSWORD_DEFAULT);

            
            
            $tipo = 1;

            $stmt = $conn->prepare('INSERT INTO usuarios (nome, email, senha, tipo_usuario, status) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$nome, $email, $hash, $tipo, $status]);
            $novoId = (int) $conn->lastInsertId();

            registrarLog($conn, $_SESSION['usuario_id'], 'admin', 'Criou usuário', "Usuário {$nome} (ID {$novoId}) criado");

            echo json_encode(['success' => true, 'message' => 'Usuário criado com sucesso.', 'id' => $novoId]);
            exit();
        }

        $id = (int) $input['id'];
        $nome = trim($input['nome'] ?? '');
        $email = trim($input['email'] ?? '');
        $tipo = (int) ($input['tipo_usuario'] ?? 1);
        $status = (int) ($input['status'] ?? 1);

        if (empty($nome) || empty($email))
        {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Nome e email são obrigatórios.']);
            exit();
        }

        
        $stmtCheck = $conn->prepare('SELECT tipo_usuario FROM usuarios WHERE id = ?');
        $stmtCheck->execute([$id]);
        $targetUser = $stmtCheck->fetch();

        if (!$targetUser)
        {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Usuário não encontrado.']);
            exit();
        }

        $targetTipo = (int) $targetUser['tipo_usuario'];
        $currentUserTipo = 2; 

        
        if ($targetTipo >= $currentUserTipo)
        {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Permissão insuficiente para editar este usuário.']);
            exit();
        }

        
        $tipo = 1;

        $stmt = $conn->prepare('SELECT id FROM usuarios WHERE email = ? AND id != ?');
        $stmt->execute([$email, $id]);

        if ($stmt->fetch())
        {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Este email já está em uso por outro usuário.']);
            exit();
        }

        $stmt = $conn->prepare('UPDATE usuarios SET nome = ?, email = ?, tipo_usuario = ?, status = ? WHERE id = ?');
        $stmt->execute([$nome, $email, $tipo, $status, $id]);

        registrarLog($conn, $_SESSION['usuario_id'], 'admin', 'Editou usuário', "Usuário ID {$id} atualizado");

        echo json_encode(['success' => true, 'message' => 'Usuário atualizado com sucesso.']);
        exit();
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
}

catch (PDOException $e)
{
    error_log('[Admin Usuarios] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor.']);
}
