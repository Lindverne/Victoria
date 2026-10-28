import { urlImagemSegura } from "../utils/url-segura.js";

const API_BASE = window.location.pathname.includes("/pages/")
  ? "../../api"
  : "../api";

const CACHE_TTL_MS = 5 * 60 * 1000;
const CHAVE_LEITURA_ANTERIOR = "victoria_leitura_hidrometro";
const LIMITE_UPLOAD_BYTES = 5 * 1024 * 1024;
const LIMITE_DIGITOS_LEITURA = 8;

let historicoCache = { data: [], timestamp: 0 };
let cropperHidrometro = null;
let modoAtivo = "manual";

function isCacheValido()
{
  return historicoCache.data.length > 0 && (Date.now() - historicoCache.timestamp) < CACHE_TTL_MS;
}

function invalidarHistoricoCache()
{
  historicoCache = { data: [], timestamp: 0 };
}

window.addEventListener('storage', (e) => {

  if (e.key === 'victoria_historico_invalidado') {
    invalidarHistoricoCache();
  }

});

function notificarInvalidacaoCache()
{

  try {
    localStorage.setItem('victoria_historico_invalidado', Date.now().toString());
  } catch (e) {
  }

}

async function carregarHistorico(forceRefresh = false)
{

  if (!forceRefresh && isCacheValido()) {
    return historicoCache.data;
  }

  try
  {
    const res = await fetch(`${API_BASE}/gastos/listar.php`, {
      credentials: "include",
    });
    const json = await res.json();

    if (json.success && Array.isArray(json.gastos))
    {
      historicoCache = { data: json.gastos, timestamp: Date.now() };
      return json.gastos;
    }

  }

  catch (e)
  {
  }

  return historicoCache.data;
}

function calcularTarifaLocal(categoria, consumoM3)
{
  let valorAgua = 0;
  let mensagemExtra = "";
  let statusConsumo = 1;

  switch (categoria)
  {
    case "Vulneravel":

      if (consumoM3 <= 10) valorAgua = 8.74;

      else if (consumoM3 <= 20) valorAgua = 8.74 + (consumoM3 - 10) * 1.1;

      else if (consumoM3 <= 30) valorAgua = 8.74 + 10 * 1.1 + (consumoM3 - 20) * 3.67;

      else if (consumoM3 <= 50) valorAgua = 8.74 + 10 * 1.1 + 10 * 3.67 + (consumoM3 - 30) * 11.1;
      else valorAgua = 8.74 + 10 * 1.1 + 10 * 3.67 + 20 * 11.1 + (consumoM3 - 50) * 12.26;
      mensagemExtra = "Categoria Vulnerável: Benefício de tarifa super reduzida aplicado.";
      statusConsumo = 2;
      break;

    case "Social1":

      if (consumoM3 <= 10) valorAgua = 11.46;

      else if (consumoM3 <= 20) valorAgua = 11.46 + (consumoM3 - 10) * 2.18;

      else if (consumoM3 <= 30) valorAgua = 11.46 + 10 * 2.18 + (consumoM3 - 20) * 7.79;

      else if (consumoM3 <= 50) valorAgua = 11.46 + 10 * 2.18 + 10 * 7.79 + (consumoM3 - 30) * 11.1;
      else valorAgua = 11.46 + 10 * 2.18 + 10 * 7.79 + 20 * 11.1 + (consumoM3 - 50) * 12.26;
      mensagemExtra = "Categoria Social 1: Tarifa social aplicada com sucesso.";
      statusConsumo = 2;
      break;

    case "Social2":

      if (consumoM3 <= 10) valorAgua = 20.21;

      else if (consumoM3 <= 15) valorAgua = 20.21 + (consumoM3 - 10) * 3.2;

      else if (consumoM3 <= 20) valorAgua = 20.21 + 5 * 3.2 + (consumoM3 - 15) * 6.4;

      else if (consumoM3 <= 50) valorAgua = 20.21 + 5 * 3.2 + 5 * 6.4 + (consumoM3 - 20) * 15.95;
      else valorAgua = 20.21 + 5 * 3.2 + 5 * 6.4 + 30 * 15.95 + (consumoM3 - 50) * 17.57;
      mensagemExtra = "Categoria Social 2: Faixas de consumo intermediárias aplicadas.";
      statusConsumo = 2;
      break;

    case "Residencial":

      if (consumoM3 <= 10) valorAgua = 40.42;

      else if (consumoM3 <= 20) valorAgua = 40.42 + (consumoM3 - 10) * 6.4;

      else if (consumoM3 <= 50) valorAgua = 40.42 + 10 * 6.4 + (consumoM3 - 20) * 15.95;
      else valorAgua = 40.42 + 10 * 6.4 + 30 * 15.95 + (consumoM3 - 50) * 17.57;
      mensagemExtra = "Categoria Residencial: Padrão de tarifação normal.";
      break;

    case "Comercial":

      if (consumoM3 <= 10) valorAgua = 81.57;

      else if (consumoM3 <= 20) valorAgua = 81.57 + (consumoM3 - 10) * 15.95;

      else if (consumoM3 <= 50) valorAgua = 81.57 + 10 * 15.95 + (consumoM3 - 20) * 30.57;
      else valorAgua = 81.57 + 10 * 15.95 + 30 * 30.57 + (consumoM3 - 50) * 31.84;
      mensagemExtra = "Categoria Comercial: Lembre-se, economia de água reduz custos operacionais.";
      break;

    case "Assistencia":

      if (consumoM3 <= 10) valorAgua = 40.78;

      else if (consumoM3 <= 20) valorAgua = 40.78 + (consumoM3 - 10) * 7.97;

      else if (consumoM3 <= 50) valorAgua = 40.78 + 10 * 7.97 + (consumoM3 - 20) * 15.34;
      else valorAgua = 40.78 + 10 * 7.97 + 30 * 15.34 + (consumoM3 - 50) * 15.94;
      mensagemExtra = "Categoria Assistência Social.";
      break;

    case "Publica":

      if (consumoM3 <= 10) valorAgua = 61.11;

      else if (consumoM3 <= 20) valorAgua = 61.11 + (consumoM3 - 10) * 11.95;

      else if (consumoM3 <= 50) valorAgua = 61.11 + 10 * 11.95 + (consumoM3 - 20) * 22.99;
      else valorAgua = 61.11 + 10 * 11.95 + 30 * 22.99 + (consumoM3 - 50) * 23.9;
      mensagemExtra = "Categoria Pública (Órgãos e Instituições).";
      break;

    case "Rural":
      valorAgua = 40.42;
      mensagemExtra = "Categoria Rural: Valor fixado na taxa mínima.";
      break;

    default:
      valorAgua = 0;
      mensagemExtra = "Categoria desconhecida.";
  }

  const valorEsgoto = valorAgua;
  const valorTotalFatura = valorAgua + valorEsgoto;

  return {
    valor_agua: valorAgua,
    valor_esgoto: valorEsgoto,
    valor_total: valorTotalFatura,
    mensagem: mensagemExtra,
    status_consumo: statusConsumo,
  };

}

