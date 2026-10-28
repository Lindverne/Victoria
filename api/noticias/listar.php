<?php
require_once __DIR__ . '/../config/conexao.php';

header('Content-Type: application/json; charset=UTF-8');

try
{
    $admin = isset($_GET['admin']) && $_GET['admin'] === '1';
    $limite = isset($_GET['limite']) ? (int) $_GET['limite'] : 20;
    $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
    $categoria = $_GET['categoria'] ?? '';
    $destaque = isset($_GET['destaque']) ? (int) $_GET['destaque'] : null;

    $where = [];
    $params = [];

    if (!$admin)
    {
        $where[] = 'n.status = 1';
    }

    if (!empty($categoria))
    {
        $where[] = 'n.categoria = ?';
        $params[] = $categoria;
    }

    if ($destaque !== null)
    {
        $where[] = 'n.destaque = ?';
        $params[] = $destaque;
    }

    $whereClause = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $stmt = $conn->prepare("SELECT COUNT(*) FROM noticias n {$whereClause}");
    $stmt->execute($params);
    $total = (int) $stmt->fetchColumn();

    $stmt = $conn->prepare("
        SELECT n.id, n.titulo, n.resumo, n.conteudo, n.imagem_capa, n.categoria,
               n.fonte, n.destaque, n.status, n.visualizacoes,
               DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
               COALESCE(u.nome, 'Redação') as autor_nome
        FROM noticias n
        LEFT JOIN usuarios u ON n.id_autor = u.id
        {$whereClause}
        ORDER BY n.destaque DESC, n.created_at DESC
        LIMIT {$limite} OFFSET {$offset}
    ");
    $stmt->execute($params);
    $noticias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $conn->query('SELECT DISTINCT categoria FROM noticias WHERE status = 1 ORDER BY categoria');
    $categorias = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'success' => true,
        'data' => $noticias,
        'total' => $total,
        'categorias' => $categorias,
    ]);
}

catch (PDOException $e)
{
    error_log('[Noticias Listar] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao carregar notícias.',
    ]);
}
