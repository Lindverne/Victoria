import { Auth } from "../auth.js";

const API_BASE = window.location.pathname.includes("/pages/")
  ? "../../api"
  : "../api";
let historicoCache = [];
let dadosAtuais = [];
let periodoAtual = "mes";
const temaEscuro = () => document.documentElement.dataset.theme === "dark";
const corTextoGrafico = () => (temaEscuro() ? "#86b3bd" : "#124559");
const corTextoSuave = () => (temaEscuro() ? "#7fa3ab" : "#598392");
const corGridGrafico = () => (temaEscuro() ? "rgba(134, 179, 189, 0.12)" : "rgba(18, 69, 89, 0.08)");
const corSerie2 = () => (temaEscuro() ? "#6aacc4" : "#3d7a9a");
const CHART_COLORS = () =>
  temaEscuro()
    ? ["#4a7f8f", "#5d8068", "#75688a", "#8a6d3f", "#8a5555", "#55756a", "#6d5d7f", "#446f82"]
    : ["#124559", "#598392", "#aec3b0", "#e8a838", "#c44545", "#4a7c59", "#8e6b8a", "#2a5c72"];
const CHART_COLORS_MULTIPLOS = () =>
  temaEscuro()
    ? ["#5d7f8f", "#6d8a70", "#7f708a", "#8a7549", "#8a6060", "#5d7568", "#75608d", "#4a7f9e"]
    : ["#1a3a4a", "#2d6b7a", "#7a9e8a", "#b88a28", "#a03535", "#3a5c49", "#6e4b6a", "#1a3c52"];
const TOOLTIP_TEXT_COLORS = () =>
  temaEscuro()
    ? ["#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23", "#0d1a23"]
    : ["#ffffff", "#ffffff", "#1a2a3a", "#1a2a3a", "#ffffff", "#ffffff", "#ffffff", "#ffffff"];
const coresRotulosDados = (n) =>
  temaEscuro() ? Array.from({ length: n }, () => corTextoGrafico()) : TOOLTIP_TEXT_COLORS().slice(0, n);
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES_NOME = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

let chartDonut = null;
let chartColunas = null;
let chartLinha = null;
let chartArea = null;
let chartGauge = null;
let chartPrevisao = null;

async function carregarHistorico()
{
  try
  {
    const res = await fetch(`${API_BASE}/gastos/listar.php`, {
      credentials: "include",
    });
    const json = await res.json();

    if (json.success && Array.isArray(json.gastos))
    {
      historicoCache = json.gastos;
      return json.gastos;
    }

  }

  catch (e)
  {
  }

  return [];
}

function parseDateBR(dataStr)
{
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  return new Date(ano, mes - 1, dia);
}

function formatarDataCurta(dataStr)
{
  return DIAS_SEMANA[parseDateBR(dataStr).getDay()];
}

function processarUltimosDias(historico, quantidade)
{
  const recentes = historico.slice(0, Math.min(quantidade, historico.length));
  return {
    rotulos: recentes.map((r) => formatarDataCurta(r.data)),
    valores: recentes.map((r) => {
      const v = parseFloat(r.consumo_m3 ?? r.consumo);
      return isNaN(v) ? 0 : v;
    }),
  };

}

function processarMeses(historico)
{
  const porMes = {};
  historico.forEach((r) => {
    const dataRaw = r.data_leitura || r.data || "";
    let partes;

    if (dataRaw.includes("-"))
    {
      partes = dataRaw.split("-");
      const anoM = partes[0],
        mesM = partes[1];

      if (!anoM || !mesM) return;
      const chave = mesM + "/" + anoM;
      const v = parseFloat(r.consumo_m3 ?? r.consumo);

      if (isNaN(v)) return;

      if (!porMes[chave]) porMes[chave] = 0;
      porMes[chave] += v;
    }
    else
    {
      partes = dataRaw.split("/");

      if (partes.length !== 3) return;
      const chave = partes[1] + "/" + partes[2];
      const v = parseFloat(r.consumo_m3 ?? r.consumo);

      if (isNaN(v)) return;

      if (!porMes[chave]) porMes[chave] = 0;
      porMes[chave] += v;
    }

  });
  const chaves = Object.keys(porMes).sort((a, b) => {
    const [mA, aA] = a.split("/");
    const [mB, aB] = b.split("/");
    return aA !== aB
      ? parseInt(aA) - parseInt(aB)
      : parseInt(mA) - parseInt(mB);
  });
  return {
    rotulos: chaves.map((k) => {
      const [m, a] = k.split("/");
      return MESES_NOME[parseInt(m) - 1] + " " + a;
    }),
    valores: chaves.map((k) => parseFloat(porMes[k].toFixed(2))),
  };

}

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

document.addEventListener("DOMContentLoaded", async () => {
  await carregarHistorico();
  configurarPeriodo();
  setPeriodo(periodoAtual);

  window.addEventListener("historico-atualizado", async () => {
    await carregarHistorico();
    setPeriodo(periodoAtual);
  });

  document.addEventListener("victoria:tema", () => {
    setPeriodo(periodoAtual);
  });
});

function initCharts()
{
  const h = dadosAtuais;

  if (chartDonut)
  {
    chartDonut.destroy();
    chartDonut = null;
  }

  if (chartColunas)
  {
    chartColunas.destroy();
    chartColunas = null;
  }

  if (chartLinha)
  {
    chartLinha.destroy();
    chartLinha = null;
  }

  if (chartArea)
  {
    chartArea.destroy();
    chartArea = null;
  }

  if (chartGauge)
  {
    chartGauge.destroy();
    chartGauge = null;
  }

  if (chartPrevisao)
  {
    chartPrevisao.destroy();
    chartPrevisao = null;
  }

  try
  {
    criarDonut(h);
  }

  catch (e)
  {
  }

  try
  {
    criarColunas(h);
  }

  catch (e)
  {
  }

  try
  {
    criarLinha(h);
  }

  catch (e)
  {
  }

  try
  {
    criarArea(h);
  }

  catch (e)
  {
  }

  try
  {
    criarPrevisao(h);
  }

  catch (e)
  {
  }

  try
  {
    criarGauge(h);
  }

  catch (e)
  {
  }

  try
  {
    atualizarMiniStats(h);
  }

  catch (e)
  {
  }

  try
  {
    atualizarResumoExecutivo(h);
  }

  catch (e)
  {
  }

  try
  {
    atualizarMetaCard(h);
  }

  catch (e)
  {
  }

}

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

function setPeriodo(periodo)
{
  periodoAtual = periodo;

  if (periodo === "personalizado") return;
  dadosAtuais = filtrarPorPeriodo(historicoCache, periodo);
  initCharts();
}

function configurarPeriodo()
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
      setPeriodo(periodo);
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

    dadosAtuais = historicoCache.filter(
      (r) => r.data_leitura >= start && r.data_leitura <= end,
    );
    initCharts();
  });

  configurarMetas();
  configurarExpand();
  configurarExportPDF();
  document.addEventListener("click", (e) => {
    const close = e.target.closest(
      ".chart-fullscreen-close, .chart-fullscreen-overlay",
    );

    if (close) fecharExpand();
  });
}