let periodoAtual = "mes";
let dadosPeriodo = [];

function filtrarPorPeriodo(historico, periodo)
{

  if (!historico.length) return [];
  const hoje = new Date();
  let inicio, fim;

  const toISO = (d) => d.toISOString().split("T")[0];

  switch (periodo)
  {
    case "hoje":
      inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      fim = hoje;
      break;
    case "semana":
      inicio = new Date(hoje);
      inicio.setDate(hoje.getDate() - 7);
      fim = hoje;
      break;
    case "mes":
      inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      fim = hoje;
      break;
    case "trimestre":
      inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1);
      fim = hoje;
      break;
    case "semestre":
      inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, 1);
      fim = hoje;
      break;
    case "ano":
      inicio = new Date(hoje.getFullYear(), 0, 1);
      fim = hoje;
      break;
    default:
      return [...historico];
  }

  const inicioISO = toISO(inicio);
  const fimISO = toISO(fim);
  return historico.filter(
    (r) => r.data_leitura >= inicioISO && r.data_leitura <= fimISO,
  );
}

function atualizarResumoExecutivo(dados)
{
  const elConsumo = document.getElementById("execConsumo");
  const elValor = document.getElementById("execValor");
  const elMeta = document.getElementById("execMeta");

  if (!elConsumo) return;

  if (!dados.length)
  {
    elConsumo.innerHTML = "-- <small>m³</small>";
    elValor.textContent = "R$ 0,00";
    elMeta.innerHTML = "-- <small>%</small>";
    return;
  }

  const total = dados.reduce((s, r) => s + (parseFloat(r.consumo_m3) || 0), 0);
  elConsumo.innerHTML = `${total.toFixed(1)} <small>m³</small>`;

  const custo = dados.reduce((s, r) => {
    const ve = parseFloat(r.valor_estimado);

    if (!isNaN(ve) && ve > 0) return s + ve;
    const cm = parseFloat(r.consumo_m3 ?? r.consumo);
    return s + (isNaN(cm) ? 0 : cm * 10.5);
  }, 0);
  elValor.textContent = custo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  if (historicoCache.data.length >= 2)
  {
    const totalTodos = historicoCache.data.reduce(
      (s, r) => s + (parseFloat(r.consumo_m3) || 0),
      0,
    );
    const media = totalTodos / historicoCache.data.length;
    const ultimo = parseFloat(historicoCache.data[0].consumo_m3) || 0;
    const meta =
      media > 0
        ? Math.min(100, Math.round((1 - (ultimo - media) / media) * 100))
        : 0;

    const metaVal = Math.max(0, meta);
    elMeta.innerHTML = `${metaVal} <small>%</small>`;
    elMeta.style.color =
      metaVal >= 80 ? "#27ae60" : metaVal >= 50 ? "#e8a838" : "#e74c3c";
  }
  else
  {
    elMeta.innerHTML = "-- <small>%</small>";
  }

}

function setPeriodoDashboard()
{
  dadosPeriodo = filtrarPorPeriodo(historicoCache.data, periodoAtual);
  atualizarResumoExecutivo(dadosPeriodo);
}

