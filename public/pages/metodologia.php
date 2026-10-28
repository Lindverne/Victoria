<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Metodologia - Victória">
    <title>Metodologia | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/metodologia.css">

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

$heroSubtitle = 'Rigor Científico & Inovação';
    $heroTitle = 'Metodologia do Projeto';
    $heroDescription = 'O caminho estruturado para o desenvolvimento do nosso Sistema de Medição e Monitoramento Inteligente de Consumo de Água';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main>

        <section class="scope-section section-padding">
            <div class="container-box reveal">
                <div class="section-header">
                    <span class="category-tag">Definição do Escopo</span>
                    <h2>Tema e Problematização</h2>
                </div>

                <div class="theme-highlight glass-panel">
                    <div class="theme-icon">
                        <i class="fa-solid fa-droplet"></i>
                    </div>
                    <div class="theme-content">
                        <h3>Tema Central</h3>
                        <p>Desenvolvimento de um Sistema de Medição e Monitoramento Inteligente de Consumo de Água para
                            Aplicação em Ambientes Residenciais e Condominiais, com Foco na Conscientização e Otimização de Recursos.</p>
                    </div>
                </div>

                <div class="problems-grid">
                    <div class="problem-card glass-panel">
                        <span class="problem-badge highlight-badge">Visão Ampla</span>
                        <h4>Como a tecnologia pode contribuir para a gestão sustentável de recursos naturais?</h4>
                        <p>A tecnologia oferece ferramentas de monitoramento, otimização e controle, permitindo a identificação de desperdícios, a previsão de demandas e a implementação de práticas mais eficientes no uso de recursos como água e energia.</p>
                    </div>

                    <div class="problem-card glass-panel">
                        <span class="problem-badge highlight-badge">Visão Intermediária</span>
                        <h4>De que forma a Internet das Coisas (IoT) pode otimizar o consumo de água em edificações?</h4>
                        <p>A IoT permite a coleta de dados em tempo real sobre o uso da água, a detecção precoce de vazamentos, o monitoramento de padrões de consumo e a automação de sistemas de controle, resultando em economia e uso mais consciente.</p>
                    </div>

                    <div class="problem-card glass-panel specific-problem">
                        <span class="problem-badge highlight-badge">Questão Orientadora Específica</span>
                        <h4>Como um sistema de medidor de água inteligente pode auxiliar moradores a monitorar o uso em tempo real e reduzir o consumo?</h4>
                        <p>O sistema empodera moradores e administradores com informações precisas. Ao visualizar o uso em tempo real, identificar picos ou vazamentos através de alertas e relatórios, os usuários mudam hábitos, realizam manutenções preventivas e reduzem custos e desperdícios, contribuindo para a sustentabilidade hídrica.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="objectives-section section-padding">
            <div class="container-box reveal">
                <div class="section-header">
                    <span class="category-tag">Nossas Metas</span>
                    <h2>Objetivos do Projeto</h2>
                </div>

                <div class="general-objective glass-panel">
                    <div class="objective-header">
                        <i class="fa-solid fa-bullseye"></i>
                        <h3>Objetivo Geral</h3>
                    </div>
                    <p>Desenvolver e validar um protótipo de sistema de medidor de água inteligente capaz de coletar, transmitir, armazenar e apresentar dados de consumo de água em tempo real para usuários residenciais e condominiais, visando a gestão eficiente e a conscientização sobre o uso da água.</p>
                </div>

                <div class="specific-objectives-container">
                    <h3 class="subsection-title">Objetivos Específicos</h3>
                    <ul class="specific-list">
                        <li class="glass-panel">
                            <i class="fa-solid fa-microchip"></i>
                            <span>Pesquisar e selecionar componentes de hardware (sensor de fluxo, ESP32/Wi-Fi, energia) adequados em precisão e custo.</span>
                        </li>
                        <li class="glass-panel">
                            <i class="fa-solid fa-hammer"></i>
                            <span>Projetar e montar o módulo de hardware para medição do fluxo de água e transmissão dos dados.</span>
                        </li>
                        <li class="glass-panel">
                            <i class="fa-solid fa-code"></i>
                            <span>Desenvolver o firmware para o microcontrolador (leitura do sensor, processamento e comunicação).</span>
                        </li>
                        <li class="glass-panel">
                            <i class="fa-solid fa-mobile-screen"></i>
                            <span>Implementar plataforma de software (web/mobile) para receber, armazenar e visualizar dados, gráficos e alertas.</span>
                        </li>
                        <li class="glass-panel">
                            <i class="fa-solid fa-chart-line"></i>
                            <span>Desenvolver funcionalidades para identificação de padrões de consumo atípicos e potenciais vazamentos.</span>
                        </li>
                        <li class="glass-panel">
                            <i class="fa-solid fa-vial-circle-check"></i>
                            <span>Realizar testes de campo em ambiente controlado para avaliar precisão, confiabilidade e usabilidade.</span>
                        </li>
                        <li class="glass-panel">
                            <i class="fa-solid fa-file-signature"></i>
                            <span>Analisar os resultados obtidos e documentar todo o processo de desenvolvimento e validação final.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="justification-section section-padding">
            <div class="container-box reveal">
                <div class="section-header">
                    <span class="category-tag">A Importância</span>
                    <h2>Justificativas</h2>
                </div>

                <div class="justification-grid">
                    <div class="justification-card glass-panel">
                        <div class="justification-icon">
                            <i class="fa-solid fa-earth-americas"></i>
                        </div>
                        <h3>Social e de Mercado</h3>
                        <p>A escassez hídrica é um desafio global. O consumo residencial muitas vezes é percebido apenas na conta mensal. Um medidor inteligente oferece dados em tempo real, capacitando decisões conscientes e sustentáveis. A detecção de vazamentos gera economia e evita danos, atendendo à crescente demanda do mercado por soluções IoT de automação residencial com forte impacto social.</p>
                    </div>

                    <div class="justification-card glass-panel">
                        <div class="justification-icon">
                            <i class="fa-solid fa-flask"></i>
                        </div>
                        <h3>Técnico-Científica</h3>
                        <p>O projeto integra eletrônica embarcada, Internet das Coisas (IoT), desenvolvimento web/mobile, análise de dados e engenharia de software. A complexidade da integração hardware-software, garantindo precisão e robustez, eleva o rigor acadêmico do trabalho, exigindo aprofundamento teórico e prático significativo para a formulação de uma solução eficaz.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="methodology-approach section-padding">
            <div class="container-box reveal">
                <div class="section-header">
                    <span class="category-tag">A Execução</span>
                    <h2>Metodologia de Pesquisa</h2>
                </div>
                <div class="methodology-content glass-panel">
                    <p>Em conformidade com as diretrizes de TCC, nosso projeto une o referencial teórico à aplicação prática. A metodologia baseia-se em uma pesquisa de natureza <strong>empírica e aplicada</strong>, envolvendo pesquisa de campo e testes de laboratório para a validação do protótipo. A sustentação técnica advém da <strong>pesquisa bibliográfica</strong>, que nos fornece a base de normas técnicas e conceitos de IoT necessários para a agregação de novos saberes.</p>
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
</body>

</html>
