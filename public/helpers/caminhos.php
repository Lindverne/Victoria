<?php

require_once __DIR__ . '/../../api/config/urls.php';

function imagemCapaUrl($path, $prefix = '../assets/img/pages/noticias/')
{
    $padrao = $prefix . 'default.jpg';

    if (empty($path))
    {
        return $padrao;
    }

    
    $lowerPath = strtolower(trim($path));
    $dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'ftp:'];

    foreach ($dangerousProtocols as $proto)
    {

        if (strpos($lowerPath, $proto) === 0)
        {
            return $padrao;
        }

    }

    
    if (strpos($lowerPath, 'https://') === 0)
    {
        $allowedDomains = [
            'victoria.local',
            'localhost',
            '127.0.0.1',
            
        ];

        $parsed = parse_url($path);

        if ($parsed && isset($parsed['host']))
        {
            $host = strtolower($parsed['host']);
            
            $host = str_replace('www.', '', $host);

            $allowed = false;

            foreach ($allowedDomains as $domain)
            {

                if ($host === $domain || str_ends_with($host, '.' . $domain))
                {
                    $allowed = true;
                    break;
                }

            }

            if ($allowed)
            {
                return $path;
            }

        }

        
        return $padrao;
    }

    
    if (strpos($path, '/') === 0)
    {
        $posAssets = strpos($path, '/assets/');

        if ($posAssets === false)
        {
            return $padrao;
        }

        $sufixo = substr($path, $posAssets + strlen('/assets'));
        $caminhoDisco = dirname(__DIR__) . '/assets' . $sufixo;

        return is_file($caminhoDisco) ? ASSETS_URL . $sufixo : $padrao;
    }

    
    if (!is_file(dirname(__DIR__) . '/assets/img/pages/noticias/' . $path))
    {
        return $padrao;
    }

    return $prefix . $path;
}