function configurarPeriodoDashboard()
{
  document.querySelectorAll(".period-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const periodo = btn.dataset.period;

      document
        .querySelectorAll(".period-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const dateRange = document.getElementById("periodDateRange");

      if (periodo === "personalizado")
      {
        dateRange.style.display = "flex";
        return;
      }

      dateRange.style.display = "none";
      periodoAtual = periodo;
      setPeriodoDashboard();
    });
  });

  document.getElementById("periodApply")?.addEventListener("click", () => {
    const start = document.getElementById("periodStart")?.value;
    const end = document.getElementById("periodEnd")?.value;

    if (!start || !end)
    {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Selecione a data de início e fim.",
      });
      return;
    }

    dadosPeriodo = historicoCache.data.filter(
      (r) => r.data_leitura >= start && r.data_leitura <= end,
    );
    atualizarResumoExecutivo(dadosPeriodo);
  });
}

const temaEscuro = () => document.documentElement.dataset.theme === "dark";
const corTextoGrafico = () => (temaEscuro() ? "#86b3bd" : "#124559");
const corTextoSuave = () => (temaEscuro() ? "#7fa3ab" : "#598392");
const corGridGrafico = () => (temaEscuro() ? "rgba(134, 179, 189, 0.12)" : "rgba(18, 69, 89, 0.08)");
const corSerie2 = () => (temaEscuro() ? "#6aacc4" : "#3d7a9a");
const CHART_COLORS = () =>
  temaEscuro()
    ? ["#4a7f8f", "#5d8068", "#75688a", "#8a6d3f", "#8a5555", "#55756a", "#6d5d7f", "#446f82"]
    : ["#124559", "#598392", "#aec3b0", "#e8a838", "#c44545", "#4a7c59", "#8e6b8a", "#2a5c72"];
const TOOLTIP_TEXT_COLORS = () =>
  temaEscuro()
    ? ["#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23"]
    : ["#ffffff", "#ffffff", "#1a2a3a", "#1a2a3a", "#ffffff", "#ffffff", "#ffffff", "#ffffff"];

function opcoesBase()
{
  return {
    chart: {
      fontFamily: "Montserrat, sans-serif",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 900,
        animateGradually: { enabled: true, delay: 120 },
        dynamicAnimation: { enabled: true, speed: 400 },
      },
    },
    noData: {
      text: "Nenhum registro de consumo encontrado.",
      align: "center",
      verticalAlign: "middle",
      offsetY: 40,
      style: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: corTextoGrafico(),
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { height: 220 } },
      },
    ],
  };
}

let chartProjecaoCusto = null;
let chartMetaSustentabilidade = null;

function obterChaveMetaPainel()
{
  let idUsuario = "anon";

  try
  {
    const usuario = JSON.parse(localStorage.getItem("victoria_user"));

    if (usuario && usuario.id)
    {
      idUsuario = usuario.id;
    }
  }

  catch (e)
  {
  }

  return "victoria_meta_" + idUsuario;
}

function carregarMetaAtual()
{
  try
  {
    const bruto = localStorage.getItem(obterChaveMetaPainel());

    return bruto ? JSON.parse(bruto) : null;
  }

  catch (e)
  {
    return null;
  }
}

function renderizarProjecaoCusto()
{
  const elemento = document.getElementById("chartProjecaoCusto");

  if (!elemento) return;

  const selectTarifa = document.getElementById("categoriaTarifa");
  const categoria = (selectTarifa && selectTarifa.value) || "Residencial";
  const volumes = [];
  const custos = [];

  for (let m3 = 0; m3 <= 60; m3++)
  {
    volumes.push(m3);
    custos.push(calcularTarifaLocal(categoria, m3).valor_total);
  }

  const formatarMoeda = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (chartProjecaoCusto)
  {
    chartProjecaoCusto.destroy();
  }

  chartProjecaoCusto = new ApexCharts(elemento, {
    series: [{ name: "Custo total", data: custos }],
    ...opcoesBase(),
    chart: { ...opcoesBase().chart, type: "area", height: 260, stacked: false },
    colors: [corSerie2()],
    stroke: { curve: "smooth", width: 2.5, lineCap: "round" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.55,
        opacityTo: 0.02,
        stops: [0, 60, 100],
        gradientToColors: ["#7ab0b4"],
        inverseColors: false,
      },
    },
    markers: { size: 0, hover: { size: 5 } },
    grid: { borderColor: corGridGrafico(), strokeDashArray: 4 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: volumes,
      tickAmount: 12,
      title: {
        text: "Consumo (m³)",
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          color: corTextoGrafico(),
        },
      },
      labels: {
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          colors: [corTextoSuave()],
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (v) =>
          v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }),
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          colors: [corTextoSuave()],
        },
      },
      title: {
        text: "Custo total",
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          color: corTextoGrafico(),
        },
      },
    },
    tooltip: {
      custom: ({ series, dataPointIndex, w }) => {
        const m3 = w.globals.categories[dataPointIndex];
        const valor = formatarMoeda(series[0][dataPointIndex]);
        const cor = corSerie2();

        return `<div style="
                    background: ${cor};
                    color: #ffffff;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-family: Montserrat, sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);">
                        <strong>${m3} m³</strong> — ${valor}
                        <small style="display: block; font-size: 10px; opacity: 0.85;">água + esgoto (100%)</small>
                    </div>`;
      },
    },
  });

  chartProjecaoCusto.render();
}

