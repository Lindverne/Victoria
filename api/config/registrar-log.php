<?php

function registrarLog($conn, $usuarioId, $modulo, $acao, $descricao)
{
    $stmt = $conn->prepare('INSERT INTO logs (id_usuario, modulo, acao, descricao, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $usuarioId,
        $modulo,
        $acao,
        $descricao,
        $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        $_SERVER['HTTP_USER_AGENT'] ?? '',
    ]);
}
