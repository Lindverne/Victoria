<?php

/*

  Código Legado do Morango (ᗒᗜᗒ)♡ - Relatórios.php

    include "../PHP/Protect.php";
    Protect();

*/

require_once dirname(__DIR__) . '/helpers/caminhos.php';
require_once dirname(__DIR__) . '/../api/middleware/verificador.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Central de Análise de Consumo de Água.">
    <title>Relatórios | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/relatorios.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js"></script>
</head>

<body>
    <div id="top"></div>

    <?php

require_once dirname(__DIR__) . '/components/header.php';

?>

    <?php

$heroSubtitle = 'Central de Análise';
    $heroTitle = 'Relatórios Inteligentes';
    $heroDescription = 'Visualize, analise e monitore seu consumo de água com gráficos avançados.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main>
        <div class="dashboard-main-wrapper">
            <div class="dashboard-container">

                <header class="dash-internal-header">
                    <div class="dash-title-group">
                        <p>Visão completa do seu consumo de água.</p>
                        <h2>Central de Análise</h2>
                    </div>
                    <div class="report-controls">
                        <button class="btn-export" id="btnExportPDF">
                            <i class="far fa-file-pdf"></i> Exportar Relatório
                        </button>
                    </div>
                </header>

                
                <section class="period-selector">
                    <div class="period-buttons">
                        <button class="period-btn active" data-period="mes">Mês</button>
                        <button class="period-btn" data-period="hoje">Hoje</button>
                        <button class="period-btn" data-period="semana">Semana</button>
                        <button class="period-btn" data-period="trimestre">Trimestre</button>
                        <button class="period-btn" data-period="semestre">Semestre</button>
                        <button class="period-btn" data-period="ano">Ano</button>
                        <button class="period-btn" data-period="personalizado">Personalizado</button>
                    </div>
                    <div class="period-date-range" id="periodDateRange" style="display:none;">
                        <label>De:</label>
                        <input type="date" id="periodStart">
                        <label>Até:</label>
                        <input type="date" id="periodEnd">
                        <button class="period-apply" id="periodApply">Aplicar</button>
                    </div>
                </section>

                
                <section class="executive-grid" id="executiveGrid">
                    <div class="exec-card">
                        <div class="exec-card-icon"><i class="fas fa-droplet"></i></div>
                        <div class="exec-card-body">
                            <span class="exec-card-label">Consumo do Período</span>
                            <span class="exec-card-value" id="execConsumo">-- <small>m³</small></span>
                        </div>
                    </div>
                    <div class="exec-card">
                        <div class="exec-card-icon"><i class="fas fa-hand-holding-dollar"></i></div>
                        <div class="exec-card-body">
                            <span class="exec-card-label">Custo Estimado</span>
                            <span class="exec-card-value" id="execValor">R$ 0,00</span>
                        </div>
                    </div>
                    <div class="exec-card">
                        <div class="exec-card-icon"><i class="fas fa-bullseye"></i></div>
                        <div class="exec-card-body">
                            <span class="exec-card-label">Meta Mensal</span>
                            <span class="exec-card-value" id="execMeta">-- <small>%</small></span>
                        </div>
                    </div>
                </section>

                
                <section class="charts-section">
                    <div class="charts-grid">

                        <div class="chart-card">
                            <div class="chart-card-header">
                                <i class="fas fa-chart-pie"></i>
                                <h3>Distribuição Semanal</h3>
                                <button class="chart-expand" data-chart="chartDonut" title="Expandir"><i class="fas fa-expand"></i></button>
                            </div>
                            <div id="chartDonut"></div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-card-header">
                                <i class="fas fa-chart-column"></i>
                                <h3>Consumo Diário</h3>
                                <button class="chart-expand" data-chart="chartColunas" title="Expandir"><i class="fas fa-expand"></i></button>
                            </div>
                            <div id="chartColunas"></div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-card-header">
                                <i class="fas fa-chart-line"></i>
                                <h3>Evolução Mensal</h3>
                                <button class="chart-expand" data-chart="chartLinha" title="Expandir"><i class="fas fa-expand"></i></button>
                            </div>
                            <div id="chartLinha"></div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-card-header">
                                <i class="fas fa-chart-area"></i>
                                <h3>Volume Acumulado</h3>
                                <button class="chart-expand" data-chart="chartArea" title="Expandir"><i class="fas fa-expand"></i></button>
                            </div>
                            <div id="chartArea"></div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-card-header">
                                <i class="fas fa-chart-line"></i>
                                <h3>Previsão Mensal</h3>
                                <button class="chart-expand" data-chart="chartPrevisao" title="Expandir"><i class="fas fa-expand"></i></button>
                            </div>
                            <div id="chartPrevisao"></div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-card-header">
                                <i class="fas fa-gauge-high"></i>
                                <h3>Meta de Economia</h3>
                                <button class="chart-expand" data-chart="chartGauge" title="Expandir"><i class="fas fa-expand"></i></button>
                            </div>
                            <div id="chartGauge"></div>
                        </div>

                    </div>
                </section>

                
                <div class="stats-mini-grid">
                    <div class="stat-mini-card">
                        <span class="mini-label">Consumo Hoje</span>
                        <div class="mini-value-row">
                            <strong class="mini-number" id="statHoje">--</strong>
                            <span class="mini-unit">m³</span>
                        </div>
                        <span class="mini-change" id="changeHoje"></span>
                    </div>

                    <div class="stat-mini-card">
                        <span class="mini-label">Esta Semana</span>
                        <div class="mini-value-row">
                            <strong class="mini-number" id="statSemana">--</strong>
                            <span class="mini-unit">m³</span>
                        </div>
                        <span class="mini-change" id="changeSemana"></span>
                    </div>

                    <div class="stat-mini-card">
                        <span class="mini-label">Este Mês</span>
                        <div class="mini-value-row">
                            <strong class="mini-number" id="statMes">--</strong>
                            <span class="mini-unit">m³</span>
                        </div>
                        <span class="mini-change" id="changeMes"></span>
                    </div>

                    <div class="stat-mini-card">
                        <span class="mini-label">Variação Mensal</span>
                        <div class="mini-value-row">
                            <strong class="mini-number" id="statVariacao">--</strong>
                            <span class="mini-unit">%</span>
                        </div>
                        <span class="mini-change" id="changeVariacao"></span>
                    </div>
                </div>

                
                <section class="goals-section">
                    <div class="goals-header">
                        <div class="goals-header-left">
                            <i class="fas fa-bullseye"></i>
                            <h3>Metas Mensais</h3>
                        </div>
                        <button class="goals-define-btn" id="goalsDefineBtn">
                            <i class="fas fa-pencil"></i> Definir Meta
                        </button>
                    </div>
                    <div class="goals-card" id="goalsCard">
                        <div class="goals-empty">
                            <i class="fas fa-flag"></i>
                            <p>Nenhuma meta definida para este mês.</p>
                            <button class="goals-empty-btn" id="goalsEmptyBtn">Definir minha meta</button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    </main>

    <?php

require_once dirname(__DIR__) . '/components/footer.php';

?>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
    <script type="module" src="../assets/js/pages/relatorios.js"></script>
</body>

</html>
