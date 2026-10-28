<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';
require_once dirname(__DIR__) . '/../api/middleware/verificador.php';
require_once dirname(__DIR__) . '/../api/config/csrf.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Iluminando caminhos através da tecnologia e inovação.">
    <title>Perfil | Victória</title>

    <?= csrfMetaTag() ?>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">
    <link rel="stylesheet" href="../assets/css/global/nav.css?v=20261028">

    <link rel="stylesheet" href="../assets/css/pages/perfil.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js"></script>

<body>
    <div id="top"></div>

    <?php

require_once dirname(__DIR__) . '/components/header.php';

?>

    <main class="perfil-container-hero">
        <section class="perfil-hero">
            <div class="perfil-banner" id="perfilBanner">
                <div class="banner-overlay"></div>
                <button class="btn-editar-banner" id="btnEditarBanner">
                    <i class="fas fa-image"></i> Alterar Wallpaper
                </button>
                <input type="file" id="fileWallpaper" accept="image/*" style="display: none;">
            </div>

            <div class="perfil-header-content">
                <div class="perfil-avatar-section">
                    <div class="perfil-avatar" id="perfilAvatar"></div>
                </div>

                <div class="perfil-info-hero">
                    <div class="info-text info-box-destaque">
                        <h1 class="perfil-nome" id="perfilNome">Carregando...</h1>
                        <div class="user-identifiers">
                            <span class="perfil-username" id="perfilUsername">@usuario</span>
                            <span class="perfil-email-full" id="perfilEmail">email@exemplo.com</span>
                        </div>
                        
                        <span class="perfil-tipo-badge padrao" id="perfilTipoBadge">
                            <i class="fas fa-user"></i> Carregando...
                        </span>
                    </div>
                    <button class="btn-editar-perfil" id="btnEditarPerfil">
                        <i class="fas fa-edit"></i> Editar Perfil
                    </button>
                </div>
            </div>
        </section>

        <div class="perfil-dashboard-grid">

            <section class="perfil-main-content">
                <p class="perfil-bio" id="perfilBio">Adicione uma descrição ao seu perfil</p>

                <div class="perfil-meta-inline">
                    <span class="meta-item"><i class="fas fa-map-marker-alt"></i> <span id="perfilCidade">...</span></span>
                    <span class="meta-item"><i class="fas fa-briefcase"></i> <span id="perfilProfissao">...</span></span>
                    <span class="meta-item"><i class="fas fa-link"></i> <a href="#" id="perfilWebsite" class="meta-link">Website</a></span>
                    <span class="meta-item"><i class="fas fa-phone"></i> <span id="perfilTelefone">...</span></span>
                    <span class="meta-item"><i class="fas fa-birthday-cake"></i> <span id="perfilDataNascimento">Data não disponível</span></span>
                    <span class="meta-item"><i class="fas fa-calendar-check"></i> <span id="perfilDataCadastro">...</span></span>
                </div>

                <div class="stats-grid-inner">
                    <div class="stat-card">
                        <i class="fas fa-water"></i>
                        <div class="stat-info">
                            <p>Consumo Mensal</p>
                            <b id="statConsumo">0 L</b>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-leaf"></i>
                        <div class="stat-info">
                            <p>Água Economizada</p>
                            <b id="statEconomia">0 L</b>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-chart-line"></i>
                        <div class="stat-info">
                            <p>Eficiência</p>
                            <b id="statEficiencia">0%</b>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-star"></i>
                        <div class="stat-info">
                            <p>Pontuação</p>
                            <b id="statPontuacao">0 pts</b>
                        </div>
                    </div>
                </div>

                
                <div class="metas-section" id="metasSection">
                    <div class="metas-header">
                        <div class="metas-header-left">
                            <i class="fas fa-bullseye"></i>
                            <h3>Meta do Mês</h3>
                        </div>
                        <button class="metas-define-btn" id="metasDefineBtn">
                            <i class="fas fa-pencil"></i> Definir Meta
                        </button>
                    </div>
                    <div class="metas-card" id="metasCard">
                        <div class="metas-empty">
                            <i class="fas fa-flag"></i>
                            <p>Nenhuma meta definida para este mês.</p>
                            <button class="metas-empty-btn" id="metasEmptyBtn">Definir minha meta</button>
                        </div>
                    </div>
                </div>

                
                <div class="mini-chart-section" id="miniChartSection">
                    <div class="mini-chart-header">
                        <div class="mini-chart-header-left">
                            <i class="fas fa-chart-line"></i>
                            <h3>Últimos 6 Meses</h3>
                        </div>
                    </div>
                    <div class="mini-chart-container" id="miniChartContainer"></div>
                </div>
            </section>

            <aside class="perfil-activity-sidebar">
                <div class="sidebar-header">
                    <i class="fas fa-history"></i>
                    <h2>Atividade Recente</h2>
                </div>
                <div class="activity-list" id="activityList">
                </div>
                
                <div id="statusArduinoSidebar"></div>
            </aside>

        </div>
    </main>

    <?php

