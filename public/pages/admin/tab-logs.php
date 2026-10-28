

<header class="admin-page-header">
    <div>
        <p>Registro de Atividades</p>
        <h2>Logs do Sistema</h2>
    </div>
    <div class="admin-search">
        <button class="btn-admin btn-admin-outline btn-admin-sm" id="btnLimparLogs" title="Remover logs antigos">
            <i class="fas fa-broom"></i> Limpar Antigos
        </button>
    </div>
</header>

<div class="logs-filter-bar">
    <div class="logs-filter-group">
        <label for="filtroModulo"><i class="fas fa-tag"></i> Módulo</label>
        <select id="filtroModulo" class="dash-field">
            <option value="todos">Todos</option>
        </select>
    </div>

    <div class="logs-filter-group">
        <label for="filtroBusca"><i class="fas fa-search"></i> Buscar</label>
        <input type="text" id="filtroBusca" class="dash-field" placeholder="Usuário, ação, descrição...">
    </div>

    <div class="logs-filter-group">
        <label for="filtroDe"><i class="fas fa-calendar"></i> De</label>
        <input type="date" id="filtroDe" class="dash-field">
    </div>

    <div class="logs-filter-group">
        <label for="filtroAte"><i class="fas fa-calendar-check"></i> Até</label>
        <input type="date" id="filtroAte" class="dash-field">
    </div>

    <div class="logs-filter-actions">
        <button class="btn-admin btn-admin-primary btn-admin-sm" id="btnFiltrarLogs">
            <i class="fas fa-filter"></i> Filtrar
        </button>
        <button class="btn-admin btn-admin-outline btn-admin-sm" id="btnLimparFiltros">
            <i class="fas fa-times"></i> Limpar
        </button>
    </div>
</div>

<div class="logs-result-info" id="logsResultInfo">
    <span id="logsTotalLabel">Carregando...</span>
</div>

<div class="admin-card">
    <div class="admin-card-header">
        <i class="fas fa-list"></i>
        <h3>Atividades</h3>
        <span class="card-badge" id="logsBadge">—</span>
    </div>
    <div id="logsListContainer">
        <div class="admin-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando logs...</p>
        </div>
    </div>
</div>

<div class="admin-pagination" id="logsPagination"></div>
