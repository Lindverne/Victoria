<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Iluminando caminhos através da tecnologia e inovação.">
    <title>Hardware | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/hardware.css">

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

$heroSubtitle = 'Engenharia e Componentes';
    $heroTitle = 'Especificação de Hardware';
    $heroDescription = 'Conheça os componentes físicos, sensores e o microcontrolador que compõem o núcleo do ecossistema Victória.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main class="section-padding">
        <div class="container-box">
            <div class="section-header">
                <span class="category-tag">Arquitetura Física</span>
                <h2>Componentes do Sistema</h2>
            </div>

            <div class="hw-flex-container">
                <article class="hw-card">
                    <div class="hw-img-container">
                        <img src="../assets/img/pages/hardware/arduino-uno.webp" alt="Arduino Uno R3" loading="lazy">
                    </div>
                    <h3>Arduino Uno R3</h3>
                    <p>O cérebro do projeto. Responsável pelo processamento dos sinais analógicos e digitais, além da lógica de controle do fluxo hídrico.</p>
                </article>

                <article class="hw-card">
                    <div class="hw-img-container">
                        <img src="../assets/img/pages/hardware/ov7670.webp" alt="Câmera OV7670" loading="lazy">
                    </div>
                    <h3>Câmera OV7670</h3>
                    <p>Mede a vazão de água através da sua câmera de alta resolução, permitindo o cálculo preciso do consumo em tempo real.</p>
                </article>

                <article class="hw-card">
                    <div class="hw-img-container">
                        <img src="../assets/img/pages/hardware/esp8266.webp" alt="ESP8266" loading="lazy">
                    </div>
                    <h3>Módulo Wi-Fi ESP8266</h3>
                    <p>Garante a conectividade IoT da Victória, enviando os dados coletados pelo Arduino para o banco de dados na nuvem via protocolo HTTP.</p>
                </article>

                <article class="hw-card">
                    <div class="hw-img-container">
                        <img src="../assets/img/pages/hardware/protoboard.webp" alt="Protoboard com jumpers" loading="lazy">
                    </div>
                    <h3>Infraestrutura de Conexão</h3>
                    <p>Jumpers premium e protoboards de alta precisão para garantir a integridade dos sinais elétricos entre os módulos e o sensor.</p>
                </article>

                <article class="hw-card">
                    <div class="hw-img-container">
                        <img src="../assets/img/pages/hardware/alimentador.webp" alt="Fonte de Alimentação" loading="lazy">
                    </div>
                    <h3>Sistema de Energia</h3>
                    <p>Alimentação regulada de 9V/12V para o Arduino, garantindo estabilidade contra picos de tensão e funcionamento contínuo.</p>
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
