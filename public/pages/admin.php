<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';
require_once dirname(__DIR__) . '/../api/middleware/verificador-admin.php';
require_once dirname(__DIR__) . '/../api/config/csrf.php';

if (isset($_GET['ajax']) && $_GET['ajax'] === '1')
{
    $tab = $_GET['tab'] ?? 'dashboard';
    $abasPermitidas = ['dashboard', 'usuarios', 'empresas', 'noticias', 'logs'];

    if (!in_array($tab, $abasPermitidas))
    {
        $tab = 'dashboard';
    }

    $tabPath = __DIR__ . "/admin/tab-{$tab}.php";

    if (file_exists($tabPath))
    {
        require $tabPath;
    }

    exit();
}

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Painel Administrativo.">
    <title>Painel Admin | Victória</title>

    <?= csrfMetaTag() ?>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/admin.css?v=2">
    <link rel="stylesheet" href="../assets/css/pages/metodologia.css">
    <link rel="stylesheet" href="../assets/css/pages/dashboard.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js"></script>
</head>

<body class="dashboard-page">
    <div id="top"></div>

    <?php

require_once dirname(__DIR__) . '/components/header.php';

?>

    <?php

$heroSubtitle = 'Administração do Sistema';
    $heroTitle = 'Painel de Controle';
    $heroDescription = 'Gerencie usuários, empresas, notícias e monitore o sistema Victória.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main>
        <div class="dashboard-main-wrapper">
            <div class="dashboard-container">

                <?php

$tab = $_GET['tab'] ?? 'dashboard';
                $abasPermitidas = ['dashboard', 'usuarios', 'empresas', 'noticias', 'logs'];

                if (!in_array($tab, $abasPermitidas))
                {
                    $tab = 'dashboard';
                }

?>

                <div class="admin-layout">

                    
                    <aside class="admin-sidebar">
                        <div class="admin-sidebar-title">Administração</div>
                        <nav class="admin-sidebar-nav" id="adminSidebarNav">
                            <a href="#" data-tab="dashboard" class="<?= $tab === 'dashboard' ? 'active' : '' ?>">
                                <i class="fas fa-chart-pie"></i> <span>Dashboard</span>
                            </a>
                            <a href="#" data-tab="usuarios" class="<?= $tab === 'usuarios' ? 'active' : '' ?>">
                                <i class="fas fa-users"></i> <span>Usuários</span>
                            </a>
                            <a href="#" data-tab="empresas" class="<?= $tab === 'empresas' ? 'active' : '' ?>">
                                <i class="fas fa-building"></i> <span>Empresas</span>
                            </a>
                            <a href="#" data-tab="noticias" class="<?= $tab === 'noticias' ? 'active' : '' ?>">
                                <i class="fas fa-newspaper"></i> <span>Notícias</span>
                            </a>
                            <a href="#" data-tab="logs" class="<?= $tab === 'logs' ? 'active' : '' ?>">
                                <i class="fas fa-history"></i> <span>Logs</span>
                            </a>
                        </nav>
                    </aside>

                    
                    <section class="admin-content">
                        <?php

$tabPath = __DIR__ . "/admin/tab-{$tab}.php";

                        if (file_exists($tabPath))
                        {
                            require $tabPath;
                        }

                        else
                        {
                            echo '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Conteúdo não encontrado.</p></div>';
                        }

?>
                    </section>

                </div>

            </div>
        </div>
    </main>

    <?php

require_once dirname(__DIR__) . '/components/footer.php';

?>

    
    <div id="modalNewsImagem" class="modal-overlay" style="display: none;">
        <div class="modal-content crop-modal">
            <div class="modal-header-crop">
                <h2><i class="fas fa-image"></i> Imagem de Capa</h2>
                <button class="btn-fechar-modal-x" onclick="window.fecharModalNewsImagem()">&times;</button>
            </div>

            <div id="dropzoneNewsImagem" class="dropzone">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Arraste uma imagem, <strong>Cole (Ctrl+V)</strong> ou clique aqui</p>
                <input type="file" id="fileNewsImagem" accept="image/*" style="display: none;">
            </div> <br>

            <div id="containerCropperNewsImagem" style="display:none; max-height: 400px;">
                <img id="imagem-para-cortar-news" src="" alt="" style="display: block; max-width: 100%;">
            </div>

            <div style="text-align: center; margin: 15px 0; color: #999; font-weight: bold;">OU</div>

            <div class="form-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Cole a URL da imagem:</label>
                <input type="text" id="urlNewsImagem" placeholder="https://exemplo.com/imagem.jpg"
                    style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
            </div>

            <div class="modal-actions">
                <button class="btn-secondary" onclick="window.fecharModalNewsImagem()">Cancelar</button>
                <button class="btn-primary" id="btnSalvarNewsImagem">Usar Imagem</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
    <script type="module" src="../assets/js/pages/admin/admin.js?v=5"></script>
</body>

</html>
