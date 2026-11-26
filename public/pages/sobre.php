<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Iluminando caminhos através da tecnologia e inovação.">
    <title>Sobre o TCC | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">
    <link rel="stylesheet" href="../assets/css/pages/sobre.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">
    <link rel="stylesheet" href="../assets/css/components/logo-loop.css">

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

$heroSubtitle = 'Nossa Essência';
    $heroTitle = 'Sobre a Victória';
    $heroDescription = 'Conheça a missão, a tecnologia e os desenvolvedores por trás da revolução na telemetria hídrica inteligente.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main>

        <section class="tech-specs">
            <div class="container-box reveal">
                <div class="section-header">
                    <span class="category-tag">Fundamentos</span>
                    <h2>Nossa Missão</h2>
                </div>
                <div class="specs-grid">
                    <div class="spec-card">
                        <i class="fa-solid fa-bullseye spec-icon"></i>
                        <h3>Missão</h3>
                        <p>Democratizar o acesso a dados de consumo de água, combatendo o desperdício global através da
                            IoT.</p>
                    </div>
                    <div class="spec-card">
                        <i class="fa-solid fa-eye spec-icon"></i>
                        <h3>Visão</h3>
                        <p>Ser a maior referência em hardware de monitoramento hídrico residencial em projetos
                            acadêmicos e sustentáveis.</p>
                    </div>
                    <div class="spec-card">
                        <div class="inner-spec">
                            <i class="fa-solid fa-gem spec-icon"></i>
                            <h3>Valores</h3>
                            <p>Inovação radical, transparência de dados, sustentabilidade aplicada e excelência técnica.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="tech-stack-section">
            <div class="container-box reveal">
                <div class="section-header">
                    <span class="category-tag">Tecnologias</span>
                    <h2>Nosso Stack</h2>
                </div>
                <div class="logo-loop">
                    <div class="logo-loop__track">
                        <a class="logo-loop__item" href="#" aria-label="PHP">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/php.svg" alt="PHP" loading="lazy"></div>
                            <span class="logo-loop__label">PHP</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="MySQL">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/mysql.svg" alt="MySQL" loading="lazy"></div>
                            <span class="logo-loop__label">MySQL</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="JavaScript">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/js.svg" alt="JavaScript" loading="lazy"></div>
                            <span class="logo-loop__label">JavaScript</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="CSS3">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/css.svg" alt="CSS3" loading="lazy"></div>
                            <span class="logo-loop__label">CSS3</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="HTML5">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/html.svg" alt="HTML5" loading="lazy"></div>
                            <span class="logo-loop__label">HTML5</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="Python">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/python.svg" alt="Python" loading="lazy"></div>
                            <span class="logo-loop__label">Python</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="ESP32">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/esp32.svg" alt="ESP32" loading="lazy"></div>
                            <span class="logo-loop__label">ESP32</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="ApexCharts">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/apex.svg" alt="ApexCharts" loading="lazy"></div>
                            <span class="logo-loop__label">ApexCharts</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="SweetAlert2">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/sweet-alert.svg" alt="SweetAlert2" loading="lazy"></div>
                            <span class="logo-loop__label">SweetAlert2</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="Git">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/git.svg" alt="Git" loading="lazy"></div>
                            <span class="logo-loop__label">Git</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="GitHub">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/github.svg" alt="GitHub" loading="lazy"></div>
                            <span class="logo-loop__label">GitHub</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="Java">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/java.svg" alt="Java" loading="lazy"></div>
                            <span class="logo-loop__label">Java</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="VS Code">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/vsc.svg" alt="VS Code" loading="lazy"></div>
                            <span class="logo-loop__label">VS Code</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="Android Studio">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/android-studio.svg" alt="Android Studio" loading="lazy"></div>
                            <span class="logo-loop__label">Android Studio</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="Claude">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/claude.svg" alt="Claude" loading="lazy"></div>
                            <span class="logo-loop__label">Claude</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="CropperJS">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/cropperjs.svg" alt="CropperJS" loading="lazy"></div>
                            <span class="logo-loop__label">CropperJS</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="Font Awesome">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/font-awesome.svg" alt="Font Awesome" loading="lazy"></div>
                            <span class="logo-loop__label">Font Awesome</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="html2canvas">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/html-2-canvas.svg" alt="html2canvas" loading="lazy"></div>
                            <span class="logo-loop__label">html2canvas</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="jsPDF">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/jspdf.svg" alt="jsPDF" loading="lazy"></div>
                            <span class="logo-loop__label">jsPDF</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="phpMyAdmin">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/phpmyadmin.svg" alt="phpMyAdmin" loading="lazy"></div>
                            <span class="logo-loop__label">phpMyAdmin</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="WAMP">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/wamp64.svg" alt="WAMP" loading="lazy"></div>
                            <span class="logo-loop__label">WAMP</span>
                        </a>
                        <a class="logo-loop__item" href="#" aria-label="XML">
                            <div class="logo-loop__icon"><img src="../assets/img/pages/sobre/xml.svg" alt="XML" loading="lazy"></div>
                            <span class="logo-loop__label">XML</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <section class="prototype-section">
            <div class="container-box reveal">
                <div class="prototype-container">
                    <div class="proto-text">
                        <span class="category-tag">Hardware</span>
                        <h2>O Protótipo</h2>
                        <p>A Victória utiliza processamento ESP32 com sensores de efeito Hall para garantir que cada
                            gota seja contabilizada com precisão cirúrgica.</p>
                        <ul class="proto-features">
                            <li><i class="fa-solid fa-microchip"></i> Inteligência via NodeMCU ESP32</li>
                            <li><i class="fa-solid fa-wifi"></i> Conexão MQTT de baixa latência</li>
                            <li><i class="fa-solid fa-gauge-high"></i> Sensores de fluxo de alta precisão</li>
                        </ul>
                    </div>
                    <div class="proto-visual glass-panel">
                        <img src="../assets/img/pages/sobre/prototipo.jpg" alt="Protótipo Victória"
                            class="proto-img-real" loading="lazy">
                    </div>
                </div>
            </div>
        </section>

        <section class="team-section">
            <div class="container-box reveal">
                <div class="section-header">
                    <span class="category-tag">Time</span>
                    <h2>Desenvolvedores</h2>
                </div>

                <div class="team-flex-container">
                    <div class="team-card glass-panel">
                        <div class="team-avatar">
                            <img src="../assets/img/pages/sobre/augusto.png" alt="Guilherme Augusto" loading="lazy">
                        </div>
                        <h3>Guilherme Augusto</h3>
                        <span class="team-role">Designer do App</span>
                        <div class="team-social">
                            <a href="#" class="perfil-futuro" data-nome="Guilherme Augusto" data-rede="GitHub"><i class="fab fa-github"></i></a>
                            <a href="#" class="perfil-futuro" data-nome="Guilherme Augusto" data-rede="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>

                    <div class="team-card glass-panel">
                        <div class="team-avatar">
                            <img src="../assets/img/pages/sobre/heitor.png" alt="Heitor Riquena" loading="lazy">
                        </div>
                        <h3>Heitor Riquena Cirilo Muniz</h3>
                        <span class="team-role">Algoritmo do Cálculo de Água</span>
                        <div class="team-social">
                            <a href="https://github.com/Acranom" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
                            <a href="#" class="perfil-futuro" data-nome="Heitor Riquena Cirilo Muniz" data-rede="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>

                    <div class="team-card glass-panel">
                        <div class="team-avatar">
                            <img src="../assets/img/pages/sobre/joão.png" alt="João Pedro" loading="lazy">
                        </div>
                        <h3>João Pedro</h3>
                        <span class="team-role">Pesquisa & Fichamentos</span>
                        <div class="team-social">
                            <a href="#" class="perfil-futuro" data-nome="João Pedro" data-rede="GitHub"><i class="fab fa-github"></i></a>
                            <a href="#" class="perfil-futuro" data-nome="João Pedro" data-rede="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>

                    <div class="team-card glass-panel">
                        <div class="team-avatar">
                            <img src="../assets/img/pages/sobre/julio.png" alt="Julio Cesar" loading="lazy">
                        </div>
                        <h3>Julio Cesar Borges Leandro</h3>
                        <span class="team-role">Desenvolvedor do Aplicativo</span>
                        <div class="team-social">
                            <a href="https://github.com/julio3323" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
                            <a href="#" class="perfil-futuro" data-nome="Julio Cesar Borges Leandro" data-rede="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>

                    <div class="team-card glass-panel">
                        <div class="team-avatar">
                            <img src="../assets/img/pages/sobre/maria.png" alt="Maria Isabella" loading="lazy">
                        </div>
                        <h3>Maria Isabella</h3>
                        <span class="team-role">Mapa do Site e do App</span>
                        <div class="team-social">
                            <a href="#" class="perfil-futuro" data-nome="Maria Isabella" data-genero="f" data-rede="GitHub"><i class="fab fa-github"></i></a>
                            <a href="#" class="perfil-futuro" data-nome="Maria Isabella" data-genero="f" data-rede="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>

                    <div class="team-card glass-panel">
                        <div class="team-avatar">
                            <img src="../assets/img/pages/sobre/guedes.png" alt="Matheus Guedes" loading="lazy">
                        </div>
                        <h3>Matheus Guedes</h3>
                        <span class="team-role">Desenvolvedor do Site</span>
                        <div class="team-social">
                            <a href="https://github.com/Lindverne" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
                            <a href="#" class="perfil-futuro" data-nome="Matheus Guedes" data-rede="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>

                    <div class="team-card glass-panel">
                        <div class="team-avatar">
                            <img src="../assets/img/pages/sobre/marangoni.png" alt="Matheus Marangoni" loading="lazy">
                        </div>
                        <h3>Matheus Marangoni</h3>
                        <span class="team-role">Desenvolvedor Geral e Documentação</span>
                        <div class="team-social">
                            <a href="https://github.com/matheus-marangoni-baptista" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
                            <a href="#" class="perfil-futuro" data-nome="Matheus Marangoni" data-rede="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
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
    <script type="module" src="../assets/js/pages/sobre.js"></script>
    <script type="module" src="../assets/js/components/logo-loop.js"></script>
</body>

</html>
