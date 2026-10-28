<?php

/*

  Código Legado do Morango (◕‿◕✿) - Index.php

    header("Location: Victoria_Dia_04_06/HTML/Inicial.html");
    exit();

*/

require_once __DIR__ . '/helpers/caminhos.php';
require_once __DIR__ . '/../api/middleware/verificador-base.php';
require_once __DIR__ . '/../api/config/csrf.php';
require_once __DIR__ . '/components/erro-conexao.php';

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Iluminando caminhos através da tecnologia e inovação.">
    <title>Página Inicial | Victória</title>

    <?= csrfMetaTag() ?>

    <script src="assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="assets/css/global/variables.css">
    <link rel="stylesheet" href="assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="assets/css/global/global.css">
    <link rel="stylesheet" href="assets/css/components/tema.css">

    <link rel="stylesheet" href="assets/css/pages/index.css">

    <link rel="stylesheet" href="assets/css/responsividade.css">

    <link rel="icon" href="assets/img/favicon/icon-victoria.ico">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
</head>

<body>
    <div id="top"></div>

    <?php

require_once __DIR__ . '/components/header.php';

?>

    <header class="hero-section">
        <div class="carousel-container">
            <div class="carousel-track">
                <div class="carousel-slide active">
                    <img src="assets/img/pages/index/slide-01.jpg" alt="Imagem de fundo sobre monitoramento inteligente de água">
                    <div class="hero-overlay"></div>
                    <div class="hero-text">
                        <span class="hero-subtitle">Projeto Victória</span>
                        <h1>Controle inteligente da sua água</h1>
                        <p>Sistema de monitoramento em tempo real para otimizar o consumo de água em residências e
                            condomínios</p>
                    </div>
                </div>

                <div class="carousel-slide">
                    <img src="assets/img/pages/index/slide-02.jpg" alt="Imagem de fundo sobre economia e consciência ambiental">
                    <div class="hero-overlay"></div>
                    <div class="hero-text">
                        <span class="hero-subtitle">Tecnologia Sustentável</span>
                        <h1>Economia e consciência ambiental</h1>
                        <p>Reduza desperdícios, detecte vazamentos e economize água com precisão</p>
                    </div>
                </div>
            </div>

            <button class="carousel-control prev" aria-label="Anterior">
                <i class="fa-solid fa-chevron-left"></i>
            </button>

            <button class="carousel-control next" aria-label="Próximo">
                <i class="fa-solid fa-chevron-right"></i>
            </button>

            <div class="carousel-indicators">
                <span class="dot active" data-slide="0"></span>
                <span class="dot" data-slide="1"></span>
            </div>
        </div>
    </header>

    <main class="content-wrapper">
        <section class="tech-specs">
            <div class="container-box">
                <div class="section-header">
                    <span class="category-tag">Características Principais</span>
                    <h2>Especificações do Sistema</h2>
                </div>

                <div class="specs-grid">
                    <div class="spec-card reveal">
                        <i class="fa-solid fa-gauge-high spec-icon"></i>
                        <h3>Medição Precisa</h3>
                        <p>Sensor de fluxo de alta precisão para leitura exata do consumo de água em tempo real.</p>
                    </div>

                    <div class="spec-card reveal">
                        <i class="fa-solid fa-wifi spec-icon"></i>
                        <h3>Conectividade IoT</h3>
                        <p>Transmissão de dados via Wi-Fi ou LoRa para acesso remoto e monitoramento contínuo.</p>
                    </div>

                    <div class="spec-card reveal">
                        <i class="fa-solid fa-bell spec-icon"></i>
                        <h3>Alertas Inteligentes</h3>
                        <p>Notificações automáticas para detecção de vazamentos e picos de consumo anormais.</p>
                    </div>

                    <div class="spec-card reveal">
                        <i class="fa-solid fa-battery-full spec-icon"></i>
                        <h3>Eficiência Energética</h3>
                        <p>Bateria de longa duração com otimização inteligente de consumo de energia.</p>
                    </div>

                    <div class="spec-card reveal">
                        <i class="fas fa-chart-bar spec-icon"></i>
                        <h3>Análise de Dados</h3>
                        <p>Dashboard intuitivo com gráficos e relatórios para análise de padrões de consumo.</p>
                    </div>

                    <div class="spec-card reveal">
                        <i class="fa-solid fa-lock spec-icon"></i>
                        <h3>Segurança de Dados</h3>
                        <p>Criptografia end-to-end para proteger suas informações de consumo e privacidade.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="home-news">
            <div class="container-box">
                <div class="section-header">
                    <span class="category-tag">Informativo</span>
                    <h2>Últimas Notícias</h2>
                </div>

                <div class="home-news-grid">
                    <?php

require_once __DIR__ . '/../api/config/conexao-base.php';
                    $conn = conectarBanco();

                    if ($conn === null):
                        renderizarErroConexao();

                    else:

                    try
                    {
                        $stmt = $conn->prepare('SELECT id, titulo, resumo, imagem_capa, categoria FROM noticias WHERE status = 1 ORDER BY created_at DESC LIMIT 4');
                        $stmt->execute();
                        $homeNoticias = $stmt->fetchAll();

                        if (count($homeNoticias) > 0):

                            foreach ($homeNoticias as $n):

?>
                    <article class="news-featured-card reveal">
                        <img src="<?= imagemCapaUrl($n['imagem_capa'] ?? 'default.jpg', 'assets/img/pages/noticias/') ?>" alt="<?= htmlspecialchars($n['titulo']) ?>" loading="lazy">
                        <div class="news-featured-content">
                            <span class="news-featured-tag"><?= htmlspecialchars($n['categoria']) ?></span>
                            <h3><?= htmlspecialchars($n['titulo']) ?></h3>
                        </div>
                    </article>
                    <?php

endforeach;

                        else:

?>
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--ash-grey);">
                        <i class="fas fa-newspaper" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                        <p>Nenhuma notícia publicada no momento.</p>
                    </div>
                    <?php

endif;
                    }

                    catch (Exception $e)
                    {
                        error_log('[Index] ' . $e->getMessage());

                        renderizarErroConexao();
                    }

                    endif;

?>
                </div>

                <div class="home-news-footer">
                    <a href="pages/noticias.php" class="nav-btn-access">
                        Ver todas as notícias
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    </main>

    <?php

require_once __DIR__ . '/components/footer.php';

?>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>

    <script type="module" src="assets/js/auth.js"></script>
    <script type="module" src="assets/js/global.js"></script>

    <script type="module">
        import { initSlider } from './assets/js/pages/index.js';
        initSlider();
    </script>
</body>

</html>