function configurarMetas()
{
  document
    .getElementById("goalsDefineBtn")
    ?.addEventListener("click", abrirModalMeta);

  document.addEventListener("click", (e) => {

    if (e.target.id === "goalsEmptyBtn") abrirModalMeta();
  });
}

function configurarExpand()
{
  document.querySelectorAll(".chart-expand").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const chartId = btn.dataset.chart;
      const card = btn.closest(".chart-card");
      const title = card.querySelector("h3").textContent;

      const chartMap = {
        chartDonut,
        chartColunas,
        chartLinha,
        chartArea,
        chartPrevisao,
        chartGauge,
      };

      const chart = chartMap[chartId];

      if (!chart || !chart.w) return;

      const config = JSON.parse(JSON.stringify(chart.w.config));
      chart.destroy();
      chartMap[chartId] = null;

      const overlay = document.createElement("div");
      overlay.className = "chart-fullscreen-overlay";
      overlay.innerHTML = DOMPurify.sanitize(
        `
                <div class="chart-fullscreen-modal">
                    <div class="chart-fullscreen-header">
                        <h3>${title}</h3>
                        <button class="chart-fullscreen-close"><i class="fas fa-xmark"></i></button>
                    </div>
                    <div class="chart-fullscreen-body" id="chartExpanded"></div>
                </div>
            `,
        { ADD_ATTR: ["class", "id"] },
      );
      overlay.dataset.chartId = chartId;
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const expandedEl = document.getElementById("chartExpanded");

        if (!expandedEl) return;
        config.chart.height = 420;
        config.chart.width = undefined;

        if (config.chart.toolbar) config.chart.toolbar.show = false;
        const expandedChart = new ApexCharts(expandedEl, config);
        expandedChart.render();
        overlay._expandedChart = expandedChart;
      }, 50);
    });
  });
}

function fecharExpand()
{
  const overlay = document.querySelector(".chart-fullscreen-overlay");

  if (!overlay) return;

  if (overlay._expandedChart)
  {
    overlay._expandedChart.destroy();
  }

  overlay.remove();
  document.body.style.overflow = "";

  initCharts();
}

function processarUltimosDiasAgrupados(historico, quantidade)
{
  const grupos = {};
  const contagens = {};
  const recentes = historico.slice(0, Math.min(quantidade, historico.length));

  recentes.forEach((r) => {
    const data = r.data_leitura || r.data;

    if (!data) return;
    const v = parseFloat(r.consumo_m3 ?? r.consumo);

    if (isNaN(v)) return;

    if (!grupos[data])
    {
      grupos[data] = 0;
      contagens[data] = 0;
    }

    grupos[data] += v;
    contagens[data]++;
  });

  const chaves = Object.keys(grupos).sort();
  return {
    rotulos: chaves.map((k) => {
      const d = new Date(k + "T12:00:00");
      return DIAS_SEMANA[d.getDay()] + " " + d.getDate();
    }),
    valores: chaves.map((k) => parseFloat(grupos[k].toFixed(2))),
    multiplos: chaves.map((k) => contagens[k] > 1),
    totalDias: chaves.length,
  };

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

  if (historicoCache.length >= 2)
  {
    const totalTodos = historicoCache.reduce(
      (s, r) => s + (parseFloat(r.consumo_m3) || 0),
      0,
    );
    const media = totalTodos / historicoCache.length;
    const ultimo = parseFloat(historicoCache[0].consumo_m3) || 0;
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

function getMetaKey()
{
  const user = Auth.getCurrentUser();
  return "victoria_meta_" + (user?.id || "anon");
}

function carregarMeta()
{
  try
  {
    const raw = localStorage.getItem(getMetaKey());
    return raw ? JSON.parse(raw) : null;
  }
  catch
  {
    return null;
  }

}

function salvarMeta(alvoM3, mes, ano)
{
  const meta = { alvoM3: parseFloat(alvoM3), mes, ano };
  try
  {
    localStorage.setItem(getMetaKey(), JSON.stringify(meta));
  } catch {}
  atualizarMetaCard(dadosAtuais);
}

function atualizarMetaCard(dados)
{
  const el = document.getElementById("goalsCard");

  if (!el) return;

  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();
  const meta = carregarMeta();

  if (!meta || meta.mes !== mesAtual || meta.ano !== anoAtual)
  {
    el.innerHTML = `
            <div class="goals-empty">
                <i class="fas fa-flag"></i>
                <p>Nenhuma meta definida para ${MESES_NOME[mesAtual - 1]} de ${anoAtual}.</p>
                <button class="goals-empty-btn" id="goalsEmptyBtn">Definir minha meta</button>
            </div>`;
    document
      .getElementById("goalsEmptyBtn")
      ?.addEventListener("click", abrirModalMeta);
    return;
  }

  const prefixoMes = anoAtual + "-" + String(mesAtual).padStart(2, "0");
  const desteMes = historicoCache.filter(
    (r) => r.data_leitura && r.data_leitura.startsWith(prefixoMes),
  );
  const totalMes = desteMes.reduce(
    (s, r) => s + (parseFloat(r.consumo_m3) || 0),
    0,
  );
  const pct =
    meta.alvoM3 > 0 ? Math.min(100, (totalMes / meta.alvoM3) * 100) : 0;
  const restante = Math.max(0, meta.alvoM3 - totalMes);

  const diasComDados = new Set(desteMes.map((r) => r.data_leitura)).size;
  const ultimoDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    0,
  ).getDate();
  const mediaDiaria = diasComDados > 0 ? totalMes / diasComDados : 0;
  const diasRestantes = ultimoDia - hoje.getDate();
  const projecaoFinal =
    totalMes + (diasRestantes > 0 ? mediaDiaria * diasRestantes : 0);
  const vaiUltrapassar = projecaoFinal > meta.alvoM3;

  let corBarra, corClasse;

  if (pct >= 90)
  {
    corBarra = "#e74c3c";
    corClasse = "negative";
  }

  else if (pct >= 70)
  {
    corBarra = "#e8a838";
    corClasse = "warning";
  }
  else
  {
    corBarra = "#27ae60";
    corClasse = "positive";
  }

  el.innerHTML = `
        <div class="goals-active">
            <div class="goals-stats">
                <div class="goals-stat-item">
                    <span class="goals-stat-label">Meta</span>
                    <div class="goals-stat-value">${meta.alvoM3.toFixed(1)} <small>m³</small></div>
                </div>
                <div class="goals-stat-item">
                    <span class="goals-stat-label">Consumido</span>
                    <div class="goals-stat-value">${totalMes.toFixed(1)} <small>m³</small></div>
                </div>
                <div class="goals-stat-item">
                    <span class="goals-stat-label">Restante</span>
                    <div class="goals-stat-value">${restante.toFixed(1)} <small>m³</small></div>
                </div>
                <div class="goals-stat-item">
                    <span class="goals-stat-label">Projeção</span>
                    <div class="goals-stat-value" style="color:${vaiUltrapassar ? "#e74c3c" : "#27ae60"}">${projecaoFinal.toFixed(1)} <small>m³</small></div>
                </div>
            </div>
            <div class="goals-progress-container">
                <div class="goals-progress-header">
                    <span>${pct.toFixed(0)}% utilizado</span>
                    <span>${(100 - Math.min(100, pct)).toFixed(0)}% restante</span>
                </div>
                <div class="goals-progress-bar">
                    <div class="goals-progress-fill" style="width:${Math.min(100, pct)}%;background:${corBarra};"></div>
                </div>
            </div>
            <div class="goals-prediction">
                ${
                  vaiUltrapassar
                    ? `<span class="negative">⚠️ Projeção indica que você ultrapassará a meta em <strong>${(projecaoFinal - meta.alvoM3).toFixed(1)} m³</strong>.</span>`
                    : `<span class="positive">✅ Projeção indica que você ficará dentro da meta com <strong>${restante.toFixed(1)} m³</strong> de folga.</span>`
                }

            </div>
        </div>`;
}

function abrirModalMeta()
{
  const hoje = new Date();
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();
  const meta = carregarMeta();
  const valorInicial =
    meta && meta.mes === mes && meta.ano === ano ? meta.alvoM3 : "";

  Swal.fire({
    title: `Definir Meta — ${MESES_NOME[mes - 1]} ${ano}`,
    html: `
            <div style="text-align:left;margin-bottom:12px;font-family:'Montserrat',sans-serif;font-size:0.85rem;color:#598392;">
                Qual o consumo máximo que você deseja atingir este mês?
            </div>
            <input id="swalMetaInput" class="swal2-input" type="number" step="0.1" min="1"
                   placeholder="Ex: 30" value="${valorInicial}" style="font-family:'Montserrat',sans-serif;font-weight:700;">
            <div style="text-align:center;margin-top:6px;font-size:0.78rem;color:#aec3b0;font-weight:600;">em metros cúbicos (m³)</div>
        `,
    confirmButtonText: "Salvar Meta",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const val = document.getElementById("swalMetaInput")?.value;

      if (!val || parseFloat(val) <= 0)
      {
        Swal.showValidationMessage("Digite um valor válido maior que zero.");
        return false;
      }

      return parseFloat(val);
    },
  }).then((result) => {

    if (result.isConfirmed && result.value)
    {
      salvarMeta(result.value, mes, ano);
      Swal.fire({
        icon: "success",
        title: "Meta definida!",
        text: `Consumo máximo de ${result.value.toFixed(1)} m³ para ${MESES_NOME[mes - 1]}.`,
      });
    }

  });
}

