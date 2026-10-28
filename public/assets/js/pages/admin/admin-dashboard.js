"use strict";

import {

  ADMIN_API,
  mostrarErro,
  formatarMoeda,
  escapeHtml,
  LOG_ICONS,
} from "./admin-utils.js";

export async function carregarDashboard()

{
  try
  {
    const res = await fetch(`${ADMIN_API}/estatisticas.php`, {
      credentials: "include",
    });
    const json = await res.json();

    if (!json.success)
    {
      mostrarErro("Erro ao carregar estatísticas.");
      return;
    }

    const d = json.data;

    const setStat = (id, val) => {
      const el = document.getElementById(id);

      if (el) el.textContent = val;
    };

    setStat("statUsuarios", d.total_usuarios ?? 0);
    setStat(
      "statUsuariosDetalhe",
      `${d.usuarios_ativos ?? 0} ativos · ${d.novos_usuarios_mes ?? 0} novo(s) este mês`,
    );

    setStat("statEmpresas", d.total_empresas ?? 0);
    setStat("statEmpresasDetalhe", `${d.empresas_ativas ?? 0} ativa(s)`);

    setStat("statNoticias", d.total_noticias ?? 0);
    setStat(
      "statNoticiasDetalhe",
      `${d.noticias_publicadas ?? 0} publicada(s)`,
    );

    const gastosLabel = d.total_gastos === 1 ? "registro" : "registros";
    setStat("statGastos", d.total_gastos ?? 0);
    setStat(
      "statGastosDetalhe",
      `Média ${d.consumo_medio || 0} m³ · ${formatarMoeda(d.valor_total_estimado)} total`,
    );

    criarGraficoUsuarios(d.cadastros_por_mes || []);
    criarGraficoConsumo(d.consumo_por_mes || []);

    renderizarLogsDashboard(d.ultimos_logs || []);
  }

  catch (err)
  {
    mostrarErro("Erro de conexão ao carregar dashboard.");
  }

}

function criarGraficoUsuarios(dados)
{
  const el = document.getElementById("chartNovosUsuarios");

  if (!el) return;

  const meses = dados.map((d) => {
    const [ano, mes] = d.mes.split("-");
    const mesesNome = [
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
    return mesesNome[parseInt(mes) - 1] + "/" + ano.slice(2);
  });
  const valores = dados.map((d) => parseInt(d.total));

  const options = {
    chart: {
      type: "bar",
      height: 250,
      toolbar: { show: false },
      fontFamily: "Montserrat, sans-serif",
    },
    series: [{ name: "Novos Usuários", data: valores }],
    xaxis: {
      categories: meses,
      labels: {
        style: { colors: "#598392", fontSize: "11px", fontWeight: 600 },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#598392", fontSize: "11px", fontWeight: 600 },
      },
      min: 0,
    },
    colors: ["#598392"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "55%",
      },
    },
    grid: {
      borderColor: "rgba(89,131,146,0.1)",
      show: true,
    },
    dataLabels: { enabled: false },
    tooltip: {
      style: { fontSize: "12px", fontFamily: "Montserrat" },
      custom: ({ series, dataPointIndex, w }) => {
        const val = series[0][dataPointIndex];
        const rotulo = w.globals.labels[dataPointIndex] || "";
        return `<div style="
                    background: #124559;
                    color: #ffffff;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 13px;
                    line-height: 1.5;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                ">
                    <div style="font-size:11px;opacity:0.7;font-weight:600;margin-bottom:2px;">${rotulo}</div>
                    <div style="font-size:20px;font-weight:800;color:#ffffff;">${val}</div>
                    <div style="font-size:10px;opacity:0.6;font-weight:500;">novo(s)</div>
                </div>`;
      },
    },
  };

  el.innerHTML = "";

  if (!dados || !dados.length)
  {
    el.innerHTML =
      '<div class="empty-state" style="padding:20px;"><p>Sem dados suficientes.</p></div>';
    return;
  }

  try
  {

    if (typeof ApexCharts !== "undefined")
    {
      const chart = new ApexCharts(el, options);
      chart.render();
    }

  }

  catch (e)
  {
    el.innerHTML =
      '<div class="empty-state" style="padding:20px;"><p>Erro ao carregar gráfico.</p></div>';
  }

}

