<?php

function conectarBanco(): ?PDO
{
    $host     = getenv('DB_HOST') ?: 'localhost';
    $db_name  = getenv('DB_NAME') ?: 'victoria';
    $username = getenv('DB_USER') ?: 'Lindverne';
    $password = getenv('DB_PASSWORD') ?: '1234';

    try
    {
        $conn = new PDO("mysql:host={$host};dbname={$db_name};charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        return $conn;
    }

    catch (PDOException $erroConexao)
    {
        return null;
    }
}