function obterDadosMetaSustentabilidade(historico)
{
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();
  const meta = carregarMetaAtual();

  if (!meta || meta.mes !== mesAtual || meta.ano !== anoAtual)
  {
    return null;
  }

  const prefixoMes = anoAtual + "-" + String(mesAtual).padStart(2, "0");
  const totalMes = (historico || []).reduce((soma, r) => {
    if (!r.data_leitura || !r.data_leitura.startsWith(prefixoMes)) return soma;

    const v = parseFloat(r.consumo_m3);

    return soma + (isNaN(v) ? 0 : v);
  }, 0);

  const alvo = parseFloat(meta.alvoM3) || 0;
  const dentro = Math.min(totalMes, alvo);
  const margem = Math.max(0, alvo - totalMes);
  const acima = Math.max(0, totalMes - alvo);
  const series = [];
  const labels = [];
  const cores = [];

  if (dentro > 0)
  {
    series.push(dentro);
    labels.push("Dentro da meta");
    cores.push(CHART_COLORS()[5]);
  }

  if (margem > 0)
  {
    series.push(margem);
    labels.push("Margem restante");
    cores.push(CHART_COLORS()[2]);
  }

  if (acima > 0)
  {
    series.push(acima);
    labels.push("Acima da meta");
    cores.push(CHART_COLORS()[4]);
  }

  if (!series.length)
  {
    series.push(0);
    labels.push("Sem consumo no mês");
    cores.push(CHART_COLORS()[2]);
  }

  return { series, labels, cores, totalMes, alvo };
}

function renderizarMetaSustentabilidade(historico)
{
  const elemento = document.getElementById("chartMetaSustentabilidade");

  if (!elemento) return;

  const dados = obterDadosMetaSustentabilidade(historico);

  if (chartMetaSustentabilidade)
  {
    chartMetaSustentabilidade.destroy();
  }

  if (!dados)
  {
    chartMetaSustentabilidade = new ApexCharts(elemento, {
      series: [],
      ...opcoesBase(),
      chart: { ...opcoesBase().chart, type: "donut", height: 260 },
      noData: {
        text: "Defina sua meta mensal na aba Relatórios.",
        align: "center",
        verticalAlign: "middle",
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "13px",
          color: corTextoGrafico(),
        },
      },
    });
    chartMetaSustentabilidade.render();
    return;
  }

  const coresRotulo = TOOLTIP_TEXT_COLORS().slice(0, dados.labels.length);

  chartMetaSustentabilidade = new ApexCharts(elemento, {
    series: dados.series,
    ...opcoesBase(),
    chart: { ...opcoesBase().chart, type: "donut", height: 260 },
    labels: dados.labels,
    colors: dados.cores,
    legend: {
      position: "bottom",
      fontFamily: "Montserrat, sans-serif",
      fontSize: "13px",
      fontWeight: 600,
      offsetY: 5,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "58%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Consumo do mês",
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              color: corTextoGrafico(),
              formatter: (w) =>
                w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(1) +
                " m³",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "11px",
        colors: coresRotulo,
      },
      formatter: (val) => val.toFixed(1) + "%",
      dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.25 },
    },
    stroke: { show: true, width: 3, colors: ["rgba(255,255,255,0.6)"] },
    tooltip: {
      custom: ({ series, seriesIndex, w }) => {
        const idx = seriesIndex;
        const cor = dados.cores[idx] || "#124559";
        const corTexto = TOOLTIP_TEXT_COLORS()[idx] || "#ffffff";
        const valor = series[idx];
        const rotulo = w.globals.labels[idx] || "";
        const total = series.reduce((a, b) => a + b, 0);
        const pct = total > 0 ? ((valor / total) * 100).toFixed(1) : "0.0";

        return `<div style="
                    background: ${cor};
                    color: ${corTexto};
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-family: Montserrat, sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);">
                        ${rotulo}: <strong>${valor.toFixed(1)} m³</strong> (${pct}%)
                    </div>`;
      },
    },
  });

  chartMetaSustentabilidade.render();
}

function expandirGraficoPainel(titulo, instancia)
{
  if (!instancia || !instancia.w) return;

  const config = JSON.parse(JSON.stringify(instancia.w.config));
  instancia.destroy();

  const overlay = document.createElement("div");
  overlay.className = "chart-fullscreen-overlay";
  overlay.innerHTML = DOMPurify.sanitize(
    `
        <div class="chart-fullscreen-modal">
            <div class="chart-fullscreen-header">
                <h3>${titulo}</h3>
                <button class="chart-fullscreen-close"><i class="fas fa-xmark"></i></button>
            </div>
            <div class="chart-fullscreen-body" id="chartExpanded"></div>
        </div>
    `,
    { ADD_ATTR: ["class", "id"] },
  );
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    const elementoExpandido = document.getElementById("chartExpanded");

    if (!elementoExpandido) return;
    config.chart.height = 420;
    config.chart.width = undefined;

    if (config.chart.toolbar) config.chart.toolbar.show = false;

    const chartExpandido = new ApexCharts(elementoExpandido, config);
    chartExpandido.render();
    overlay._graficoExpandido = chartExpandido;
  }, 50);
}

