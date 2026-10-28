<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Iluminando caminhos através da tecnologia e inovação.">
    <title>Termos e Privacidade | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/metodologia.css">
    <link rel="stylesheet" href="../assets/css/pages/dashboard.css">

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

$heroSubtitle = 'Transparência';
    $heroTitle = 'Termos e Privacidade';
    $heroDescription = 'Entenda como coletamos e utilizamos seus dados para garantir a transparência e a segurança no uso da plataforma.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main>
        <div class="dashboard-main-wrapper" style="margin-top: -80px;">
            <div class="dashboard-container" style="max-width: 1000px;">

                <section class="glass-inner-panel" style="padding: 50px;">
                    <div class="termos-content">
                        <h3 style="color: var(--ink-black); font-size: 1.5rem; margin-bottom: 20px;"><i
                                class="fas fa-user-lock" style="color: var(--dark-teal);"></i> 1. Coleta de Dados</h3>
                        <p style="color: var(--dark-teal); line-height: 1.8; margin-bottom: 40px; font-weight: 500;">
                            No Projeto Victória, tratamos seus dados com a máxima segurança. Coletamos apenas as
                            informações
                            essenciais de telemetria (vazão e consumo) para gerar os relatórios e estimativas de gastos
                            presentes no seu painel. Nenhuma informação pessoal é vendida ou compartilhada com terceiros
                            sem
                            consentimento explícito.
                        </p>

                        <h3 style="color: var(--ink-black); font-size: 1.5rem; margin-bottom: 20px;"><i
                                class="fas fa-microchip" style="color: var(--dark-teal);"></i> 2. Uso da Telemetria</h3>
                        <p style="color: var(--dark-teal); line-height: 1.8; margin-bottom: 40px; font-weight: 500;">
                            Os dados capturados pelos nossos sensores microcontrolados são processados localmente e
                            criptografados antes do envio para o dashboard. O objetivo principal é fornecer ferramentas
                            analíticas para a economia hídrica e sustentabilidade ambiental, alinhados aos propósitos
                            acadêmicos deste TCC.
                        </p>

                        <h3 style="color: var(--ink-black); font-size: 1.5rem; margin-bottom: 20px;"><i
                                class="fas fa-cookie-bite" style="color: var(--dark-teal);"></i> 3. Cookies e
                            LocalStorage
                        </h3>
                        <p style="color: var(--dark-teal); line-height: 1.8; margin-bottom: 40px; font-weight: 500;">
                            Utilizamos tecnologias como LocalStorage e Cookies de sessão exclusivamente para manter você
                            logado, salvar suas preferências de interface (como o modo escuro) e armazenar
                            temporariamente o
                            log de atividades (medições manuais) de forma a otimizar a velocidade da plataforma.
                        </p>

                        <hr style="border: none; border-top: 1px solid rgba(89, 131, 146, 0.2); margin: 40px 0;">

                        <p
                            style="color: var(--air-force-blue); font-size: 0.9rem; font-weight: 700; text-align: center;">
                            Última atualização: Março de 2026. Equipe Projeto Victória.
                        </p>
                    </div>
                </section>

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
