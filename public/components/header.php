<button class="btn-toggle-tema tema-toggle-flutuante" id="btn-toggle-tema" type="button" aria-label="Alternar tema" title="Tema"><i class="fa-solid fa-moon" aria-hidden="true"></i></button>
<nav class="nav-wrapper" role="navigation" aria-label="Navegação principal">
    <div class="nav-content">
        <a href="<?= BASE_URL ?>/index.php" class="brand-logo" aria-label="Victória - Página inicial">
            <img src="<?= ASSETS_URL ?>/img/logos/logo-victoria.webp" alt="Logotipo Victória" class="logo-icon">
        </a>

        <ul class="nav-list-center" role="menubar">
            <li class="nav-item has-dropdown" role="none">
                <a href="#" class="nav-link" role="menuitem" aria-haspopup="true" aria-expanded="false" aria-controls="mega-menu-plataforma" id="mega-menu-trigger">
                    <i class="fa-solid fa-droplet nav-icon" aria-hidden="true"></i> Plataforma
                    <svg class="chevron-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </a>
                <div class="mega-menu-wrapper" id="mega-menu-plataforma" role="menu" aria-label="Submenu Plataforma" hidden>
                    <div class="mega-menu-inner">
                        <div class="menu-column" role="none">
                            <h3 role="presentation"><i class="fa-solid fa-chart-line" aria-hidden="true"></i> Telemetria</h3>

                            <a href="<?= BASE_URL ?>/pages/dashboard.php" class="rich-link-item" role="menuitem">
                                <span class="item-title">Dashboard Analítico</span>
                                <span class="item-desc">Monitoramento de fluxo em tempo real.</span>
                            </a>

                            <a href="<?= BASE_URL ?>/pages/relatorios.php" class="rich-link-item" role="menuitem">
                                <span class="item-title">Relatórios Inteligentes</span>
                                <span class="item-desc">Consumo médio e picos de vazão.</span>
                            </a>
                        </div>
                        <div class="menu-column" role="none">
                            <h3 role="presentation"><i class="fa-solid fa-microchip" aria-hidden="true"></i> Arquitetura</h3>

                            <a href="<?= BASE_URL ?>/pages/hardware.php" class="rich-link-item" role="menuitem">
                                <span class="item-title">Especificação de Hardware</span>
                                <span class="item-desc">Microcontroladores e sensores de precisão.</span>
                            </a>

                            <a href="<?= BASE_URL ?>/pages/aqua.php" class="rich-link-item" role="menuitem">
                                <span class="item-title">App Aqua</span>
                                <span class="item-desc">Monitoramento móvel de consumo de água.</span>
                            </a>
                        </div>
                        <div class="menu-column" role="none">
                            <h3 role="presentation"><i class="fa-solid fa-book" aria-hidden="true"></i> Informativo</h3>

                            <a href="<?= BASE_URL ?>/pages/noticias.php" class="rich-link-item" role="menuitem">
                                <span class="item-title">Notícias</span>
                                <span class="item-desc">Atualizações sobre abastecimento, tarifas e consumo regional.</span>
                            </a>

                            <a href="<?= BASE_URL ?>/pages/documentacao.php" class="rich-link-item" role="menuitem">
                                <span class="item-title">Documentação & Fontes</span>
                                <span class="item-desc">Base científica, fichamentos e documentação técnica do projeto.</span>
                            </a>
                        </div>
                    </div>
                </div>
            </li>
            <li class="nav-item" role="none"><a href="<?= BASE_URL ?>/pages/metodologia.php" class="nav-link" role="menuitem"><i class="fa-solid fa-flask nav-icon" aria-hidden="true"></i> Metodologia</a></li>
            <li class="nav-item" role="none"><a href="<?= BASE_URL ?>/pages/sobre.php" class="nav-link" role="menuitem"><i class="fa-solid fa-circle-info nav-icon" aria-hidden="true"></i> Sobre o TCC</a></li>
        </ul>

        <label class="burger" id="hamburgerBtn" for="burger" role="button" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="mega-coluna-kasane-teto">
            <input type="checkbox" id="burger" hidden>
            <i class="fa-solid fa-bars" id="burger-icon" aria-hidden="true"></i>
        </label>

        <div class="nav-right">
            <div class="container-usuario-nav">
                <a href="<?= BASE_URL ?>/pages/login.php" class="nav-btn-access" id="btn-login-nav">
                    <i class="fa-solid fa-key" aria-hidden="true"></i> Fazer Login
                </a>

                <div class="perfil-usuario-wrapper nav-hidden" id="wrapper-usuario-logado">
                    <button class="avatar-trigger-nav" id="btn-avatar-nav" aria-haspopup="true" aria-expanded="false" aria-controls="dropdown-perfil" aria-label="Menu do usuário">
                        <span class="inicial-avatar">?</span>
                    </button>

                    <div class="dropdown-perfil-glass" id="dropdown-perfil" role="menu" aria-label="Menu do perfil" hidden>
                        <div class="dropdown-header">
                            <span class="user-email"></span>
                            <button class="btn-fechar-dropdown" id="fechar-dropdown" aria-label="Fechar menu do perfil">
                                <i class="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </div>

                        <div class="dropdown-body-central">
                            <div class="avatar-grande-container">
                                <span class="inicial-avatar-grande">?</span>
                            </div>
                            <h3 class="saudacao-usuario"></h3>
                            <a href="<?= BASE_URL ?>/pages/perfil.php" class="btn-gerir-conta" role="menuitem">Configurações de Perfil</a>
                        </div>

                        <div class="dropdown-footer">
                            <button class="btn-logout" id="btn-logout" role="menuitem">
                                <i class="fas fa-sign-out-alt" aria-hidden="true"></i> Encerrar Sessão
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</nav>