function fecharGraficoExpandido()
{
  const overlay = document.querySelector(".chart-fullscreen-overlay");

  if (!overlay) return;

  if (overlay._graficoExpandido)
  {
    overlay._graficoExpandido.destroy();
  }

  overlay.remove();
  document.body.style.overflow = "";

  chartProjecaoCusto = null;
  chartMetaSustentabilidade = null;
  renderizarProjecaoCusto();
  renderizarMetaSustentabilidade(historicoCache.data);
}

function obterLeituraAnteriorSalva()
{
  const valor = parseFloat(localStorage.getItem(CHAVE_LEITURA_ANTERIOR));

  return isNaN(valor) ? null : valor;
}

function preencherLeituraAnteriorFoto(apenasSeVazio = false)
{
  const campoAnterior = document.getElementById("foto-leitura-anterior");
  const anterior = obterLeituraAnteriorSalva();

  if (!campoAnterior)
  {
    return;
  }

  if (apenasSeVazio && campoAnterior.value !== "")
  {
    return;
  }

  campoAnterior.value = anterior === null ? "" : String(anterior);
}

function alternarModo(modo)
{
  modoAtivo = modo;
  const botoesModo = document.querySelectorAll(".botao-modo");

  botoesModo.forEach((botao) => {
    botao.classList.toggle("ativo", botao.dataset.modo === modo);
  });

  const conteudoManual = document.getElementById("conteudo-manual");
  const conteudoFoto = document.getElementById("conteudo-foto");

  if (conteudoManual)
  {
    conteudoManual.classList.toggle("oculto", modo !== "manual");
    conteudoManual.querySelectorAll("input").forEach((campo) => {
      campo.disabled = modo !== "manual";
    });
  }

  if (conteudoFoto)
  {
    conteudoFoto.classList.toggle("oculto", modo !== "foto");
    conteudoFoto.querySelectorAll("input").forEach((campo) => {
      campo.disabled = modo !== "foto";
    });
  }

  if (modo === "foto")
  {
    preencherLeituraAnteriorFoto();
  }
}

function abrirModalFoto()
{
  const modal = document.getElementById("modal-foto-hidrometro");

  if (modal)
  {
    modal.style.display = "flex";
  }
}

function fecharModalFoto()
{
  const modal = document.getElementById("modal-foto-hidrometro");
  const container = document.getElementById("container-cropper-hidrometro");
  const imagem = document.getElementById("imagem-cortar-hidrometro");
  const campoUrl = document.getElementById("url-foto-hidrometro");
  const botaoLer = document.getElementById("btn-ler-recorte");

  if (modal)
  {
    modal.style.display = "none";
  }

  destruirCropperHidrometro();

  if (container)
  {
    container.style.display = "none";
  }

  if (imagem)
  {
    imagem.removeAttribute("src");
  }

  if (campoUrl)
  {
    campoUrl.value = "";
  }

  if (botaoLer)
  {
    botaoLer.style.display = "none";
  }
}

function destruirCropperHidrometro()
{
  if (cropperHidrometro)
  {
    cropperHidrometro.destroy();
    cropperHidrometro = null;
  }
}

function carregarImagemNoCropperHidrometro(origem)
{
  const container = document.getElementById("container-cropper-hidrometro");
  const imagem = document.getElementById("imagem-cortar-hidrometro");

  if (!container || !imagem)
  {
    return;
  }

  destruirCropperHidrometro();
  container.style.display = "block";
  imagem.removeAttribute("src");

  const avisarFalha = () => {
    container.style.display = "none";
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Não foi possível carregar a imagem. Verifique a URL ou envie o arquivo local.",
      confirmButtonColor: "#124559",
    });
  };

  imagem.onerror = avisarFalha;
  imagem.onload = () => {
    cropperHidrometro = new Cropper(imagem, {
      viewMode: 1,
      background: false,
      autoCropArea: 0.9,
      ready() {
        const botaoLer = document.getElementById("btn-ler-recorte");

        if (botaoLer)
        {
          botaoLer.style.display = "inline-block";
        }
      },
    });
  };

  if (urlImagemSegura(origem))
  {
    imagem.src = origem;
  }

  else
  {
    avisarFalha();
  }
}

function processarArquivoHidrometro(arquivo)
{
  if (!arquivo)
  {
    return;
  }

  if (!arquivo.type.startsWith("image/"))
  {
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "O arquivo precisa ser uma imagem!",
      confirmButtonColor: "#124559",
    });
    return;
  }

  if (arquivo.size > LIMITE_UPLOAD_BYTES)
  {
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "A imagem deve ter no máximo 5MB.",
      confirmButtonColor: "#124559",
    });
    return;
  }

  const leitor = new FileReader();
  leitor.onload = (evento) => {
    carregarImagemNoCropperHidrometro(evento.target.result);
  };
  leitor.readAsDataURL(arquivo);
}

function aumentarCanvasParaOcr(canvas)
{
  const alturaAlvo = 120;
  const escala = Math.min(4, Math.max(1, alturaAlvo / canvas.height));

  if (escala === 1)
  {
    return canvas;
  }

  const resultado = document.createElement("canvas");
  resultado.width = Math.round(canvas.width * escala);
  resultado.height = Math.round(canvas.height * escala);

  const ctx = resultado.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(canvas, 0, 0, resultado.width, resultado.height);
  return resultado;
}

