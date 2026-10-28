<?php

/*

  Legado do Morango (≥◡≤)♡ - Conexão.php

    $con = mysqli_connect("sql108.infinityfree.com", "if0_42098659", "gzBqg2hzPEq", "if0_42098659_VictoriaTestDB");

    if(!$con){
        die("Erro ao conectar, comece a rezar..");
        echo "erro";
    }

*/

require_once __DIR__ . '/conexao-base.php';

$conn = conectarBanco();

if ($conn === null)
{
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro de conexão com o banco de dados.',
    ]);
    exit();
}
