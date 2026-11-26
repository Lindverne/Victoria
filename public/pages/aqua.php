<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="App Aqua - Monitore seu consumo de água no celular. Baixe agora para Android.">
    <title>App Aqua | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">
    
    <link rel="stylesheet" href="../assets/css/pages/aqua.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body>
    <div id="top"></div>

    <?php

    require_once dirname(__DIR__) . '/components/header.php';

    ?>

    <?php

    $heroSubtitle = 'Victória';
    $heroTitle = 'Sua água, seu controle';
    $heroDescription = 'A tecnologia a serviço da sustentabilidade. Monitore, analise e economize com o nosso ecossistema completo.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

    ?>

    <main>

    <section class="secao-mockup">
        <div class="container-box reveal">
            <div class="mockup-wrapper">
                <div class="mockup-conteudo">
                    <span class="tag-categoria">App Mobile</span>
                    <h2 class="mockup-titulo">Controle cada litro direto do celular</h2>
                    <p class="mockup-texto">Acompanhe o consumo de água, defina metas de economia e controle tudo pelo App Aqua, o aplicativo oficial do projeto Victória.</p>
                    <div class="grupo-cta">
                        <a href="/assets/apk/App_Aqua-debug.apk" class="botao botao-download" aria-label="Baixar App Aqua para Android" download>
                            <i class="fa-solid fa-download" aria-hidden="true"></i>
                            Baixar para Android
                        </a>
                        <a href="#secao-app" class="botao botao-qrcode" aria-label="Ver QR Code para download">
                            <i class="fa-solid fa-qrcode" aria-hidden="true"></i>
                            Ver QR Code
                        </a>
                    </div>
                </div>
                <div class="mockup-imagem">
                    <img src="../assets/img/pages/aqua/mockup.png" alt="Mockup do App Aqua" class="mockup-img" loading="lazy">
                </div>
            </div>
        </div>
    </section>

        <section class="secao-funcionalidades">
            <div class="container-box reveal">
                <div class="section-header">
                    <span class="tag-categoria">Funcionalidades</span>
                    <h2 class="titulo-secao">Tudo o que você precisa para economizar água</h2>
                </div>
                <div class="specs-grid">
                    <article class="spec-card">
                        <i class="fa-solid fa-gauge-high spec-icon" aria-hidden="true"></i>
                        <h3>Monitoramento em tempo real</h3>
                        <p>Acompanhe o consumo de água da sua residência minuto a minuto, com dados atualizados em tempo real através de sensores inteligentes instalados na sua rede hidráulica.</p>
                    </article>
                    <article class="spec-card">
                        <i class="fa-solid fa-chart-line spec-icon" aria-hidden="true"></i>
                        <h3>Relatórios detalhados</h3>
                        <p>Visualize históricos completos de consumo organizados por dia, mês e ano, com gráficos claros que facilitam a análise da evolução do seu gasto de água.</p>
                    </article>
                    <article class="spec-card">
                        <i class="fa-solid fa-wallet spec-icon" aria-hidden="true"></i>
                        <h3>Estimativa de tarifa</h3>
                        <p>Calcule o valor previsto da sua conta de água antes mesmo dela chegar, com base no consumo atual e nas tarifas vigentes da sua região.</p>
                    </article>
                    <article class="spec-card">
                        <i class="fa-solid fa-droplet spec-icon" aria-hidden="true"></i>
                        <h3>Metas de economia</h3>
                        <p>Defina objetivos personalizados de consumo mensal e acompanhe seu progresso em tempo real, recebendo sugestões para reduzir o desperdício e economizar.</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="secao-app" id="secao-app">
            <div class="container-box reveal">
                <div class="app-layout">
                    <div class="app-imagem">
                        <img src="../assets/apk/victoria-qr.png" alt="QR Code para download do App Aqua" class="qrcode-img" loading="lazy">
                    </div>
                    <div class="app-texto">
                        <h3 class="titulo-app">Baixe o App Aqua</h3>
                        <p class="texto-app">
                            Escaneie o QR Code ou clique no botão para baixar o aplicativo diretamente no seu celular Android e comece
                            a economizar água hoje mesmo.
                        </p>
                        <a href="/assets/apk/App_Aqua-debug.apk" class="botao botao-download" download>Baixar APK do App Aqua</a>
                        <p class="nota-app">Versão 1.0 — Android 8.0 ou superior.</p>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <?php

    require_once dirname(__DIR__) . '/components/footer.php';

    ?>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
</body>

</html>