function prepararVariantesOcr(canvasBase)
{
  const canvas = aumentarCanvasParaOcr(canvasBase);
  const ctx = canvas.getContext("2d");
  const dados = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const totalPixels = canvas.width * canvas.height;
  const cinzas = new Uint8Array(totalPixels);

  let minimo = 255;
  let maximo = 0;
  let soma = 0;

  for (let i = 0; i < totalPixels; i++)
  {
    const j = i * 4;
    const cinza = Math.round(0.299 * dados.data[j] + 0.587 * dados.data[j + 1] + 0.114 * dados.data[j + 2]);
    cinzas[i] = cinza;
    soma += cinza;

    if (cinza < minimo) minimo = cinza;
    if (cinza > maximo) maximo = cinza;
  }

  const media = soma / totalPixels;
  const amplitude = (maximo - minimo) || 1;
  const esticado = new Uint8Array(totalPixels);
  const histograma = new Array(256).fill(0);

  for (let i = 0; i < totalPixels; i++)
  {
    esticado[i] = Math.round(((cinzas[i] - minimo) / amplitude) * 255);
    histograma[esticado[i]]++;
  }

  let somaPonderada = 0;

  for (let t = 0; t < 256; t++)
  {
    somaPonderada += t * histograma[t];
  }

  let pesoFundo = 0;
  let somaFundo = 0;
  let melhorLimiar = 0;
  let melhorVariancia = -1;

  for (let t = 0; t < 256; t++)
  {
    pesoFundo += histograma[t];

    if (pesoFundo === 0) continue;

    const pesoTexto = totalPixels - pesoFundo;

    if (pesoTexto === 0) break;

    somaFundo += t * histograma[t];
    const mediaFundo = somaFundo / pesoFundo;
    const mediaTexto = (somaPonderada - somaFundo) / pesoTexto;
    const varianciaEntreClasses = pesoFundo * pesoTexto * (mediaFundo - mediaTexto) * (mediaFundo - mediaTexto);

    if (varianciaEntreClasses > melhorVariancia)
    {
      melhorVariancia = varianciaEntreClasses;
      melhorLimiar = t;
    }
  }

  const inverter = media < 128;
  const margem = 16;

  const desenharVariante = (converter) => {
    const saida = document.createElement("canvas");
    saida.width = canvas.width + margem * 2;
    saida.height = canvas.height + margem * 2;
    const ctxSaida = saida.getContext("2d");
    ctxSaida.fillStyle = "#fff";
    ctxSaida.fillRect(0, 0, saida.width, saida.height);

    const imgSaida = ctxSaida.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < totalPixels; i++)
    {
      const valor = inverter ? 255 - esticado[i] : esticado[i];
      const nivel = converter(valor, melhorLimiar);
      const j = i * 4;
      imgSaida.data[j] = nivel;
      imgSaida.data[j + 1] = nivel;
      imgSaida.data[j + 2] = nivel;
      imgSaida.data[j + 3] = 255;
    }

    ctxSaida.putImageData(imgSaida, margem, margem);
    return saida;
  };

  return {
    cinza: desenharVariante((valor) => valor),
    binario: desenharVariante((valor, limiar) => (valor < limiar ? 0 : 255)),
  };
}

function extrairLeitura(textoOcr, confiancaOcr)
{
  const digitos = (textoOcr || "").replace(/\D/g, "");

  if (!digitos || digitos.length > LIMITE_DIGITOS_LEITURA)
  {
    return null;
  }

  return {
    leitura: parseInt(digitos, 10),
    confianca: Math.round(confiancaOcr || 0),
    digitos: digitos.length,
  };
}

async function reconhecerDigitosHidrometro(canvasRecorte)
{
  const variantes = prepararVariantesOcr(canvasRecorte);
  const tentativas = [
    { psm: "7", fonte: variantes.binario },
    { psm: "7", fonte: variantes.cinza },
    { psm: "8", fonte: variantes.binario },
    { psm: "6", fonte: variantes.binario },
  ];

  const worker = await Tesseract.createWorker("eng");
  let melhor = null;

  try
  {
    for (const tentativa of tentativas)
    {
      await worker.setParameters({
        tessedit_char_whitelist: "0123456789",
        tessedit_pageseg_mode: tentativa.psm,
      });
      const { data } = await worker.recognize(tentativa.fonte);
      const candidata = extrairLeitura(data.text, data.confidence);

      if (!candidata)
      {
        continue;
      }

      candidata.nota = candidata.confianca + (candidata.digitos >= 3 ? 25 : 0);

      if (!melhor || candidata.nota > melhor.nota)
      {
        melhor = candidata;
      }

      if (melhor.confianca >= 90 && melhor.digitos >= 3)
      {
        break;
      }
    }
  }

  finally
  {
    await worker.terminate();
  }

  return melhor;
}

function aplicarLeituraDaFoto(recorteDataUrl, resultado)
{
  const cardPreview = document.getElementById("card-preview-foto");
  const imgPreview = document.getElementById("img-preview-hidrometro");
  const chipLeitura = document.getElementById("chip-leitura-ocr");
  const campoAtual = document.getElementById("foto-leitura-atual");

  if (imgPreview)
  {
    imgPreview.src = recorteDataUrl;
  }

  if (chipLeitura)
  {
    const confiancaBaixa = resultado.confianca < 60;
    chipLeitura.textContent = confiancaBaixa
      ? `${resultado.leitura} m³ • confira! (${resultado.confianca}%)`
      : `${resultado.leitura} m³ • confiança ${resultado.confianca}%`;
    chipLeitura.classList.toggle("confianca-baixa", confiancaBaixa);
  }

  if (cardPreview)
  {
    cardPreview.classList.remove("oculto");
  }

  if (campoAtual)
  {
    campoAtual.value = String(resultado.leitura);
  }

  preencherLeituraAnteriorFoto(true);
  fecharModalFoto();
}

