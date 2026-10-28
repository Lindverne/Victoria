

<header class="dash-internal-header">
    <div class="dash-title-group">
        <p>Visão Geral do Sistema</p>
        <h2>Dashboard Administrativo</h2>
    </div>
</header>

<div class="admin-stats-grid" id="adminStatsGrid">
    <div class="admin-stat-card">
        <div class="stat-icon"><i class="fas fa-users"></i></div>
        <div class="stat-value" id="statUsuarios">—</div>
        <div class="stat-label">Usuários</div>
        <div class="stat-sub" id="statUsuariosDetalhe">Carregando...</div>
    </div>
    <div class="admin-stat-card">
        <div class="stat-icon"><i class="fas fa-building"></i></div>
        <div class="stat-value" id="statEmpresas">—</div>
        <div class="stat-label">Empresas</div>
        <div class="stat-sub" id="statEmpresasDetalhe">Carregando...</div>
    </div>
    <div class="admin-stat-card">
        <div class="stat-icon"><i class="fas fa-newspaper"></i></div>
        <div class="stat-value" id="statNoticias">—</div>
        <div class="stat-label">Notícias</div>
        <div class="stat-sub" id="statNoticiasDetalhe">Carregando...</div>
    </div>
    <div class="admin-stat-card">
        <div class="stat-icon"><i class="fas fa-droplet"></i></div>
        <div class="stat-value" id="statGastos">—</div>
        <div class="stat-label">Registros de Consumo</div>
        <div class="stat-sub" id="statGastosDetalhe">Carregando...</div>
    </div>
</div>

<div class="admin-cards-duo">
    <div class="admin-card">
        <div class="admin-card-header">
            <i class="fas fa-user-plus"></i>
            <h3>Novos Usuários</h3>
            <span class="card-badge">6 meses</span>
        </div>
        <div id="chartNovosUsuarios" style="height: 250px;">
            <div class="admin-loading">
                <i class="fas fa-spinner"></i>
                <p>Carregando gráfico...</p>
            </div>
        </div>
    </div>
    <div class="admin-card">
        <div class="admin-card-header">
            <i class="fas fa-chart-line"></i>
            <h3>Consumo Médio</h3>
            <span class="card-badge">6 meses</span>
        </div>
        <div id="chartConsumoMedio" style="height: 250px;">
            <div class="admin-loading">
                <i class="fas fa-spinner"></i>
                <p>Carregando gráfico...</p>
            </div>
        </div>
    </div>
</div>

<div class="admin-card">
    <div class="admin-card-header">
        <i class="fas fa-history"></i>
        <h3>Últimas Atividades</h3>
        <span class="card-badge">10 mais recentes</span>
    </div>
    <div id="adminLogsList">
        <div class="admin-loading">
            <i class="fas fa-spinner"></i>
            <p>Carregando logs...</p>
        </div>
    </div>
</div>

<script>

</script>
