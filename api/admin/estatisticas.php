<?php
require_once __DIR__ . '/../middleware/verificador-admin.php';
require_once __DIR__ . '/../config/conexao.php';

header('Content-Type: application/json; charset=UTF-8');

try
{
    $stmt = $conn->query('SELECT COUNT(*) FROM usuarios');
    $totalUsuarios = (int) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT COUNT(*) FROM usuarios WHERE status = 1');
    $usuariosAtivos = (int) $stmt->fetchColumn();

    $stmt = $conn->query("SELECT COUNT(*) FROM usuarios WHERE DATE_FORMAT(data_cadastro, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')");
    $novosUsuariosMes = (int) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT COUNT(*) FROM empresas');
    $totalEmpresas = (int) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT COUNT(*) FROM empresas WHERE status = 1');
    $empresasAtivas = (int) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT COUNT(*) FROM noticias');
    $totalNoticias = (int) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT COUNT(*) FROM noticias WHERE status = 1');
    $noticiasPublicadas = (int) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT COUNT(*) FROM gastos');
    $totalGastos = (int) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT ROUND(AVG(consumo_m3), 2) FROM gastos');
    $consumoMedio = (float) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT ROUND(SUM(valor_estimado), 2) FROM gastos');
    $valorTotalEstimado = (float) $stmt->fetchColumn();

    $stmt = $conn->query('SELECT tipo_usuario, COUNT(*) as total FROM usuarios GROUP BY tipo_usuario ORDER BY tipo_usuario');
    $usuariosPorTipo = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    $stmt = $conn->query("
        SELECT l.id, l.modulo, l.acao, l.descricao, l.ip, l.created_at,
               COALESCE(u.nome, 'Sistema') as usuario_nome
        FROM logs l
        LEFT JOIN usuarios u ON l.id_usuario = u.id
        ORDER BY l.created_at DESC
        LIMIT 10
    ");
    $ultimosLogs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $conn->query("
        SELECT DATE_FORMAT(data_cadastro, '%Y-%m') as mes, COUNT(*) as total
        FROM usuarios
        WHERE data_cadastro >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(data_cadastro, '%Y-%m')
        ORDER BY mes ASC
    ");
    $cadastrosPorMes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $conn->query("
        SELECT DATE_FORMAT(data_leitura, '%Y-%m') as mes, ROUND(AVG(consumo_m3), 2) as media
        FROM gastos
        WHERE data_leitura >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(data_leitura, '%Y-%m')
        ORDER BY mes ASC
    ");
    $consumoPorMes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => [
            'total_usuarios' => $totalUsuarios,
            'usuarios_ativos' => $usuariosAtivos,
            'novos_usuarios_mes' => $novosUsuariosMes,
            'total_empresas' => $totalEmpresas,
            'empresas_ativas' => $empresasAtivas,
            'total_noticias' => $totalNoticias,
            'noticias_publicadas' => $noticiasPublicadas,
            'total_gastos' => $totalGastos,
            'consumo_medio' => $consumoMedio,
            'valor_total_estimado' => $valorTotalEstimado,
            'usuarios_por_tipo' => $usuariosPorTipo,
            'ultimos_logs' => $ultimosLogs,
            'cadastros_por_mes' => $cadastrosPorMes,
            'consumo_por_mes' => $consumoPorMes,
        ],
    ]);
}

catch (PDOException $e)
{
    error_log('[Admin Stats] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao carregar estatísticas.',
    ]);
}
