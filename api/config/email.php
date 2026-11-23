<?php

function enviarEmailComResend(string $para, string $assunto, string $html): bool
{
    $apiKey = getenv('RESEND_API_KEY');

    if (!$apiKey)
    {
        return false;
    }

    $dados = [
        'from'    => 'Victoria <onboarding@resend.dev>',
        'to'      => [$para],
        'subject' => $assunto,
        'html'    => $html,
    ];

    $curl = curl_init('https://api.resend.com/emails');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($dados));
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);
    curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ]);

    $resposta = curl_exec($curl);

    if ($resposta === false)
    {
        curl_close($curl);
        return false;
    }

    $codigoHttp = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    return ($codigoHttp === 200 || $codigoHttp === 201);
}