function criarGraficoConsumo(dados)
{
  const el = document.getElementById("chartConsumoMedio");

  if (!el) return;

  el.innerHTML = "";

  if (!dados || !dados.length)
  {
    el.innerHTML =
      '<div class="empty-state" style="padding:20px;"><p>Sem dados suficientes.</p></div>';
    return;
  }

  const meses = dados.map((d) => {
    const [ano, mes] = d.mes.split("-");
    const mesesNome = [
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
    return mesesNome[parseInt(mes) - 1] + "/" + ano.slice(2);
  });
  const valores = dados.map((d) => parseFloat(d.media));

  const options = {
    chart: {
      type: "line",
      height: 250,
      toolbar: { show: false },
      fontFamily: "Montserrat, sans-serif",
    },
    series: [{ name: "m³ médio", data: valores }],
    xaxis: {
      categories: meses,
      labels: {
        style: { colors: "#598392", fontSize: "11px", fontWeight: 600 },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#598392", fontSize: "11px", fontWeight: 600 },
        formatter: (v) => v.toFixed(1),
      },
      min: 0,
    },
    colors: ["#124559"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      colors: ["#fff"],
      strokeColors: "#124559",
      strokeWidth: 2,
    },
    grid: {
      borderColor: "rgba(89,131,146,0.1)",
      show: true,
    },
    dataLabels: { enabled: false },
    tooltip: {
      style: { fontSize: "12px", fontFamily: "Montserrat" },
      custom: ({ series, dataPointIndex }) => {
        const val = series[0][dataPointIndex];
        return `<div style="
                    background: #124559;
                    color: #ffffff;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 13px;
                    line-height: 1.5;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                ">
                    <div style="font-size:20px;font-weight:800;color:#ffffff;">${val.toFixed(1)}</div>
                    <div style="font-size:10px;opacity:0.6;font-weight:500;">m³ médio</div>
                </div>`;
      },
    },
  };

  el.innerHTML = "";

  if (typeof ApexCharts !== "undefined")
  {
    try
    {
      const chart = new ApexCharts(el, options);
      chart.render();
    }

    catch (e)
    {
      el.innerHTML =
        '<div class="empty-state" style="padding:20px;"><p>Erro ao carregar gráfico.</p></div>';
    }

  }

}

function renderizarLogsDashboard(logs)
{
  const container = document.getElementById("adminLogsList");

  if (!container) return;

  if (!logs.length)
  {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhum registro de atividade ainda.</p></div>';
    return;
  }

  container.innerHTML = logs
    .map((log) => {
      const modKey =
        Object.keys(LOG_ICONS).find((k) =>
          (log.modulo || "").toLowerCase().includes(k),
        ) || "default";
      const iconGroup = LOG_ICONS[modKey] || "default";
      const iconClass = `log-icon-${iconGroup}`;

      const data = log.created_at ? new Date(log.created_at + " UTC") : null;
      const hora =
        data && !isNaN(data)
          ? data.toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—";

      let iconFa = "fa-circle";

      if (iconGroup === "auth") iconFa = "fa-key";

      else if (iconGroup === "gastos") iconFa = "fa-droplet";

      else if (iconGroup === "usuarios") iconFa = "fa-user";

      else if (iconGroup === "admin") iconFa = "fa-shield";

      return `
            <div class="log-entry">
                <div class="log-icon ${iconClass}">
                    <i class="fas ${iconFa}"></i>
                </div>
                <div class="log-info">
                    <div class="log-acao">${escapeHtml(log.acao)}</div>
                    <div class="log-desc">${escapeHtml(log.descricao || "")}</div>
                    <div class="log-user">${escapeHtml(log.usuario_nome)}</div>
                </div>
                <div class="log-meta">
                    <div class="log-time">${hora}</div>
                </div>
            </div>
        `;
    })
    .join("");
}
