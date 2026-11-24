<?php

function conectarBanco(): ?PDO
{
    $host     = getenv('DB_HOST') ?: 'localhost';
    $db_name  = getenv('DB_NAME') ?: 'victoria';
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASSWORD') ?: '';

    $dsn = "mysql:host={$host};dbname={$db_name};charset=utf8mb4";

    $opcoes = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    try
    {
        $conn = new PDO($dsn, $username, $password, $opcoes);

        return $conn;
    }

    catch (PDOException $erroConexao)
    {
        throw $erroConexao;
    }
}
