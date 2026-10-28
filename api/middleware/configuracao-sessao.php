<?php

require_once __DIR__ . '/../config/urls.php';

$duracao = 30 * 24 * 60 * 60; 

$sessionPath = __DIR__ . '/../../sessions';

if (!is_dir($sessionPath))
{
    @mkdir($sessionPath, 0750, true);
}

$sessionPath = realpath($sessionPath);

if ($sessionPath !== false)
{
    session_save_path($sessionPath);
}

ini_set('session.gc_maxlifetime', $duracao);
ini_set('session.cookie_lifetime', $duracao);
ini_set('session.use_strict_mode', 1);

session_set_cookie_params([
    'lifetime' => $duracao,
    'path' => '/',
    'domain' => '',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Lax',
]);

if (!isset($_SESSION))
{
    session_start();
}

if (isset($_SESSION['usuario_id']))
{
    $isSecure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    setcookie(session_name(), session_id(), time() + $duracao, '/', '', $isSecure, true);

    $_SESSION['_ultima_atividade'] = time();
}
