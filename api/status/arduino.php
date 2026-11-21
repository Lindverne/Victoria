<?php

require_once __DIR__ . '/../middleware/verificador-base.php';

header('Content-Type: application/json; charset=UTF-8');

$heartbeatFile = realpath(__DIR__ . '/../../storage/arduino_heartbeat.json');
$storageDir = realpath(__DIR__ . '/../../storage');
$maxAgeSeconds = 300;

$status = 'nao_configurado';
$online = false;
$lastHeartbeat = null;

if ($heartbeatFile && $storageDir && str_starts_with($heartbeatFile, $storageDir))
{
    if (file_exists($heartbeatFile))
    {
        $data = json_decode(file_get_contents($heartbeatFile), true);

        if ($data && isset($data['timestamp']))
        {
            $lastHeartbeat = (int) $data['timestamp'];
            $age = time() - $lastHeartbeat;

            if ($age <= $maxAgeSeconds)
            {
                $status = 'online';
                $online = true;
            }
            else
            {
                $status = 'offline';
                $online = false;
            }
        }
        else
        {
            $status = 'offline';
            $online = false;
        }
    }
}

echo json_encode([
    'success'    => true,
    'status'     => $status,
    'online'     => $online,
    'last_heartbeat' => $lastHeartbeat,
]);