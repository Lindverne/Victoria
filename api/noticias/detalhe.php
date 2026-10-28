<?php

require_once __DIR__ . '/../config/conexao.php';

header('Content-Type: application/json; charset=UTF-8');

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($id <= 0)
{
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID inválido.']);
    exit();
}

try
{
    $stmt = $conn->prepare("
        SELECT n.id, n.titulo, n.resumo, n.conteudo, n.imagem_capa, n.categoria,
               n.fonte, n.destaque, n.status, n.visualizacoes,
               DATE_FORMAT(n.created_at, '%d/%m/%Y às %H:%i') as data,
               COALESCE(u.nome, 'Redação') as autor_nome,
               u.avatar as autor_avatar
        FROM noticias n
        LEFT JOIN usuarios u ON n.id_autor = u.id
        WHERE n.id = ? AND n.status = 1
        LIMIT 1
    ");
    $stmt->execute([$id]);
    $noticia = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$noticia)
    {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Notícia não encontrada.']);
        exit();
    }

    echo json_encode(['success' => true, 'data' => $noticia]);
}

catch (PDOException $e)
{
    error_log('[Noticias Detalhe] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao carregar notícia.']);
}