function criarDonut(historico)
{
  const dados = processarUltimosDias(historico, 7);

  if (dados.rotulos.length === 0)
  {
    dados.rotulos = ["Sem dados"];
    dados.valores = [1];
  }

  const el = document.querySelector("#chartDonut");

  if (!el) return;

  chartDonut = new ApexCharts(el, {
    series: dados.valores,
    ...opcoesBase(),
    chart: { ...opcoesBase().chart, type: "donut", height: 260 },
    labels: dados.rotulos,
    colors: CHART_COLORS().slice(0, dados.rotulos.length),
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
              label: "Total",
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
        colors: TOOLTIP_TEXT_COLORS().slice(0, dados.rotulos.length),
      },
      formatter: (val, { seriesIndex }) => val.toFixed(1) + "%",
      dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.25 },
    },
    stroke: { show: true, width: 3, colors: ["rgba(255,255,255,0.6)"] },
    tooltip: {
      custom: ({ series, seriesIndex, w }) => {
        const idx = seriesIndex;
        const cor = CHART_COLORS()[idx] || "#124559";
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
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    font-size: 13px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    line-height: 1.5;
                ">
                    <div style="font-weight:700;font-size:14px;margin-bottom:2px;">${rotulo}</div>
                    <div style="font-size:18px;font-weight:900;">${valor.toFixed(2)} m³</div>
                    <div style="opacity:0.8;font-size:11px;margin-top:2px;">${pct}% do total</div>
                </div>`;
      },
    },
    states: { hover: { filter: { type: "darken", value: 0.85 } } },
  });
  chartDonut.render();
}

function criarColunas(historico)
{
  const dados = processarUltimosDiasAgrupados(historico, 14);

  if (dados.rotulos.length === 0)
  {
    dados.rotulos = ["Sem registros"];
    dados.valores = [0];
    dados.multiplos = [false];
  }

  const numBarras = dados.rotulos.length;

  const cores = dados.rotulos.map((_, i) =>
    dados.multiplos[i]
      ? CHART_COLORS_MULTIPLOS()[i % CHART_COLORS_MULTIPLOS().length] || "#1a3a4a"
      : CHART_COLORS()[i % CHART_COLORS().length] || "#124559",
  );

  const el = document.querySelector("#chartColunas");

  if (!el) return;

  chartColunas = new ApexCharts(el, {
    series: [{ name: "Consumo (m³)", data: dados.valores }],
    ...opcoesBase(),
    chart: {
      ...opcoesBase().chart,
      type: "bar",
      height: 260,
      animations: {
        ...opcoesBase().chart.animations,
        animateGradually: { enabled: true, delay: 80 },
      },
    },
    colors: cores,
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "55%",
        distributed: true,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(1),
      offsetY: -20,
      style: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700,
        fontSize: "11px",
        colors: coresRotulosDados(numBarras),
      },
    },
    xaxis: {
      categories: dados.rotulos,
      labels: {
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          colors: [corTextoGrafico()],
        },
      },
    },
    yaxis: {
      title: {
        text: "m³",
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          color: corTextoSuave(),
        },
      },
      labels: {
        formatter: (val) => val.toFixed(1),
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          colors: [corTextoSuave()],
        },
      },
    },
    grid: { borderColor: corGridGrafico(), strokeDashArray: 5 },
    tooltip: {
      custom: ({ series, dataPointIndex, w }) => {
        const idx = dataPointIndex;
        const cor = cores[idx] || "#124559";
        const corTexto = "#ffffff";
        const valor = series[0][dataPointIndex];
        const rotulo = w.globals.labels[idx] || "";
        const multiplo = dados.multiplos[idx];
        return `<div style="
                    background: ${cor};
                    color: ${corTexto};
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    font-size: 13px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    line-height: 1.5;
                ">
                    <div style="font-weight:700;font-size:12px;opacity:0.8;margin-bottom:3px;">${rotulo}</div>
                    <div style="font-size:16px;font-weight:900;">${valor.toFixed(2)} m³</div>
                    ${multiplo ? '<div style="font-size:10px;opacity:0.7;margin-top:2px;">⬡ Múltiplas leituras</div>' : ""}
                </div>`;
      },
    },
  });
  chartColunas.render();
}

function criarLinha(historico)
{
  const dados = processarMeses(historico);

  if (dados.rotulos.length === 0)
  {
    dados.rotulos = ["Sem dados"];
    dados.valores = [0];
  }

  const media = dados.valores.reduce((a, b) => a + b, 0) / dados.valores.length;
  const limiteAnomalia = media * 1.5;

  const markerColors = dados.valores.map((v) =>
    v > limiteAnomalia ? "#e74c3c" : corTextoGrafico(),
  );
  const markerSizes = dados.valores.map((v) => (v > limiteAnomalia ? 10 : 6));

  const el = document.querySelector("#chartLinha");

  if (!el) return;

  chartLinha = new ApexCharts(el, {
    series: [{ name: "Consumo (m³)", data: dados.valores }],
    ...opcoesBase(),
    chart: {
      ...opcoesBase().chart,
      type: "line",
      height: 260,
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 8,
        color: corTextoGrafico(),
        opacity: 0.3,
      },
      animations: {
        ...opcoesBase().chart.animations,
        animateGradually: { enabled: true, delay: 100 },
      },
    },
    colors: [corTextoGrafico()],
    stroke: { curve: "smooth", width: 4, lineCap: "round" },
    markers: {
      size: markerSizes,
      colors: markerColors,
      strokeColors: "#fff",
      strokeWidth: 3,
      hover: { size: 10, strokeWidth: 4 },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 40, 100],
        gradientToColors: undefined,
        inverseColors: false,
      },
    },
    xaxis: {
      categories: dados.rotulos,
      labels: {
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          colors: [corTextoGrafico()],
        },
      },
    },
    yaxis: {
      title: {
        text: "m³",
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          color: corTextoGrafico(),
        },
      },
      labels: {
        formatter: (val) => val.toFixed(1),
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          colors: [corTextoSuave()],
        },
      },
    },
    grid: { borderColor: corGridGrafico(), strokeDashArray: 5 },
    tooltip: {
      custom: ({ series, dataPointIndex }) => {
        const valor = series[0][dataPointIndex];
        return `<div style="
                    background: #124559;
                    color: #ffffff;
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    font-size: 13px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    line-height: 1.5;
                ">
                    <div style="font-size:16px;font-weight:900;">${valor.toFixed(2)} m³</div>
                </div>`;
      },
    },
    annotations: {
      yaxis: [
        {
          y: limiteAnomalia,
          borderColor: "#e74c3c",
          strokeDashArray: 5,
          label: {
            text: "Limite de anomalia",
            style: {
              color: "#fff",
              background: "#e74c3c",
              fontSize: "11px",
              fontWeight: 600,
            },
          },
        },
      ],
    },
  });
  chartLinha.render();
}

function criarArea(historico)
{
  const dados = processarMeses(historico);

  if (dados.rotulos.length === 0)
  {
    dados.rotulos = ["Sem dados"];
    dados.valores = [0];
  }

  const acumulado = [];
  let soma = 0;
  dados.valores.forEach((v) => {
    soma += v;
    acumulado.push(parseFloat(soma.toFixed(2)));
  });

  const el = document.querySelector("#chartArea");

  if (!el) return;

  chartArea = new ApexCharts(el, {
    series: [
      { name: "Consumo (m³)", data: dados.valores },
      { name: "Acumulado (m³)", data: acumulado },
    ],
    ...opcoesBase(),
    chart: {
      ...opcoesBase().chart,
      type: "area",
      height: 260,
      stacked: false,
      animations: {
        ...opcoesBase().chart.animations,
        animateGradually: { enabled: true, delay: 90 },
      },
    },
    colors: [corTextoSuave(), corSerie2()],
    stroke: {
      curve: "smooth",
      width: [2.5, 3],
      dashArray: [0, 5],
      lineCap: "round",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.55,
        opacityTo: 0.02,
        stops: [0, 60, 100],
        gradientToColors: ["#7ab0b4", "#6aacc4"],
        inverseColors: false,
      },
    },
    markers: {
      size: 5,
      colors: [corTextoSuave(), corSerie2()],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 8 },
    },
    xaxis: {
      categories: dados.rotulos,
      labels: {
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          colors: ["#6aacc4"],
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Consumo (m³)",
          style: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: corTextoSuave(),
          },
        },
        labels: {
          formatter: (val) => val.toFixed(1),
          style: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            colors: [corTextoSuave()],
          },
        },
        opposite: false,
      },
      {
        title: {
          text: "Acumulado (m³)",
          style: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: corSerie2(),
          },
        },
        labels: {
          formatter: (val) => val.toFixed(1),
          style: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            colors: [corSerie2()],
          },
        },
        opposite: true,
      },
    ],
    grid: { borderColor: corGridGrafico(), strokeDashArray: 5 },
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({ series, dataPointIndex }) => {
        const consumo = series[0][dataPointIndex];
        const acumulado = series[1][dataPointIndex];
        return `<div style="
                    background: #124559;
                    color: #ffffff;
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    font-size: 13px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    line-height: 1.5;
                ">
                    <div style="font-size:11px;opacity:0.8;margin-bottom:2px;">Consumo</div>
                    <div style="font-size:16px;font-weight:900;">${consumo.toFixed(2)} m³</div>
                    <div style="border-top:1px solid rgba(255,255,255,0.12);margin:5px 0;padding-top:4px;font-size:11px;opacity:0.8;">Acumulado</div>
                    <div style="font-size:16px;font-weight:900;">${acumulado.toFixed(2)} m³</div>
                </div>`;
      },
    },
    legend: {
      position: "bottom",
      fontFamily: "Montserrat, sans-serif",
      fontSize: "12px",
      fontWeight: 600,
      offsetY: 5,
    },
  });
  chartArea.render();
}

function criarPrevisao(historico)
{
  const el = document.querySelector("#chartPrevisao");

  if (!el) return;

  const hoje = new Date();
  const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0");
  const anoAtual = String(hoje.getFullYear());
  const prefixoMes = anoAtual + "-" + mesAtual;
  const ultimoDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    0,
  ).getDate();

  const desteMes = historico.filter(
    (r) => r.data_leitura && r.data_leitura.startsWith(prefixoMes),
  );
  const consumoReal = desteMes.map((r) => ({
    data: r.data_leitura,
    valor: parseFloat(r.consumo_m3) || 0,
  }));

  if (!consumoReal.length)
  {
    el.innerHTML =
      '<div style="text-align:center;padding:80px 20px;color:#598392;font-weight:600;font-size:13px;">Sem dados no mês atual para projeção</div>';
    return;
  }

  const totalReal = consumoReal.reduce((s, r) => s + r.valor, 0);
  const diasComDados = new Set(consumoReal.map((r) => r.data)).size;
  const mediaDiaria = totalReal / Math.max(1, diasComDados);

  const diasRestantes = ultimoDia - hoje.getDate();
  const projecaoRestante = diasRestantes > 0 ? mediaDiaria * diasRestantes : 0;
  const totalProjetado = totalReal + projecaoRestante;
  const custoProjetado = totalProjetado * 10.5;

  const categorias = [];
  const realCompleto = [];
  const projetadoCompleto = [];

  for (let d = 1; d <= ultimoDia; d++)
  {
    const diaStr = String(d).padStart(2, "0");
    const dataStr = `${anoAtual}-${mesAtual}-${diaStr}`;
    categorias.push(d);

    const registro = consumoReal.find((r) => r.data === dataStr);

    if (registro)
    {
      realCompleto.push(registro.valor);
      projetadoCompleto.push(null);
    }

    else if (d <= hoje.getDate())
    {
      realCompleto.push(0);
      projetadoCompleto.push(null);
    }
    else
    {
      realCompleto.push(null);
      projetadoCompleto.push(parseFloat(mediaDiaria.toFixed(2)));
    }

  }

  chartPrevisao = new ApexCharts(el, {
    series: [
      { name: "Consumo Real", data: realCompleto },
      { name: "Projeção", data: projetadoCompleto, type: "bar" },
    ],
    chart: {
      ...opcoesBase().chart,
      type: "bar",
      height: 260,
      animations: {
        ...opcoesBase().chart.animations,
        animateGradually: { enabled: true, delay: 60 },
      },
    },
    colors: [corTextoGrafico(), "#e8a838"],
    stroke: { width: [2, 1], curve: "smooth", dashArray: [0, 4] },
    fill: {
      type: ["solid", "gradient"],
      opacity: [0.85, 0.4],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.15,
        stops: [0, 60, 100],
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categorias,
      labels: {
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          colors: [corTextoSuave()],
        },
      },
    },
    yaxis: {
      title: {
        text: "m³",
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          color: corTextoSuave(),
        },
      },
      labels: {
        formatter: (val) => val.toFixed(1),
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          colors: [corTextoSuave()],
        },
      },
    },
    grid: { borderColor: corGridGrafico(), strokeDashArray: 5 },
    annotations: {
      yaxis: [
        {
          y: mediaDiaria,
          borderColor: "#e8a838",
          strokeDashArray: 5,
          label: {
            text: "Média diária",
            style: {
              color: "#fff",
              background: "#e8a838",
              fontSize: "10px",
              fontWeight: 600,
            },
          },
        },
      ],
      position: "back",
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({ series, dataPointIndex, w }) => {
        const dia = w.globals.labels[dataPointIndex] || "";
        const real = series[0][dataPointIndex];
        const proj = series[1][dataPointIndex];
        const isProj = proj !== null;
        const valor = isProj ? proj : real || 0;
        const label = isProj ? "Projeção" : "Consumo Real";
        const cor = isProj ? "#e8a838" : corTextoGrafico();
        return `<div style="background:#124559;color:#fff;padding:8px 14px;border-radius:10px;font-family:'Montserrat',sans-serif;font-weight:600;font-size:13px;box-shadow:0 4px 16px rgba(0,0,0,0.18);">
                    <div style="font-size:11px;opacity:0.8;margin-bottom:2px;">Dia ${dia}</div>
                    <div style="font-size:14px;font-weight:900;color:${isProj ? "#f0c050" : "#7ab0b4"};">${label}: ${valor.toFixed(2)} m³</div>
                </div>`;
      },
    },
    legend: {
      position: "bottom",
      fontFamily: "Montserrat, sans-serif",
      fontSize: "12px",
      fontWeight: 600,
      offsetY: 5,
    },
  });
  chartPrevisao.render();
}

function criarGauge(historico)
{
  const el = document.querySelector("#chartGauge");

  if (!el) return;

  let meta = 0;

  if (historico.length >= 2)
  {
    const total = historico.reduce(
      (s, r) => s + (parseFloat(r.consumo_m3) || 0),
      0,
    );
    const media = total / historico.length;
    const ultimo = parseFloat(historico[0].consumo_m3) || 0;
    meta =
      media > 0
        ? Math.min(100, Math.round((1 - (ultimo - media) / media) * 100))
        : 0;
  }

  const corMeta = meta >= 80 ? "#27ae60" : meta >= 50 ? "#e8a838" : "#e74c3c";

  const metaLabel =
    meta >= 80 ? "Excelente! 🎯" : meta >= 50 ? "Bom progresso!" : "Atenção ⚠️";

  chartGauge = new ApexCharts(el, {
    series: [Math.max(0, meta)],
    chart: {
      ...opcoesBase().chart,
      type: "radialBar",
      height: 320,
      offsetY: 0,
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 12,
        color: corMeta,
        opacity: 0.25,
      },
      animations: {
        ...opcoesBase().chart.animations,
        animateGradually: { enabled: true, delay: 50 },
        dynamicAnimation: { enabled: true, speed: 600 },
      },
    },
    colors: [corMeta],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: "rgba(18, 69, 89, 0.06)",
          startAngle: -135,
          endAngle: 135,
          strokeWidth: "97%",
          opacity: 1,
          margin: 6,
        },
        hollow: { margin: 15, size: "64%" },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontSize: "12px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            color: corTextoSuave(),
            offsetY: -24,
          },
          value: {
            show: true,
            fontSize: "22px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 900,
            color: corMeta,
            offsetY: 18,
            formatter: (v) => v.toFixed(0) + "%",
          },
        },
      },
    },
    stroke: { lineCap: "round" },
    labels: ["Meta de Economia"],
    tooltip: {
      custom: ({ series }) => {
        const v = series[0];
        return `<div style="
                    background: #124559;
                    color: #ffffff;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 600;
                    font-size: 13px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    line-height: 1.5;
                    text-align: center;
                ">
                    <div style="font-size:22px;font-weight:900;">${v.toFixed(0)}%</div>
                    <div style="border-top:1px solid rgba(255,255,255,0.12);margin:5px 0;padding-top:4px;font-size:11px;opacity:0.85;">${metaLabel}</div>
                </div>`;
      },
    },
  });
  chartGauge.render();
}

function atualizarMiniStats(historico)
{

  if (!historico.length) return;

  const hoje = new Date();
  const hojeISO = hoje.toISOString().split("T")[0];

  const registrosHoje = historico.filter((r) => r.data_leitura === hojeISO);
  const consumoHoje = registrosHoje.reduce((sum, r) => {
    const v = parseFloat(r.consumo_m3 ?? r.consumo);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);
  const elHoje = document.getElementById("statHoje");

  if (elHoje)
    elHoje.textContent = registrosHoje.length ? consumoHoje.toFixed(1) : "--";

  const seteDiasAtras = new Date(hoje);
  seteDiasAtras.setDate(hoje.getDate() - 7);
  const semanaISO = seteDiasAtras.toISOString().split("T")[0];
  const registrosSemana = historico.filter(
    (r) => r.data_leitura >= semanaISO && r.data_leitura <= hojeISO,
  );
  const totalSemana = registrosSemana.reduce((sum, r) => {
    const v = parseFloat(r.consumo_m3 ?? r.consumo);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);
  const elSemana = document.getElementById("statSemana");

  if (elSemana) elSemana.textContent = totalSemana.toFixed(1);

  const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0");
  const anoAtual = String(hoje.getFullYear());
  const prefixoMes = anoAtual + "-" + mesAtual;
  const desteMes = historico.filter(
    (r) => r.data_leitura && r.data_leitura.startsWith(prefixoMes),
  );
  const totalMes = desteMes.reduce((sum, r) => {
    const v = parseFloat(r.consumo_m3 ?? r.consumo);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);
  const elMes = document.getElementById("statMes");

  if (elMes) elMes.textContent = totalMes.toFixed(1);

  let mesPassadoInt = hoje.getMonth() === 0 ? 12 : hoje.getMonth();
  let anoPassado =
    hoje.getMonth() === 0
      ? String(hoje.getFullYear() - 1)
      : String(hoje.getFullYear());
  const mesPassado = String(mesPassadoInt).padStart(2, "0");
  const prefixoMesPassado = anoPassado + "-" + mesPassado;
  const doMesPassado = historico.filter(
    (r) => r.data_leitura && r.data_leitura.startsWith(prefixoMesPassado),
  );
  const totalMesPassado = doMesPassado.reduce((sum, r) => {
    const v = parseFloat(r.consumo_m3 ?? r.consumo);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  let variacao = 0;

  if (totalMesPassado > 0)
    variacao = ((totalMes - totalMesPassado) / totalMesPassado) * 100;

  const elVar = document.getElementById("statVariacao");

  if (elVar)
    elVar.textContent = (variacao >= 0 ? "+" : "") + variacao.toFixed(1);

  const changeVar = document.getElementById("changeVariacao");

  if (changeVar)
  {

    if (totalMesPassado === 0 && totalMes === 0)
    {
      changeVar.textContent = "Sem base de comparação";
      changeVar.className = "mini-change neutral";
    }

    else if (totalMesPassado === 0)
    {
      changeVar.textContent = "Primeiro mês registrado";
      changeVar.className = "mini-change neutral";
    }

    else if (variacao <= 0)
    {
      changeVar.textContent =
        "Redução de " +
        Math.abs(variacao).toFixed(1) +
        "% em relação ao mês anterior";
      changeVar.className = "mini-change negative";
    }
    else
    {
      changeVar.textContent =
        "Aumento de " + variacao.toFixed(1) + "% em relação ao mês anterior";
      changeVar.className = "mini-change positive";
    }

  }

  const changeMes = document.getElementById("changeMes");

  if (changeMes)
  {
    const regCount = desteMes.length;
    changeMes.textContent =
      regCount > 0
        ? regCount + " registro(s) no mês"
        : "Nenhum registro este mês";
    changeMes.className = "mini-change neutral";
  }

  const changeHoje = document.getElementById("changeHoje");

  if (changeHoje)
  {

    if (registrosHoje.length && historico.length > registrosHoje.length)
    {

      const anterior = (() => {

        for (const r of historico)
        {

          if (r.data_leitura !== hojeISO)
            return parseFloat(r.consumo_m3 ?? r.consumo);
        }

        return NaN;
      })();

      if (!isNaN(anterior) && anterior > 0)
      {
        const diff = ((consumoHoje - anterior) / anterior) * 100;

        if (diff <= 0)
        {
          changeHoje.textContent =
            Math.abs(diff).toFixed(1) + "% menor que o registro anterior";
          changeHoje.className = "mini-change negative";
        }
        else
        {
          changeHoje.textContent =
            "+" + diff.toFixed(1) + "% em relação ao registro anterior";
          changeHoje.className = "mini-change positive";
        }

      }
      else
      {
        changeHoje.textContent = "Comparado ao registro anterior";
        changeHoje.className = "mini-change neutral";
      }

    }

    else if (historico.length)
    {
      changeHoje.textContent = "Sem registro hoje";
      changeHoje.className = "mini-change neutral";
    }

  }

  const changeSemana = document.getElementById("changeSemana");

  if (changeSemana)
  {
    const diasCobertos = registrosSemana.length;
    changeSemana.textContent =
      diasCobertos > 0
        ? diasCobertos + " registro(s) na semana"
        : "Nenhum registro esta semana";
    changeSemana.className = "mini-change neutral";
  }

}

function configurarExportPDF()
{
  const btn = document.getElementById("btnExportPDF");

  if (btn)
  {
    btn.addEventListener("click", exportarPDF);
  }

}

async function exportarPDF()
{
  const btn = document.getElementById("btnExportPDF");

  if (btn)
  {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
  }

  try
  {
    const chartImages = await capturarGraficos();
    const chartsOk = chartImages.filter((c) => c.success).length;

    if (chartsOk === 0)
    {
      await Swal.fire({
        icon: "warning",
        title: "Sem gráficos para exportar",
        text: "Nenhum gráfico pôde ser capturado. Certifique-se de que há dados carregados.",
        confirmButtonColor: "var(--cor-botao)",
        background: "#eff6e0",
        color: "#01161e",
      });
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const { width: pdfW, height: pdfH } = pdf.internal.pageSize;
    const MARGIN = 15,
      pageW = pdfW - MARGIN * 2,
      pageH = pdfH - MARGIN * 2;

    const relatorioHTML = montarRelatorioHTML(chartImages);

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "height:0;overflow:hidden;position:relative";
    const tempDiv = document.createElement("div");
    Object.assign(tempDiv.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: "794px",
      background: "#ffffff",
    });
    tempDiv.innerHTML = DOMPurify.sanitize(relatorioHTML, {
      ADD_TAGS: ["style"],
      ADD_ATTR: ["class", "id", "style"],
    });
    wrapper.appendChild(tempDiv);
    document.body.appendChild(wrapper);
    await new Promise((r) => setTimeout(r, 400));

    let canvas;
    try
    {
      canvas = await html2canvas(tempDiv, {
        scale: 2,
        letterRendering: true,
        logging: false,
        width: 794,
      });
    }
    finally
    {

      if (wrapper.parentNode) document.body.removeChild(wrapper);
    }

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const scaleX = pageW / canvas.width;
    const totalH = canvas.height * scaleX;

    if (totalH <= pageH)
    {
      pdf.addImage(imgData, "JPEG", MARGIN, MARGIN, pageW, totalH);
    }
    else
    {
      let remaining = totalH;

      while (remaining > 0)
      {
        const sliceH = Math.min(remaining, pageH);
        const srcY = (totalH - remaining) / scaleX;
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH / scaleX;
        sliceCanvas
          .getContext("2d")
          .drawImage(
            canvas,
            0,
            srcY,
            canvas.width,
            sliceCanvas.height,
            0,
            0,
            canvas.width,
            sliceCanvas.height,
          );
        pdf.addImage(
          sliceCanvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          MARGIN,
          MARGIN,
          pageW,
          sliceH,
        );
        remaining -= pageH;

        if (remaining > 0) pdf.addPage();
      }

    }

    pdf.save(`relatorio-consumo-${formatarDataParaArquivo()}.pdf`);
  }

  catch (err)
  {
    await Swal.fire({
      icon: "error",
      title: "Erro ao gerar PDF",
      text: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
      confirmButtonColor: "var(--cor-botao)",
      background: "#eff6e0",
      color: "#01161e",
    });
  }
  finally
  {

    if (btn)
    {
      btn.disabled = false;
      btn.innerHTML = '<i class="far fa-file-pdf"></i> Exportar Relatório';
    }

  }

}

async function capturarGraficos()
{
  const charts = [
    { id: "chartDonut", nome: "Distribuição Semanal", ref: chartDonut },
    { id: "chartColunas", nome: "Consumo Diário", ref: chartColunas },
    { id: "chartLinha", nome: "Evolução Mensal", ref: chartLinha },
    { id: "chartArea", nome: "Volume Acumulado", ref: chartArea },
    { id: "chartPrevisao", nome: "Previsão Mensal", ref: chartPrevisao },
    { id: "chartGauge", nome: "Meta de Economia", ref: chartGauge },
  ];

  return Promise.all(
    charts.map(async (chart) => {
      try
      {

        if (chart.ref?.dataURI)
        {
          const result = await chart.ref.dataURI();

          if (result?.imgURI)
          {
            return { nome: chart.nome, imgSrc: result.imgURI, success: true };
          }

        }

        const el = document.getElementById(chart.id);

        if (!el) return { nome: chart.nome, imgSrc: null, success: false };

        const canvasEl = el.querySelector("canvas");

        if (canvasEl)
        {
          return {
            nome: chart.nome,
            imgSrc: canvasEl.toDataURL("image/png", 0.95),
            success: true,
          };

        }

        const svgEl = el.querySelector("svg");

        if (svgEl)
        {
          const clone = svgEl.cloneNode(true);
          clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          const blob = new Blob(
            [new XMLSerializer().serializeToString(clone)],
            { type: "image/svg+xml;charset=utf-8" },
          );
          return {
            nome: chart.nome,
            imgSrc: URL.createObjectURL(blob),
            success: true,
          };

        }

        return { nome: chart.nome, imgSrc: null, success: false };
      }
      catch
      {
        return { nome: chart.nome, imgSrc: null, success: false };
      }

    }),
  );
}

function montarRelatorioHTML(chartImages)
{
  const hoje = new Date();
  const dataHora = hoje.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const periodoLabel =
    document.querySelector(".period-btn.active")?.textContent?.trim() ||
    "Selecionado";

  const consumo = document.getElementById("execConsumo")?.innerHTML || "--";
  const valor = document.getElementById("execValor")?.textContent || "R$ 0,00";
  const metaPctCard = document.getElementById("execMeta")?.innerHTML || "--";

  const statHoje = document.getElementById("statHoje")?.textContent || "--";
  const statSemana = document.getElementById("statSemana")?.textContent || "--";
  const statMes = document.getElementById("statMes")?.textContent || "--";
  const statVariacao =
    document.getElementById("statVariacao")?.textContent || "--";

  const chartsHTML = chartImages
    .map((chart) => {

      if (!chart.success || !chart.imgSrc)
      {
        return `<div class="pdf-chart-col">
                <div class="pdf-chart-empty">${chart.nome} — sem dados disponíveis</div>
            </div>`;
      }

      return `<div class="pdf-chart-col">
            <div class="pdf-chart-item">
                <div class="pdf-chart-label">${chart.nome}</div>
                <img src="${chart.imgSrc}" class="pdf-chart-img">
            </div>
        </div>`;
    })
    .join("");

  const metaAlvo = carregarMeta();
  let goalsHTML = "";

  if (
    metaAlvo &&
    metaAlvo.mes === hoje.getMonth() + 1 &&
    metaAlvo.ano === hoje.getFullYear()
  ) {
    const prefixoMes =
      hoje.getFullYear() + "-" + String(hoje.getMonth() + 1).padStart(2, "0");
    const desteMes = historicoCache.filter((r) =>
      r.data_leitura?.startsWith(prefixoMes),
    );
    const totalMes = desteMes.reduce(
      (s, r) => s + (parseFloat(r.consumo_m3) || 0),
      0,
    );
    const alvo = metaAlvo.alvoM3;
    const pct = alvo > 0 ? Math.min(100, (totalMes / alvo) * 100) : 0;
    const restante = Math.max(0, alvo - totalMes);
    const diasComDados = new Set(desteMes.map((r) => r.data_leitura)).size;
    const ultimoDia = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0,
    ).getDate();
    const mediaDiaria = diasComDados > 0 ? totalMes / diasComDados : 0;
    const projecao =
      totalMes + Math.max(0, ultimoDia - hoje.getDate()) * mediaDiaria;
    const vaiUltrapassar = projecao > alvo;
    const corBarra = pct >= 90 ? "#e74c3c" : pct >= 70 ? "#e8a838" : "#27ae60";

    goalsHTML = `
            <div class="pdf-goals-grid">
                <div class="pdf-goal-item"><span class="pdf-goal-label">Meta</span><span class="pdf-goal-value">${alvo.toFixed(1)} <small>m³</small></span></div>
                <div class="pdf-goal-item"><span class="pdf-goal-label">Consumido</span><span class="pdf-goal-value">${totalMes.toFixed(1)} <small>m³</small></span></div>
                <div class="pdf-goal-item"><span class="pdf-goal-label">Restante</span><span class="pdf-goal-value">${restante.toFixed(1)} <small>m³</small></span></div>
                <div class="pdf-goal-item"><span class="pdf-goal-label">Projeção</span><span class="pdf-goal-value" style="color:${vaiUltrapassar ? "#e74c3c" : "#27ae60"}">${projecao.toFixed(1)} <small>m³</small></span></div>
            </div>
            <div class="pdf-goal-bar-bg">
                <div class="pdf-goal-bar-fill" style="width:${Math.min(100, pct)}%;background:${corBarra};"></div>
            </div>
            <div class="pdf-goal-bar-labels">
                <span>${pct.toFixed(0)}% utilizado</span>
                <span>${(100 - Math.min(100, pct)).toFixed(0)}% restante</span>
            </div>
            <div class="pdf-goal-proj ${vaiUltrapassar ? "pdf-goal-negative" : "pdf-goal-positive"}">
                ${
                  vaiUltrapassar
                    ? `⚠️ Projeção ultrapassará a meta em <strong>${(projecao - alvo).toFixed(1)} m³</strong>.`
                    : `✅ Dentro da meta com <strong>${restante.toFixed(1)} m³</strong> de folga.`
                }

            </div>`;
  }
  else
  {
    goalsHTML = `<div class="pdf-goals-empty">Nenhuma meta definida para este mês.</div>`;
  }

  return `<div class="pdf-root">
        <style>
            .pdf-root{font-family:'Montserrat',Arial,Helvetica,sans-serif;color:#01161e;margin:0;padding:0;background:#ffffff;width:794px;box-sizing:border-box}
            .pdf-header{background:linear-gradient(135deg,#124559 0%,#01161e 100%);color:#ffffff;padding:50px 50px 40px;border-radius:0 0 30px 30px;margin-bottom:30px}
            .pdf-header-brand{display:flex;align-items:center;gap:12px}
            .pdf-header-brand .brand-logo-img{height:40px;width:auto;display:block}
            .pdf-header-brand .brand-name{font-size:18px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:3px}
            .pdf-header h1{font-size:32px;font-weight:900;margin:0 0 8px;letter-spacing:-0.5px;color:#ffffff}
            .pdf-header .pdf-meta{display:flex;gap:30px;font-size:13px;color:#ffffff;font-weight:500}
            .pdf-header .pdf-meta span{display:flex;align-items:center;gap:6px;color:#ffffff}
            .pdf-header .pdf-meta strong{color:#ffffff;font-weight:700}
            .pdf-section{padding:0 40px;margin-bottom:30px}
            .pdf-section-title{font-size:16px;font-weight:800;color:#124559;text-transform:uppercase;letter-spacing:2px;padding-bottom:10px;border-bottom:3px solid #598392;margin-bottom:18px}
            .pdf-cards{display:flex;gap:12px;width:100%}
            .pdf-card{flex:1;background:#f5f8f2;border-radius:14px;padding:20px 24px;border:1px solid #dce8d8;font-size:14px}
            .pdf-card-label{font-size:10px;font-weight:800;color:#598392;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px}
            .pdf-card-value{font-size:24px;font-weight:900;color:#01161e}
            .pdf-card-value small{font-size:13px;font-weight:700;color:#598392}
            .pdf-charts-grid{display:flex;flex-wrap:wrap;gap:16px;width:100%}
            .pdf-chart-col{flex:0 0 calc(50% - 8px);font-size:12px}
            .pdf-chart-empty{background:#f0f4f0;border-radius:10px;padding:40px 20px;text-align:center;color:#aec3b0;font-weight:600;font-size:14px;font-family:'Montserrat',Arial,sans-serif}
            .pdf-chart-item{margin-bottom:8px;page-break-inside:avoid}
            .pdf-chart-label{font-size:12px;font-weight:800;color:#124559;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;font-family:'Montserrat',Arial,sans-serif}
            .pdf-chart-img{width:100%;max-width:100%;border-radius:8px;display:block}
            .pdf-mini-stats{display:flex;gap:10px;width:100%}
            .pdf-mini-stat{flex:1;background:#f5f8f2;border-radius:10px;padding:14px 16px;text-align:center;border:1px solid #dce8d8;font-size:12px}
            .pdf-mini-stat-label{font-size:9px;font-weight:800;color:#598392;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
            .pdf-mini-stat-value{font-size:20px;font-weight:900;color:#01161e}
            .pdf-mini-stat-unit{font-size:11px;font-weight:700;color:#598392}
            .pdf-goals-grid{display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap}
            .pdf-goal-item{flex:1;min-width:100px;background:#f5f8f2;border-radius:10px;padding:14px 16px;text-align:center;border:1px solid #dce8d8}
            .pdf-goal-label{display:block;font-size:9px;font-weight:800;color:#598392;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
            .pdf-goal-value{font-size:20px;font-weight:900;color:#01161e}
            .pdf-goal-value small{font-size:11px;font-weight:700;color:#598392}
            .pdf-goal-bar-bg{height:12px;background:#e8f0e8;border-radius:6px;overflow:hidden;margin-bottom:4px}
            .pdf-goal-bar-fill{height:100%;border-radius:6px;transition:none}
            .pdf-goal-bar-labels{display:flex;justify-content:space-between;font-size:10px;color:#598392;font-weight:600;margin-bottom:10px}
            .pdf-goal-proj{font-size:11px;font-weight:600;padding:8px 12px;border-radius:8px;text-align:center}
            .pdf-goal-positive{background:#e8f5e9;color:#2e7d32}
            .pdf-goal-negative{background:#fde8e8;color:#c62828}
            .pdf-goals-empty{background:#f5f8f2;border-radius:10px;padding:20px;text-align:center;color:#aec3b0;font-weight:600;font-size:13px;border:1px solid #dce8d8}
            .pdf-footer{text-align:center;padding:30px 40px 20px;color:#aec3b0;font-size:11px;font-weight:600;border-top:1px solid #dce8d8;margin-top:30px}
            .pdf-footer strong{color:#598392}
            @media print{.pdf-header{border-radius:0}}
        </style>

        <div class="pdf-header" style="background:linear-gradient(135deg,#124559 0%,#01161e 100%);padding:50px 50px 40px;border-radius:0 0 30px 30px;margin-bottom:30px;color:#ffffff!important">
            <div class="pdf-header-brand" style="display:flex;align-items:center;gap:12px;color:#ffffff!important">
                <img src="../assets/img/logos/logo-victoria.webp" alt="Victória" style="height:40px;width:auto;display:block">
                <span style="font-size:18px;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:#ffffff!important">Projeto Victória</span>
            </div>
            <h1 style="font-size:32px;font-weight:900;margin:0 0 8px;letter-spacing:-0.5px;color:#ffffff!important">Relatório de Consumo de Água</h1>
            <div style="display:flex;gap:30px;font-size:13px;font-weight:500;color:#ffffff!important">
                <span style="display:flex;align-items:center;gap:6px;color:#ffffff!important"><strong style="color:#ffffff!important;font-weight:700">Período:</strong> ${periodoLabel}</span>
                <span style="display:flex;align-items:center;gap:6px;color:#ffffff!important"><strong style="color:#ffffff!important;font-weight:700">Gerado em:</strong> ${dataHora}</span>
            </div>
        </div>

        <div class="pdf-section">
            <div class="pdf-section-title">Resumo Executivo</div>
            <div class="pdf-cards">
                <div class="pdf-card"><div class="pdf-card-label">Consumo do Período</div><div class="pdf-card-value">${consumo}</div></div>
                <div class="pdf-card"><div class="pdf-card-label">Custo Estimado</div><div class="pdf-card-value">${valor}</div></div>
                <div class="pdf-card"><div class="pdf-card-label">Meta Mensal</div><div class="pdf-card-value">${metaPctCard}</div></div>
            </div>
        </div>

        <div class="pdf-section">
            <div class="pdf-section-title">Análise Gráfica</div>
            <div class="pdf-charts-grid">${chartsHTML}</div>
        </div>

        <div class="pdf-section">
            <div class="pdf-section-title">Estatísticas Rápidas</div>
            <div class="pdf-mini-stats">
                <div class="pdf-mini-stat"><div class="pdf-mini-stat-label">Consumo Hoje</div><div class="pdf-mini-stat-value">${statHoje}</div><div class="pdf-mini-stat-unit">m³</div></div>
                <div class="pdf-mini-stat"><div class="pdf-mini-stat-label">Esta Semana</div><div class="pdf-mini-stat-value">${statSemana}</div><div class="pdf-mini-stat-unit">m³</div></div>
                <div class="pdf-mini-stat"><div class="pdf-mini-stat-label">Este Mês</div><div class="pdf-mini-stat-value">${statMes}</div><div class="pdf-mini-stat-unit">m³</div></div>
                <div class="pdf-mini-stat"><div class="pdf-mini-stat-label">Variação</div><div class="pdf-mini-stat-value">${statVariacao}</div><div class="pdf-mini-stat-unit">%</div></div>
            </div>
        </div>

        <div class="pdf-section">
            <div class="pdf-section-title">Metas Mensais</div>
            ${goalsHTML}
        </div>

        <div class="pdf-footer">
            <strong>Victória</strong> — Sistema de Monitoramento Inteligente de Consumo de Água<br>
            Gerado em ${dataHora}
        </div>
    </div>`;
}

function formatarDataParaArquivo()
{
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0") +
    "_" +
    String(d.getHours()).padStart(2, "0") +
    "h" +
    String(d.getMinutes()).padStart(2, "0")
  );
}
