<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../middleware/verificador.php';
require_once __DIR__ . '/../config/conexao.php';

try
{
    $stmt = $conn->prepare("
        SELECT id, data_leitura, consumo_m3, valor_estimado, area_imovel,
               numero_moradores, status_consumo, observacao, created_at
        FROM gastos
        WHERE id_usuario = :id_usuario
        ORDER BY data_leitura DESC, created_at DESC
    ");
    $stmt->execute([':id_usuario' => $usuario_id]);
    $gastos = $stmt->fetchAll();

    $resultado = array_map(function ($g) {
        $dataBR = date('d/m/Y', strtotime($g['data_leitura']));
        $statusLabel = (int) $g['status_consumo'] === 2 ? 'Social' : 'Normal';

        return [
            'id' => (int) $g['id'],
            'data' => $dataBR,
            'data_leitura' => $g['data_leitura'],
            'consumo' => number_format((float) $g['consumo_m3'], 2, ',', '') . ' m³',
            'consumo_m3' => (float) $g['consumo_m3'],
            'valor_estimado' => (float) $g['valor_estimado'],
            'area_imovel' => $g['area_imovel'] ? (float) $g['area_imovel'] : null,
            'numero_moradores' => $g['numero_moradores'] ? (int) $g['numero_moradores'] : null,
            'status' => $statusLabel,
            'status_consumo' => (int) $g['status_consumo'],
            'observacao' => $g['observacao'],
            'created_at' => $g['created_at'],
        ];
    }, $gastos);

    echo json_encode([
        'success' => true,
        'gastos' => $resultado,
    ]);
}

catch (PDOException $e)
{
    error_log('[Gastos/Listar] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao listar gastos.',
    ]);
}
