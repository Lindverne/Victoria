<?php

/*

  Código Legado do Morango (ば•ᴗ•ば) - Logout.php

    session_start();
    $_SESSION = array();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    session_destroy();
    header("Location: ../HTML/Login.php");
    exit();

 */

require_once __DIR__ . '/../middleware/verificador-base.php';
require_once __DIR__ . '/../middleware/verificador-csrf.php';
verificarCsrf();
header('Content-Type: application/json; charset=UTF-8');

$_SESSION = [];
setcookie(session_name(), '', time() - 3600, '/', '', false, true);
session_destroy();

echo json_encode(['status' => 'ok']);
