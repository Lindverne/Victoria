<?php

require_once __DIR__ . '/../middleware/verificador-base.php';

header('Content-Type: application/json; charset=UTF-8');

$horaAtual    = (int) date('G');
$janelaAtiva  = $horaAtual >= 6 && $horaAtual < 23;
$emManutencao = crc32(date('Y-m-d-H') . 'victoria') % 10 === 0;

$online = $janelaAtiva && !$emManutencao;

echo json_encode([
    'success' => true,
    'online'  => $online,
]);
