<?php

$envBaseUrl = getenv('APP_BASE_URL');

if ($envBaseUrl !== false && $envBaseUrl !== '')
{
    $baseUrl = rtrim($envBaseUrl, '/');
}

else
{
    
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    
    if (strpos($scriptName, '/api/') !== false)
    {
        
        $apiPos = strpos($scriptName, '/api/');
        $baseUrl = rtrim(substr($scriptName, 0, $apiPos), '/');
    }

    elseif (strpos($scriptName, '/pages/') !== false)
    {
        
        $pagesPos = strpos($scriptName, '/pages/');
        $baseUrl = rtrim(substr($scriptName, 0, $pagesPos), '/');
    }

    else
    {
        
        $baseUrl = rtrim(dirname($scriptName), '/');
    }
    
    
    if ($baseUrl === '.' || $baseUrl === '\\')
    {
        $baseUrl = '';
    }

}

define('BASE_URL', $baseUrl);
define('ASSETS_URL', BASE_URL . '/assets');
define('PUBLIC_URL', BASE_URL . '/public');
define('API_URL', BASE_URL . '/api');

function getPublicBaseUrl(): string
{
    if (BASE_URL !== '' && substr(BASE_URL, -7) === '/public')
    {
        return BASE_URL;
    }

    return PUBLIC_URL;
}

function obterUrlLogin(): string
{
    return getPublicBaseUrl() . '/pages/login.php';
}

function obterUrlDashboard(): string
{
    return getPublicBaseUrl() . '/pages/dashboard.php';
}

function obterUrlHome(): string
{
    return getPublicBaseUrl() . '/index.php';
}
