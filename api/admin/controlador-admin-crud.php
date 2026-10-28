<?php

namespace Victoria\Admin;

use PDO;
use PDOException;
use Exception;

abstract class ControladorAdminCrud
{
    protected PDO $conn;
    protected int $usuarioId;
    protected string $tabela;
    protected string $moduloLog;
    protected array $colunasListar;
    protected array $colunasCriar;
    protected array $colunasAtualizar;
    protected array $colunasObrigatoriasCriar;
    protected array $colunasObrigatoriasAtualizar;

    public function __construct(PDO $conn, int $usuarioId)
    {
        $this->conn = $conn;
        $this->usuarioId = $usuarioId;
    }

    public function handleRequest(): void
    {
        header('Content-Type: application/json; charset=UTF-8');

        $method = $_SERVER['REQUEST_METHOD'];

        try {

            if ($method === 'GET') {
                $this->handleGet();
            } elseif ($method === 'POST') {
                $this->handlePost();
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
            }

        } catch (PDOException $e) {
            error_log('[AdminCrud/' . $this->moduloLog . '] ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro interno do servidor.']);
        } catch (Exception $e) {
            error_log('[AdminCrud/' . $this->moduloLog . '] ' . $e->getMessage());
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }

    }

    protected function handleGet(): void
    {
        $stmt = $this->conn->query($this->buildSelectQuery());
        $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $dados,
            'total' => count($dados),
        ]);
    }

    protected function handlePost(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
            return;
        }

        
        if (isset($input['action']) && $input['action'] === 'delete') {
            $this->handleDelete($input);
            return;
        }

        
        if (!isset($input['id'])) {
            $this->handleCreate($input);
        } else {
            $this->handleUpdate($input);
        }

    }

    protected function handleDelete(array $input): void
    {
        $id = (int) ($input['id'] ?? 0);

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID inválido.']);
            return;
        }

        if ($id === $this->usuarioId) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Você não pode excluir seu próprio registro.']);
            return;
        }

        
        $this->verificarDependenciasDelete($id);

        $stmt = $this->conn->prepare("DELETE FROM {$this->tabela} WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Registro não encontrado.']);
            return;
        }

        $this->registrarLog("Excluiu {$this->moduloLog}", "{$this->moduloLog} ID {$id} excluído");

        echo json_encode(['success' => true, 'message' => ucfirst($this->moduloLog) . ' excluído com sucesso.']);
    }

    protected function handleCreate(array $input): void
    {
        $this->validarCriar($input);

        $campos = [];
        $valores = [];
        $placeholders = [];

        foreach ($this->colunasCriar as $campo) {

            if (!isset($input[$campo])) continue;
            $valor = $this->sanitizarValor($campo, $input[$campo]);
            $campos[] = $campo;
            $valores[] = $valor;
            $placeholders[] = '?';
        }

        
        $campos[] = 'created_at';
        $valores[] = date('Y-m-d H:i:s');
        $placeholders[] = '?';

        $sql = "INSERT INTO {$this->tabela} (" . implode(', ', $campos) . ") VALUES (" . implode(', ', $placeholders) . ")";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($valores);

        $novoId = (int) $this->conn->lastInsertId();

        $this->registrarLog("Criou {$this->moduloLog}", "{$this->moduloLog} ID {$novoId} criado");

        echo json_encode([
            'success' => true,
            'message' => ucfirst($this->moduloLog) . ' criado com sucesso.',
            'id' => $novoId,
        ]);
    }

    protected function handleUpdate(array $input): void
    {
        $id = (int) $input['id'];

        $this->validarAtualizar($input, $id);

        
        $stmt = $this->conn->prepare("SELECT id FROM {$this->tabela} WHERE id = ?");
        $stmt->execute([$id]);

        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Registro não encontrado.']);
            return;
        }

        $campos = [];
        $valores = [];

        foreach ($this->colunasAtualizar as $campo) {

            if (!array_key_exists($campo, $input)) continue;
            $valor = $this->sanitizarValor($campo, $input[$campo]);
            $campos[] = "$campo = ?";
            $valores[] = $valor;
        }

        if (empty($campos)) {
            echo json_encode(['success' => true, 'message' => 'Nenhum campo para atualizar.']);
            return;
        }

        
        $campos[] = 'updated_at = ?';
        $valores[] = date('Y-m-d H:i:s');

        $valores[] = $id;
        $sql = "UPDATE {$this->tabela} SET " . implode(', ', $campos) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($valores);

        $this->registrarLog("Editou {$this->moduloLog}", "{$this->moduloLog} ID {$id} atualizado");

        echo json_encode(['success' => true, 'message' => ucfirst($this->moduloLog) . ' atualizado com sucesso.']);
    }

    protected function buildSelectQuery(): string
    {
        $colunas = implode(', ', $this->colunasListar);
        return "SELECT {$colunas} FROM {$this->tabela} ORDER BY created_at DESC";
    }

    protected function validarCriar(array $input): void
    {

        foreach ($this->colunasObrigatoriasCriar as $campo) {

            if (empty($input[$campo])) {
                throw new Exception(ucfirst($campo) . ' é obrigatório.');
            }

        }

        $this->validacoesExtrasCriar($input);
    }

    protected function validarAtualizar(array $input, int $id): void
    {

        foreach ($this->colunasObrigatoriasAtualizar as $campo) {

            if (empty($input[$campo])) {
                throw new Exception(ucfirst($campo) . ' é obrigatório.');
            }

        }

        $this->validacoesExtrasAtualizar($input, $id);
    }

    protected function sanitizarValor(string $campo, mixed $valor): mixed
    {

        if (is_string($valor)) {
            return trim($valor);
        }

        return $valor;
    }

    protected function verificarDependenciasDelete(int $id): void
    {
        
    }

    protected function validacoesExtrasCriar(array $input): void
    {
        
    }

    protected function validacoesExtrasAtualizar(array $input, int $id): void
    {
        
    }

    protected function registrarLog(string $acao, string $descricao): void
    {
        $stmt = $this->conn->prepare('INSERT INTO logs (id_usuario, modulo, acao, descricao, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $this->usuarioId,
            $this->moduloLog,
            $acao,
            $descricao,
            $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
            $_SERVER['HTTP_USER_AGENT'] ?? '',
        ]);
    }

}
