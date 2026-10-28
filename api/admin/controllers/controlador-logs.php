<?php

declare(strict_types=1);

namespace Victoria\Admin\Controllers;

require_once __DIR__ . '/../controlador-admin-crud.php';

use Victoria\Admin\ControladorAdminCrud;
use PDO;

class ControladorLogs extends ControladorAdminCrud
{
    public function __construct(PDO $conn, int $usuarioId)
    {
        parent::__construct($conn, $usuarioId);
        
        $this->tabela = 'logs';
        $this->moduloLog = 'admin';
        
        $this->colunasListar = [
            'l.id', 'l.modulo', 'l.acao', 'l.descricao', 'l.ip', 'l.created_at',
            "COALESCE(u.nome, 'Sistema') as usuario_nome"
        ];
        
        $this->colunasCriar = []; 
        $this->colunasAtualizar = []; 
        $this->colunasObrigatoriasCriar = [];
        $this->colunasObrigatoriasAtualizar = [];
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

        } catch (\PDOException $e) {
            error_log('[AdminCrud/Logs] ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro interno do servidor.']);
        } catch (\Exception $e) {
            error_log('[AdminCrud/Logs] ' . $e->getMessage());
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }

    }

    protected function handleGet(): void
    {
        $pagina = max(1, (int) ($_GET['pagina'] ?? 1));
        $porPg = min(100, max(10, (int) ($_GET['por_pagina'] ?? 30)));
        $offset = ($pagina - 1) * $porPg;

        $modulo = trim($_GET['modulo'] ?? '');
        $busca = trim($_GET['busca'] ?? '');
        $de = trim($_GET['de'] ?? '');
        $ate = trim($_GET['ate'] ?? '');

        $where = [];
        $params = [];

        if ($modulo !== '' && $modulo !== 'todos') {
            $where[] = 'l.modulo = ?';
            $params[] = $modulo;
        }

        if ($busca !== '') {
            $where[] = '(l.acao LIKE ? OR l.descricao LIKE ? OR COALESCE(u.nome, \'\') LIKE ?)';
            $like = '%' . $busca . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        if ($de !== '') {
            $where[] = 'l.created_at >= ?';
            $params[] = $de . ' 00:00:00';
        }

        if ($ate !== '') {
            $where[] = 'l.created_at <= ?';
            $params[] = $ate . ' 23:59:59';
        }

        $sqlWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        
        $selectCols = 'l.id, l.modulo, l.acao, l.descricao, l.ip, l.created_at, COALESCE(u.nome, \'Sistema\') as usuario_nome';
        $fromClause = 'FROM logs l LEFT JOIN usuarios u ON l.id_usuario = u.id';

        $stmt = $this->conn->prepare("SELECT COUNT(*) {$fromClause} {$sqlWhere}");
        $stmt->execute($params);
        $total = (int) $stmt->fetchColumn();

        $stmt = $this->conn->prepare("
            SELECT {$selectCols}
            {$fromClause}
            {$sqlWhere}
            ORDER BY l.created_at DESC
            LIMIT {$porPg} OFFSET {$offset}
        ");
        $stmt->execute($params);
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmtMod = $this->conn->query('SELECT DISTINCT modulo FROM logs ORDER BY modulo ASC');
        $modulos = $stmtMod->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode([
            'success' => true,
            'data' => $logs,
            'total' => $total,
            'pagina' => $pagina,
            'por_pagina' => $porPg,
            'total_paginas' => max(1, (int) ceil($total / $porPg)),
            'modulos' => $modulos,
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

        $action = $input['action'] ?? '';

        if ($action === 'limpar') {
            $dias = max(7, (int) ($input['dias'] ?? 90));

            $stmt = $this->conn->prepare('SELECT COUNT(*) FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)');
            $stmt->execute([$dias]);
            $afetados = (int) $stmt->fetchColumn();

            if ($afetados === 0) {
                echo json_encode(['success' => true, 'message' => "Nenhum log com mais de {$dias} dias para limpar.", 'removidos' => 0]);
                return;
            }

            $stmt = $this->conn->prepare('DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)');
            $stmt->execute([$dias]);

            $this->registrarLog("Removeu logs antigos", "{$afetados} registro(s) com mais de {$dias} dias removidos");

            echo json_encode(['success' => true, 'message' => "{$afetados} registro(s) de log removido(s).", 'removidos' => $afetados]);
            return;
        }

        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Ação inválida.']);
    }

    protected function buildSelectQuery(): string
    {
        
        return '';
    }

    protected function validacoesExtrasCriar(array $input): void
    {
        
    }

    protected function validacoesExtrasAtualizar(array $input, int $id): void
    {
        
    }

}
