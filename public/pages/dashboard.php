<?php

/*

  Código Legado do Morango (ᗣᗜᗣ)♡ - Dashboard.php
  
    include "../PHP/Protect.php";
    Protect();

*/

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
    <title>Dashboard | Victória</title>

    <?= csrfMetaTag() ?>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/metodologia.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/pages/dashboard.css?v=<?= time() ?>">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js"></script>
</head>

<body class="dashboard-page">
    <div id="top"></div>

    <?php

require_once dirname(__DIR__) . '/components/header.php';

?>

    <?php

$heroSubtitle = 'Economia e Sustentabilidade';
    $heroTitle = 'Dashboard de Controle';
    $heroDescription = 'Monitore seu consumo de água em tempo real com o ecossistema Victória.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main>
        <div class="dashboard-main-wrapper">
            <div class="dashboard-container">

                <header class="dash-internal-header">
                    <div class="dash-title-group">
                        <p>Análise detalhada de vazão e tarifação.</p>
                        <h2>Bem-vindo ao seu Dashboard</h2>
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

                <div class="dash-form-wrapper">
                    <aside class="glass-inner-panel form-panel">
                        <div class="panel-title">
                            <i class="fas fa-calculator"></i>
                            <h3>Registrar Medição</h3>
                        </div>

                        <form id="formMedicao" class="dash-form">
                            <div class="input-group">
                                <label for="categoriaTarifa">Categoria da Tarifa</label>
                                <select id="categoriaTarifa" class="dash-field" required>
                                    <option value="" disabled selected>Selecione a categoria...</option>
                                    <option value="Vulneravel">Vulnerável</option>
                                    <option value="Social1">Social 1</option>
                                    <option value="Social2">Social 2</option>
                                    <option value="Residencial">Residencial Comum</option>
                                    <option value="Comercial">Comercial / Industrial</option>
                                    <option value="Assistencia">Assistência Social</option>
                                    <option value="Publica">Pública</option>
                                    <option value="Rural">Rural</option>
                                </select>
                            </div>

                            <div class="alternador-modo" id="alternador-modo">
                                <button type="button" class="botao-modo ativo" data-modo="manual">
                                    <i class="fas fa-keyboard"></i> Manual
                                </button>
                                <button type="button" class="botao-modo" data-modo="foto">
                                    <i class="fas fa-camera"></i> Foto
                                </button>
                            </div>

                            <div class="conteudo-modo" id="conteudo-manual">
                                <div class="input-group">
                                    <label for="leituraAnterior">Leitura Anterior (m³)</label>
                                    <input type="number" id="leituraAnterior" class="dash-field" placeholder="Ex: 120"
                                        step="0.001" required>
                                </div>

                                <div class="input-group">
                                    <label for="leituraAtual">Leitura Atual (m³)</label>
                                    <input type="number" id="leituraAtual" class="dash-field" placeholder="Ex: 135"
                                        step="0.001" required>
                                </div>
                            </div>

                            <div class="conteudo-modo oculto" id="conteudo-foto">
                                <button type="button" class="btn-enviar-foto" id="btn-enviar-foto">
                                    <i class="fas fa-cloud-arrow-up"></i>
                                    <span>Enviar Foto do Hidrômetro</span>
                                </button>

                                <div class="card-preview-foto oculto" id="card-preview-foto">
                                    <img id="img-preview-hidrometro" src="" alt="Foto recortada do hidrômetro">
                                    <span class="chip-leitura-ocr" id="chip-leitura-ocr"></span>
                                </div>

                                <div class="input-group">
                                    <label for="foto-leitura-anterior">Leitura Anterior (m³)</label>
                                    <input type="number" id="foto-leitura-anterior" class="dash-field"
                                        placeholder="Ex: 120" step="1" required disabled>
                                </div>

                                <div class="input-group">
                                    <label for="foto-leitura-atual">Leitura Atual (m³)</label>
                                    <input type="number" id="foto-leitura-atual" class="dash-field"
                                        placeholder="Ex: 135" step="1" required disabled>
                                </div>

                                <p class="dica-modo-foto">Na primeira foto, digite a leitura anterior — nas próximas
                                    ela será lembrada automaticamente.</p>
                            </div>

                            <button type="submit" class="btn-calculate" id="btnSalvarMedicao">
                                <span class="Texto">Calcular Consumo</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </form>
                    </aside>

                    <div id="resultadoDisplay" class="result-box result-panel">
                        <div class="panel-title">
                            <i class="fas fa-file-invoice"></i>
                            <h3>Resultado</h3>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Consumo:</span>
                            <span class="result-value" id="resConsumo">0.00 m³</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Água:</span>
                            <span class="result-value" id="resAgua">R$ 0,00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Esgoto (100%):</span>
                            <span class="result-value" id="resEsgoto">R$ 0,00</span>
                        </div>
                        <div class="result-item total-row">
                            <span class="result-label">Total:</span>
                            <span class="result-value total-value" id="resTotal">R$ 0,00</span>
                        </div>
                        <p id="resInfoExtra" class="res-info-extra"></p>
                    </div>
                </div>

                <section class="charts-section">
                    <div class="charts-grid">

                        <div class="chart-card">
                            <div class="chart-card-header">
                                <i class="fas fa-chart-area"></i>
                                <h3>Projeção de Custo por Volume</h3>
                                <button class="chart-expand" data-chart="chartProjecaoCusto" title="Expandir"><i
                                        class="fas fa-expand"></i></button>
                            </div>
                            <div id="chartProjecaoCusto"></div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-card-header">
                                <i class="fas fa-leaf"></i>
                                <h3>Distribuição da Meta de Sustentabilidade</h3>
                                <button class="chart-expand" data-chart="chartMetaSustentabilidade" title="Expandir"><i
                                        class="fas fa-expand"></i></button>
                            </div>
                            <div id="chartMetaSustentabilidade"></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </main>

    <div id="modal-foto-hidrometro" class="modal-overlay" style="display: none;">
        <div class="modal-content crop-modal">
            <div class="modal-header-crop">
                <h2><i class="fas fa-camera"></i> Foto do Hidrômetro</h2>
                <button type="button" class="btn-fechar-modal-x" id="btn-fechar-foto">&times;</button>
            </div>

            <div class="dropzone" id="dropzone-hidrometro">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <p>Arraste uma imagem, <strong>Cole (Ctrl+V)</strong> ou clique aqui</p>
                <input type="file" id="input-foto-hidrometro" accept="image/*" style="display: none;">
            </div>

            <div class="cropper-container" id="container-cropper-hidrometro"
                style="display: none; width: 100%; max-height: 400px; margin-top: 15px;">
                <img id="imagem-cortar-hidrometro" src="" alt="Prévia da foto para recorte" style="max-width: 100%;">
            </div>

            <div class="divisor-ou"><span>OU</span></div>

            <div class="campo-url-modal">
                <label for="url-foto-hidrometro">Cole a URL da imagem:</label>
                <input type="text" id="url-foto-hidrometro" placeholder="https://exemplo.com/hidrometro.jpg">
            </div>

            <div class="modal-actions">
                <button type="button" class="btn-secondary" id="btn-cancelar-foto">Cancelar</button>
                <button type="button" class="btn-primary" id="btn-ler-recorte" style="display: none;">Ler Recorte
                </button>
            </div>
        </div>
    </div>

    <?php

require_once dirname(__DIR__) . '/components/footer.php';

?>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js"></script>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
    <script type="module" src="../assets/js/pages/dashboard.js"></script>
</body>

</html>
