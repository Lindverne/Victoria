<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../middleware/verificador.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();
require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../config/registrar-log.php';

$dados = json_decode(file_get_contents('php://input'), true);

if (empty($dados['data_leitura']) || !isset($dados['consumo_m3']))
{
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Informe data_leitura e consumo_m3.',
    ]);
    exit();
}

$data_leitura = $dados['data_leitura'];
$consumo_m3 = (float) $dados['consumo_m3'];
$valor_estimado = isset($dados['valor_estimado']) ? (float) $dados['valor_estimado'] : 0;
$area_imovel = isset($dados['area_imovel']) ? (float) $dados['area_imovel'] : null;
$num_moradores = isset($dados['numero_moradores']) ? (int) $dados['numero_moradores'] : null;
$status_consumo = isset($dados['status_consumo']) ? (int) $dados['status_consumo'] : 1;
$observacao = trim($dados['observacao'] ?? '');

try
{
    $stmt = $conn->prepare("
        INSERT INTO gastos (id_usuario, data_leitura, consumo_m3, valor_estimado,
                            area_imovel, numero_moradores, status_consumo, observacao)
        VALUES (:id_usuario, :data_leitura, :consumo_m3, :valor_estimado,
                :area_imovel, :numero_moradores, :status_consumo, :observacao)
    ");

    $stmt->execute([
        ':id_usuario' => $usuario_id,
        ':data_leitura' => $data_leitura,
        ':consumo_m3' => $consumo_m3,
        ':valor_estimado' => $valor_estimado,
        ':area_imovel' => $area_imovel,
        ':numero_moradores' => $num_moradores,
        ':status_consumo' => $status_consumo,
        ':observacao' => $observacao ?: null,
    ]);

    $novoId = $conn->lastInsertId();

    registrarLog($conn, $usuario_id, 'gastos', 'Registrou leitura', "Leitura ID {$novoId} registrada — {$consumo_m3} m³");

    echo json_encode([
        'success' => true,
        'message' => 'Gasto registrado com sucesso!',
        'id' => (int) $novoId,
    ]);
}

catch (Exception $e)
{
    error_log('[Gastos/Criar] ' . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ]);
}

catch (PDOException $e)
{
    error_log('[Gastos/Criar] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao registrar gasto.',
    ]);
}
