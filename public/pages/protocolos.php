<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Iluminando caminhos através da tecnologia e inovação.">
    <title>Protocolos | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/protocolos.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
</head>

<body>
    <div id="top"></div>

    <?php

require_once dirname(__DIR__) . '/components/header.php';

?>

    <?php

$heroSubtitle = 'Conectividade e Dados';
    $heroTitle = 'Protocolos IoT';
    $heroDescription = 'A camada de comunicação que garante que cada gota monitorada pela Victória se transforme em informação em tempo real.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main class="section-padding">
        <div class="container-box">
            <div class="section-header">
                <span class="category-tag">Integração de Sistemas</span>
                <h2>Como a Victória se Comunica</h2>
            </div>

            <div class="proto-flex-container">
                <article class="proto-card">
                    <div class="proto-icon"><i class="fa-solid fa-globe"></i></div>
                    <h3>HTTP / POST Request</h3>
                    <p>Utilizamos requisições assíncronas para enviar os dados de vazão. O ESP8266 atua como um cliente que dispara pacotes JSON para o nosso servidor PHP.</p>
                </article>

                <article class="proto-card">
                    <div class="proto-icon"><i class="fa-solid fa-shield-halved"></i></div>
                    <h3>Integridade e Segurança</h3>
                    <p>Implementação de chaves de API (Auth Tokens) para garantir que apenas o hardware oficial da Victória consiga registrar dados no banco de dados.</p>
                </article>

                <article class="proto-card">
                    <div class="proto-icon"><i class="fa-solid fa-file-code"></i></div>
                    <h3>Estrutura JSON</h3>
                    <p>O formato leve e universal utilizado para o tráfego de informações, permitindo uma leitura rápida pelo Dashboard e baixo consumo de banda do hardware.</p>
                </article>

                <article class="proto-card">
                    <div class="proto-icon"><i class="fa-solid fa-database"></i></div>
                    <h3>Sincronização em Nuvem</h3>
                    <p>Os dados são processados por scripts server-side que validam a entrada e atualizam instantaneamente o histórico de consumo do usuário.</p>
                </article>
            </div>
        </div>
    </main>

    <?php

require_once dirname(__DIR__) . '/components/footer.php';

?>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
</body>

</html>