require_once dirname(__DIR__) . '/components/footer.php';

?>

    <div class="modal-editar" id="modalEditar">
        <div class="container-box modal-editar-box">
            <div class="modal-header">
                <h2><i class="fas fa-user-pen"></i> Editar Perfil</h2>
                <button class="btn-fechar-modal" id="btnFecharModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-perfil-layout">
                <div class="modal-foto-col">
                    <div class="modal-foto-perfil" id="modalFotoPerfil"></div>
                    <button type="button" class="btn-modal-foto" id="btnModalFoto">
                        <i class="fas fa-camera"></i> Alterar Foto
                    </button>
                </div>

                <div class="modal-dados-col">
                    <form class="form-editar" id="formEditar" novalidate>
                        <div class="modal-secao">
                            <div class="modal-secao-titulo">
                                <i class="fas fa-user"></i> Dados Pessoais
                            </div>
                            <div class="modal-secao-grid">
                                <div class="form-group">
                                    <label for="editNome">Nome Completo</label>
                                    <input type="text" id="editNome" placeholder="Seu nome completo" maxlength="50">
                                    <span class="form-hint" id="hintNome">0/50</span>
                                </div>
                                <div class="form-group">
                                    <label for="editCidade">Cidade</label>
                                    <input type="text" id="editCidade" placeholder="Sua cidade" maxlength="50">
                                </div>
                                <div class="form-group">
                                    <label for="editProfissao">Profissão</label>
                                    <input type="text" id="editProfissao" placeholder="Sua profissão" maxlength="50">
                                </div>
                                <div class="form-group">
                                    <label for="editWebsite">Website</label>
                                    <input type="url" id="editWebsite" placeholder="https://seu-website.com" maxlength="100">
                                </div>
                                <div class="form-group">
                                    <label for="editTelefone">Telefone</label>
                                    <input type="text" id="editTelefone" placeholder="(00) 00000-0000" maxlength="20">
                                </div>
                                <div class="form-group">
                                    <label for="editDataNascimento">Data de Nascimento</label>
                                    <input type="date" id="editDataNascimento">
                                </div>
                            </div>
                            <div class="form-group form-group-full">
                                <label for="editBio">Descrição (Bio)</label>
                                <textarea id="editBio" placeholder="Conte um pouco sobre você..." maxlength="160" rows="3"></textarea>
                                <span class="form-hint" id="hintBio">0/160</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="form-buttons">
                <button type="button" class="btn-cancelar" id="btnCancelarEditar">Cancelar</button>
                <button type="submit" form="formEditar" class="btn-salvar">Salvar Alterações</button>
            </div>

            <div class="modal-secao">
                <div class="modal-secao-titulo">
                    <i class="fas fa-user-cog"></i> Alterar Cadastro
                </div>
                <div class="cadastro-sub">
                    <div class="cadastro-block">
                        <div class="cadastro-block-title">
                            <i class="fas fa-envelope"></i>
                            Mudar E-mail
                        </div>
                        <div class="form-group">
                            <label for="cadastroEmail">Novo E-mail</label>
                            <input type="email" id="cadastroEmail" placeholder="seu@email.com" maxlength="100">
                        </div>
                        <div class="form-group">
                            <label for="cadastroSenhaAtual">Senha Atual</label>
                            <input type="password" id="cadastroSenhaAtual" placeholder="Digite sua senha atual" autocomplete="off">
                        </div>
                        <button type="button" class="btn-alterar-senha" id="btnAlterarEmail">
                            <i class="fas fa-check"></i> Mudar E-mail
                        </button>
                    </div>

                    <div class="cadastro-block">
                        <div class="cadastro-block-title">
                            <i class="fas fa-lock"></i>
                            Alterar Senha
                        </div>
                        <div class="senha-toggle" id="senhaToggle">
                            <span class="senha-toggle-left">
                                <i class="fas fa-key"></i>
                                Campos de senha
                            </span>
                            <i class="fas fa-chevron-down senha-toggle-icon" id="senhaToggleIcon"></i>
                        </div>
                        <div class="senha-fields" id="senhaFields">
                            <div class="form-group">
                                <label for="editSenhaAtual">Senha Atual</label>
                                <input type="password" id="editSenhaAtual" placeholder="Digite sua senha atual" autocomplete="off">
                            </div>
                            <div class="form-group">
                                <label for="editNovaSenha">Nova Senha</label>
                                <input type="password" id="editNovaSenha" placeholder="Mínimo de 6 caracteres" autocomplete="off" minlength="6">
                            </div>
                            <div class="form-group">
                                <label for="editConfirmarSenha">Confirmar Nova Senha</label>
                                <input type="password" id="editConfirmarSenha" placeholder="Repita a nova senha" autocomplete="off" minlength="6">
                            </div>
                            <button type="button" class="btn-alterar-senha" id="btnAlterarSenha">
                                <i class="fas fa-check"></i> Alterar Senha
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-secao modal-secao-danger">
                <div class="modal-secao-titulo modal-secao-titulo-danger">
                    <i class="fas fa-triangle-exclamation"></i> Zona de Perigo
                </div>
                <p class="modal-danger-texto">Excluir sua conta remove permanentemente seus gastos e notícias publicadas.</p>
                <button type="button" class="btn-alterar-senha btn-deletar-conta" id="btnDeletarConta">
                    <i class="fas fa-trash-alt"></i> Deletar Minha Conta
                </button>
            </div>
        </div>
    </div>

    <div id="modal-crop-foto" class="modal-overlay" style="display: none;">
        <div class="modal-content crop-modal">
            <h2>Atualizar Foto de Perfil</h2>

            <div id="dropzone-avatar" class="dropzone">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <p>Arraste uma imagem, <strong>Cole (Ctrl+V)</strong> ou clique aqui</p>
                <input type="file" id="input-foto-oculto" accept="image/*" style="display: none;">
            </div>

            <div class="cropper-container" style="display: none; width: 100%; max-height: 400px; margin-top: 15px;">
                <img id="imagem-para-cortar" src="" alt="" style="max-width: 100%;">
            </div>

            <div style="text-align: center; margin: 15px 0; color: #999; font-weight: bold;">OU</div>

            <div class="form-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Cole a URL da imagem:</label>
                <input type="text" id="urlAvatar" placeholder="https://exemplo.com/imagem.jpg"
                    style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
            </div>

            <div class="modal-actions" style="margin-top: 20px;">
                <button id="btn-cancelar-crop" class="btn-secondary">Cancelar</button>
                <button id="btn-salvar-crop" class="btn-primary" style="display: none;">Salvar Foto</button>
            </div>
        </div>
    </div>

    <div id="modalWallpaper" class="modal-overlay" style="display: none;">
        <div class="modal-content crop-modal">
            <div class="modal-header-crop">
                <h2><i class="fas fa-image"></i> Alterar Banner</h2>
                <button class="btn-fechar-modal-x" onclick="fecharModalWallpaper()">&times;</button>
            </div>

            <div id="dropzoneWallpaper" class="dropzone">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Arraste uma imagem, <strong>Cole (Ctrl+V)</strong> ou clique aqui</p>
            </div> <br>

            <div id="containerCropperWallpaper" style="display:none; max-height: 400px;">
                <img id="imagem-para-cortar-wallpaper" src="" alt="" style="display: block; max-width: 100%;">
            </div>

            <div style="text-align: center; margin: 15px 0; color: #999; font-weight: bold;">OU</div>

            <div class="form-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Cole a URL da imagem:</label>
                <input type="text" id="urlWallpaper" placeholder="https://exemplo.com/imagem.jpg"
                    style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
            </div>

            <div class="modal-actions">
                <button class="btn-secondary" onclick="fecharModalWallpaper()">Cancelar</button>
                <button class="btn-primary" id="btnSalvarWallpaper" style="display: none;">Salvar Banner</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.min.js"></script>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
    <script type="module" src="../assets/js/pages/perfil.js"></script>
</body>

</html>