async function lerRecorteHidrometro()
{
  const botaoLer = document.getElementById("btn-ler-recorte");

  if (!cropperHidrometro)
  {
    Swal.fire({
      icon: "warning",
      title: "Atenção!",
      text: "Envie uma foto antes de ler.",
      confirmButtonColor: "#124559",
    });
    return;
  }

  if (botaoLer)
  {
    botaoLer.disabled = true;
    botaoLer.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Lendo foto...';
  }

  try
  {
    let recorteDataUrl = "";
    let canvasRecorte = null;

    try
    {
      canvasRecorte = cropperHidrometro.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });
      recorteDataUrl = canvasRecorte.toDataURL("image/jpeg", 0.9);
    }

    catch (erroCanvas)
    {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Esta imagem veio de uma URL externa que bloqueia o recorte. Baixe a foto e envie o arquivo local.",
        confirmButtonColor: "#124559",
      });
      return;
    }

    const resultado = await reconhecerDigitosHidrometro(canvasRecorte);

    if (!resultado)
    {
      Swal.fire({
        icon: "warning",
        title: "Não consegui ler!",
        text: "Nenhum número foi reconhecido no recorte. Aproxime o recorte dos dígitos pretos e evite reflexos.",
        confirmButtonColor: "#124559",
      });
      return;
    }

    aplicarLeituraDaFoto(recorteDataUrl, resultado);
  }

  finally
  {
    if (botaoLer)
    {
      botaoLer.disabled = false;
      botaoLer.innerHTML = "Ler Recorte";
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const historico = await carregarHistorico();
  configurarPeriodoDashboard();
  setPeriodoDashboard();
  renderizarProjecaoCusto();
  renderizarMetaSustentabilidade(historico);

  const formMedicao = document.getElementById("formMedicao");
  const displayResultado = document.getElementById("resultadoDisplay");

  const spanConsumo = document.getElementById("resConsumo");
  const spanValorAgua = document.getElementById("resAgua");
  const spanValorEsgoto = document.getElementById("resEsgoto");
  const spanValorTotal = document.getElementById("resTotal");
  const spanInfoExtra = document.getElementById("resInfoExtra");

  document.querySelectorAll(".botao-modo").forEach((botao) => {
    botao.addEventListener("click", () => {
      alternarModo(botao.dataset.modo);
    });
  });

  const btnEnviarFoto = document.getElementById("btn-enviar-foto");
  const btnFecharFoto = document.getElementById("btn-fechar-foto");
  const btnCancelarFoto = document.getElementById("btn-cancelar-foto");
  const btnLerRecorte = document.getElementById("btn-ler-recorte");
  const dropzoneHidrometro = document.getElementById("dropzone-hidrometro");
  const inputFotoHidrometro = document.getElementById("input-foto-hidrometro");
  const campoUrlFoto = document.getElementById("url-foto-hidrometro");

  if (btnEnviarFoto)
  {
    btnEnviarFoto.addEventListener("click", abrirModalFoto);
  }

  if (btnFecharFoto)
  {
    btnFecharFoto.addEventListener("click", fecharModalFoto);
  }

  if (btnCancelarFoto)
  {
    btnCancelarFoto.addEventListener("click", fecharModalFoto);
  }

  if (btnLerRecorte)
  {
    btnLerRecorte.addEventListener("click", lerRecorteHidrometro);
  }

  if (dropzoneHidrometro && inputFotoHidrometro)
  {
    dropzoneHidrometro.addEventListener("click", () => {
      inputFotoHidrometro.click();
    });

    dropzoneHidrometro.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzoneHidrometro.style.borderColor = "var(--cor-botao)";
      dropzoneHidrometro.style.background = "rgba(89, 131, 146, 0.1)";
    });

    dropzoneHidrometro.addEventListener("dragleave", () => {
      dropzoneHidrometro.style.borderColor = "";
      dropzoneHidrometro.style.background = "";
    });

    dropzoneHidrometro.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzoneHidrometro.style.borderColor = "";
      dropzoneHidrometro.style.background = "";
      const arquivo = e.dataTransfer.files[0];

      if (arquivo)
      {
        processarArquivoHidrometro(arquivo);
      }
    });

    inputFotoHidrometro.addEventListener("change", (e) => {
      const arquivo = e.target.files[0];

      if (arquivo)
      {
        processarArquivoHidrometro(arquivo);
      }

      e.target.value = "";
    });
  }

  document.addEventListener("paste", (evento) => {
    const modal = document.getElementById("modal-foto-hidrometro");

    if (!modal || modal.style.display === "none")
    {
      return;
    }

    const itens = evento.clipboardData ? evento.clipboardData.items : [];

    for (const item of itens)
    {
      if (item.type.startsWith("image/"))
      {
        const arquivo = item.getAsFile();

        if (arquivo)
        {
          evento.preventDefault();
          processarArquivoHidrometro(arquivo);
        }

        return;
      }
    }
  });

  if (campoUrlFoto)
  {
    campoUrlFoto.addEventListener("change", (e) => {
      if (e.target.value)
      {
        carregarImagemNoCropperHidrometro(e.target.value.trim());
      }
    });
  }

  document.querySelectorAll(".chart-expand").forEach((botao) => {
    botao.addEventListener("click", (e) => {
      e.stopPropagation();
      const chartId = botao.dataset.chart;
      const card = botao.closest(".chart-card");
      const titulo = card.querySelector("h3").textContent;
      const mapaCharts = {
        chartProjecaoCusto,
        chartMetaSustentabilidade,
      };

      expandirGraficoPainel(titulo, mapaCharts[chartId]);
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".chart-fullscreen-close, .chart-fullscreen-overlay"))
    {
      fecharGraficoExpandido();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.querySelector(".chart-fullscreen-overlay"))
    {
      fecharGraficoExpandido();
    }
  });

  const selectTarifaPainel = document.getElementById("categoriaTarifa");

  if (selectTarifaPainel)
  {
    selectTarifaPainel.addEventListener("change", renderizarProjecaoCusto);
  }

  document.addEventListener("victoria:tema", () => {
    renderizarProjecaoCusto();
    renderizarMetaSustentabilidade(historicoCache.data);
  });

  window.addEventListener("historico-atualizado", async () => {
    const historicoAtualizado = await carregarHistorico(true);
    setPeriodoDashboard();
    renderizarMetaSustentabilidade(historicoAtualizado);
  });

  alternarModo(modoAtivo);

  if (formMedicao)
  {
    formMedicao.addEventListener("submit", async function (e) {
      e.preventDefault();

      const categoria = document.getElementById("categoriaTarifa").value;
      const idAnterior = modoAtivo === "foto" ? "foto-leitura-anterior" : "leituraAnterior";
      const idAtual = modoAtivo === "foto" ? "foto-leitura-atual" : "leituraAtual";
      const leituraAnterior = parseFloat(
        document.getElementById(idAnterior).value,
      );
      const leituraAtual = parseFloat(
        document.getElementById(idAtual).value,
      );

      if (isNaN(leituraAnterior) || isNaN(leituraAtual))
      {
        Swal.fire({
          icon: "warning",
          title: "Atenção!",
          text: "Por favor, insira valores numéricos válidos para as leituras.",
          confirmButtonColor: "#124559",
        });
        return;
      }

      if (leituraAnterior > leituraAtual)
      {
        Swal.fire({
          icon: "error",
          title: "Erro de Digitação",
          text: "A leitura inicial não pode ser maior que a leitura atual.",
          confirmButtonColor: "#e74c3c",
        });
        return;
      }

      if (!categoria)
      {
        Swal.fire({
          icon: "warning",
          title: "Atenção!",
          text: "Selecione uma categoria de tarifa.",
          confirmButtonColor: "#124559",
        });
        return;
      }

      const consumoM3 = leituraAtual - leituraAnterior;

      const resultado = calcularTarifaLocal(categoria, consumoM3);

      const { valor_agua, valor_esgoto, valor_total, mensagem, status_consumo } = resultado;
      const hojeISO = new Date().toISOString().split("T")[0];

      fetch(`${API_BASE}/gastos/criar.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          data_leitura: hojeISO,
          consumo_m3: consumoM3,
          valor_estimado: valor_total,
          status_consumo: status_consumo,
        }),
      })
        .then((res) => res.json())
        .then((result) => {

          if (!result.success)
          {
            Swal.fire({
              icon: "error",
              title: "Erro!",
              text: result.message,
              confirmButtonColor: "#124559",
            });
            return;
          }

          if (modoAtivo === "foto")
          {
            localStorage.setItem(CHAVE_LEITURA_ANTERIOR, String(leituraAtual));
          }

          const fmt = (v) =>
            v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

          if (spanConsumo) spanConsumo.innerText = `${consumoM3.toFixed(2)} m³`;

          if (spanValorAgua) spanValorAgua.innerText = fmt(valor_agua);

          if (spanValorEsgoto) spanValorEsgoto.innerText = fmt(valor_esgoto);

          if (spanValorTotal) spanValorTotal.innerText = fmt(valor_total);

          if (spanInfoExtra)
          {
            spanInfoExtra.innerText = mensagem || "";
            spanInfoExtra.style.display = mensagem ? "block" : "none";
          }

          if (displayResultado)
          {
            displayResultado.style.display = "block";
            displayResultado.classList.remove("anima-slide");
            void displayResultado.offsetWidth;
            displayResultado.classList.add("anima-slide");
          }

          carregarHistorico(true).then((h) => {
            setPeriodoDashboard();
            renderizarMetaSustentabilidade(h);
            window.dispatchEvent(new CustomEvent("historico-atualizado"));
          });
          notificarInvalidacaoCache();

          Swal.fire({
            icon: "success",
            title: "Cálculo Realizado!",
            text: "Os valores foram atualizados no seu painel.",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Erro de conexão!",
            text: "Não foi possível salvar o registro.",
            confirmButtonColor: "#124559",
          });
        });
    });
  }

});
