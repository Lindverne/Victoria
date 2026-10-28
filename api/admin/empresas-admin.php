<?php

require_once __DIR__ . '/controllers/controlador-empresas.php';
require_once __DIR__ . '/../middleware/verificador-admin.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
require_once __DIR__ . '/../config/conexao.php';

verificarCsrf();

$controller = new \Victoria\Admin\Controllers\ControladorEmpresas($conn, (int) $_SESSION['usuario_id']);
$controller->handleRequest();
