<?php

function conectarBanco(): ?PDO
{
    $host     = getenv('DB_HOST') ?: 'localhost';
    $db_name  = getenv('DB_NAME') ?: 'victoria';
    $username = getenv('DB_USER') ?: 'Lindverne';
    $password = getenv('DB_PASSWORD') ?: '1234';
    $port     = (int) (getenv('DB_PORT') ?: 3306);
    $ssl_ca   = getenv('DB_SSL_CA');

    $dsn = "mysql:host={$host};port={$port};dbname={$db_name};charset=utf8mb4";

    $opcoes = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    if ($ssl_ca)
    {
        if (!is_file($ssl_ca))
        {
            throw new PDOException('DB_SSL_CA arquivo nao encontrado: ' . $ssl_ca);
        }
        $opcoes[PDO::MYSQL_ATTR_SSL_CA] = $ssl_ca;
    }

    try
    {
        $conn = new PDO($dsn, $username, $password, $opcoes);

        return $conn;
    }

    catch (PDOException $erroConexao)
    {
        return null;
    }
}
