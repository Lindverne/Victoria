<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Iluminando caminhos através da tecnologia e inovação.">
    <title>Documentação | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/documentacao.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js"></script>
</head>

<body>
    <div id="top"></div>

    <?php

require_once dirname(__DIR__) . '/components/header.php';

?>

    <?php

$heroSubtitle = 'Repositório Oficial';
    $heroTitle = 'Documentação & Fontes';
    $heroDescription = 'Acesse os fichamentos e as bases teóricas, normas e tecnologias que sustentam o desenvolvimento do nosso projeto.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main class="section">

        <section class="section-padding">
            <div class="container-box">
                <div class="section-header">
                    <span class="category-tag">Embasamento</span>
                    <h2>Pilares da Pesquisa</h2>
                </div>

                <div class="doc-flex-container">
                    <article class="doc-card">
                        <div class="doc-icon"><i class="fa-solid fa-microchip"></i></div>
                        <h3>Internet das Coisas (IoT)</h3>
                        <p>Exploração de protocolos de comunicação e arquitetura de sensores para o monitoramento em
                            tempo real, baseando-se em conceitos de cidades inteligentes.</p>
                    </article>

                    <article class="doc-card">
                        <div class="doc-icon"><i class="fa-solid fa-droplet"></i></div>
                        <h3>Gestão de Recursos Hídricos</h3>
                        <p>Estudo sobre o impacto do desperdício de água potável e as diretrizes da ONU (ODS 6) para o
                            consumo sustentável e saneamento.</p>
                    </article>

                    <article class="doc-card">
                        <div class="doc-icon"><i class="fa-solid fa-code"></i></div>
                        <h3>Engenharia de Software</h3>
                        <p>Desenvolvimento web server-side em PHP e MySQL, com foco em arquitetura limpa, componentização
                            e boas práticas de programação.</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="fichamento">
            <div class="container-box">
                <div class="section-header">
                    <span class="category-tag">Material de Apoio</span>
                    <h2>Fichamentos Técnicos</h2>
                </div>

                <div id="doc-container" class="doc-flex-container"></div>
            </div>
        </section>
    </main>

    <?php

require_once dirname(__DIR__) . '/components/footer.php';

?>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
    <script type="module" src="../assets/js/pages/documentacao.js"></script>
</body>

</html>