<nav class="mega-coluna-kasane-teto" id="mega-coluna-kasane-teto" role="navigation" aria-label="Menu mobile" hidden>
    <div class="coluna-header">
        <button class="btn-fechar-coluna" id="btn-fechar-coluna" aria-label="Fechar menu de navegação">
            <i class="fa-solid fa-times" aria-hidden="true"></i>
        </button>
        <h2 class="coluna-titulo">Navegação</h2>
    </div>
    <div class="coluna-conteudo" role="menu">
        <div class="coluna-grupo">
            <h3 class="coluna-grupo-titulo"><i class="fa-solid fa-droplet" aria-hidden="true"></i> Plataforma</h3>
        <a href="<?= BASE_URL ?>/pages/dashboard.php" class="coluna-link" role="menuitem">
            <i class="fa-solid fa-gauge-high coluna-link-icon" aria-hidden="true"></i>
            <span class="coluna-link-texto">Dashboard Analítico</span>
        </a>
        <a href="<?= BASE_URL ?>/pages/relatorios.php" class="coluna-link" role="menuitem">
            <i class="fa-solid fa-chart-line coluna-link-icon" aria-hidden="true"></i>
            <span class="coluna-link-texto">Relatórios Inteligentes</span>
        </a>
        <a href="<?= BASE_URL ?>/pages/hardware.php" class="coluna-link" role="menuitem">
            <i class="fa-solid fa-microchip coluna-link-icon" aria-hidden="true"></i>
            <span class="coluna-link-texto">Especificação de Hardware</span>
        </a>
        <a href="<?= BASE_URL ?>/pages/aqua.php" class="coluna-link" role="menuitem">
            <i class="fa-solid fa-mobile-screen coluna-link-icon" aria-hidden="true"></i>
            <span class="coluna-link-texto">App Aqua</span>
        </a>
        <a href="<?= BASE_URL ?>/pages/noticias.php" class="coluna-link" role="menuitem">
            <i class="fa-solid fa-newspaper coluna-link-icon" aria-hidden="true"></i>
            <span class="coluna-link-texto">Notícias</span>
        </a>
        <a href="<?= BASE_URL ?>/pages/documentacao.php" class="coluna-link" role="menuitem">
            <i class="fa-solid fa-book coluna-link-icon" aria-hidden="true"></i>
            <span class="coluna-link-texto">Documentação &amp; Fontes</span>
        </a>
        </div>
        <div class="coluna-grupo">
            <h3 class="coluna-grupo-titulo"><i class="fa-solid fa-flask" aria-hidden="true"></i> Metodologia</h3>
            <a href="<?= BASE_URL ?>/pages/metodologia.php" class="coluna-link" role="menuitem">
                <i class="fa-solid fa-flask coluna-link-icon" aria-hidden="true"></i>
                <span class="coluna-link-texto">Metodologia</span>
            </a>
        </div>
        <div class="coluna-grupo">
            <h3 class="coluna-grupo-titulo"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Sobre o TCC</h3>
            <a href="<?= BASE_URL ?>/pages/sobre.php" class="coluna-link" role="menuitem">
                <i class="fa-solid fa-circle-info coluna-link-icon" aria-hidden="true"></i>
                <span class="coluna-link-texto">Sobre o TCC</span>
            </a>
        </div>
        <div class="coluna-divisor"></div>
    </div>
    <div class="coluna-base">
        <div class="coluna-auth" id="coluna-auth">
            <a href="<?= BASE_URL ?>/pages/login.php" class="coluna-btn-login" id="coluna-btn-login">
                <i class="fa-solid fa-key coluna-auth-icon" aria-hidden="true"></i> Fazer Login
            </a>
            <div class="coluna-perfil nav-hidden" id="coluna-perfil">
                <div class="coluna-avatar" id="coluna-avatar">
                    <span class="coluna-inicial">?</span>
                </div>
                <h3 class="coluna-saudacao" id="coluna-saudacao">Olá, Usuário</h3>
                <p class="coluna-email" id="coluna-email">perfil@victoria.com</p>
                <a href="<?= BASE_URL ?>/pages/perfil.php" class="coluna-link coluna-link-perfil" role="menuitem">
                    <i class="fa-solid fa-user-gear coluna-link-icon" aria-hidden="true"></i>
                    <span class="coluna-link-texto">Configurações de Perfil</span>
                </a>
                <button class="coluna-link coluna-link-perfil coluna-link-logout" id="coluna-btn-logout" role="menuitem">
                    <i class="fa-solid fa-sign-out-alt coluna-link-icon" aria-hidden="true"></i>
                    <span class="coluna-link-texto">Encerrar Sessão</span>
                </button>
            </div>
        </div>
        <div class="coluna-rodape">
        </div>
    </div>
</nav>
