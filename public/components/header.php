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

                            <a href="<?= BASE_URL ?>/pages/protocolos.php" class="rich-link-item" role="menuitem">
                                <span class="item-title">Protocolos IoT</span>
                                <span class="item-desc">Comunicação e integridade de dados.</span>
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
            <li class="nav-item nav-item-admin nav-hidden" role="none"><a href="<?= BASE_URL ?>/pages/admin.php" class="nav-link" role="menuitem"><i class="fa-solid fa-shield-halved nav-icon" aria-hidden="true"></i> Admin</a></li>
            <li class="nav-item" role="none"><a href="<?= BASE_URL ?>/pages/sobre.php" class="nav-link" role="menuitem"><i class="fa-solid fa-circle-info nav-icon" aria-hidden="true"></i> Sobre o TCC</a></li>
        </ul>

        <button class="hamburger-btn" id="hamburgerBtn" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="mobile-menu">
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
        </button>

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
