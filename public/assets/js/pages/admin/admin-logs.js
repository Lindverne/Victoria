"use strict";

import { ADMIN_API, escapeHtml, LOG_ICONS } from "./admin-utils.js";

let logsState = {
  pagina: 1,
  modulo: "todos",
  busca: "",
  de: "",
  ate: "",
  porPagina: 30,
};

export async function carregarLogs()

{
  const container = document.querySelector(".admin-content");

  if (!container) return;

  container.innerHTML = `
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
                <input type="text" id="filtroBusca" class="dash-field" placeholder="Usuário, ação, descrição..."
                    value="${escapeHtml(logsState.busca)}">
            </div>
            <div class="logs-filter-group">
                <label for="filtroDe"><i class="fas fa-calendar"></i> De</label>
                <input type="date" id="filtroDe" class="dash-field" value="${escapeHtml(logsState.de)}">
            </div>
            <div class="logs-filter-group">
                <label for="filtroAte"><i class="fas fa-calendar-check"></i> Até</label>
                <input type="date" id="filtroAte" class="dash-field" value="${escapeHtml(logsState.ate)}">
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
    `;

  configurarFiltrosLogs();

  const params = new URLSearchParams({
    pagina: logsState.pagina,
    por_pagina: logsState.porPagina,
    modulo: logsState.modulo,
    busca: logsState.busca,
    de: logsState.de,
    ate: logsState.ate,
  });

  try
  {
    const res = await fetch(`${ADMIN_API}/logs-admin.php?${params}`, {
      credentials: "include",
    });
    const json = await res.json();

    if (!json.success)
    {
      document.getElementById("logsListContainer").innerHTML =
        `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${escapeHtml(json.message)}</p></div>`;
      return;
    }

    const logs = json.data || [];
    const total = json.total || 0;
    const totalPaginas = json.total_paginas || 1;

    const badge = document.getElementById("logsBadge");

    if (badge) badge.textContent = `${total} registro(s)`;

    const totalLabel = document.getElementById("logsTotalLabel");

    if (totalLabel)
    {
      const de = (logsState.pagina - 1) * logsState.porPagina + 1;
      const ate = Math.min(logsState.pagina * logsState.porPagina, total);

      if (total > 0)
      {
        totalLabel.innerHTML = `
                    <strong>${total}</strong> registro(s) encontrado(s)
                    &mdash; exibindo <strong>${de}&ndash;${ate}</strong>
                `;
      }
      else
      {
        totalLabel.innerHTML = "Nenhum registro encontrado.";
      }

    }

    const listContainer = document.getElementById("logsListContainer");

    if (!logs.length)
    {
      listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhum registro encontrado.</p>
                    <p style="font-size:0.8rem;margin-top:8px;color:var(--air-force-blue);">
                        Tente ajustar os filtros ou ampliar o período.
                    </p>
                </div>`;
    }
    else
    {
      listContainer.innerHTML = logs
        .map((log) => {
          const modKey =
            Object.keys(LOG_ICONS).find((k) =>
              (log.modulo || "").toLowerCase().includes(k),
            ) || "default";
          const iconGroup = LOG_ICONS[modKey] || "default";
          const iconFa =
            iconGroup === "auth"
              ? "fa-key"
              : iconGroup === "gastos"
                ? "fa-droplet"
                : iconGroup === "usuarios"
                  ? "fa-user"
                  : iconGroup === "admin"
                    ? "fa-shield"
                    : "fa-circle";
          const data = log.created_at
            ? new Date(log.created_at + " UTC")
            : null;
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

          return `
                    <div class="log-entry">
                        <div class="log-icon log-icon-${iconGroup}"><i class="fas ${iconFa}"></i></div>
                        <div class="log-info">
                            <div class="log-acao">${escapeHtml(log.acao)}</div>
                            <div class="log-desc">${escapeHtml(log.descricao || "")}</div>
                            <div class="log-user">
                                <i class="fas fa-user" style="font-size:0.55rem;margin-right:4px;"></i>
                                ${escapeHtml(log.usuario_nome)}
                                <span class="log-modulo">${escapeHtml(log.modulo)}</span>
                            </div>
                        </div>
                        <div class="log-meta">
                            <div class="log-time"><i class="fas fa-clock" style="font-size:0.55rem;margin-right:4px;"></i>${hora}</div>
                            ${log.ip ? `<div class="log-ip">${escapeHtml(log.ip)}</div>` : ""}
                        </div>
                    </div>
                `;
        })
        .join("");
    }

    renderizarPaginacaoLogs(totalPaginas);

    if (json.modulos && json.modulos.length)
    {
      const select = document.getElementById("filtroModulo");

      if (select && select.options.length <= 1)
      {
        json.modulos.forEach((m) => {
          const opt = document.createElement("option");
          opt.value = m;
          opt.textContent = m.charAt(0).toUpperCase() + m.slice(1);
          select.appendChild(opt);
        });

        select.value = logsState.modulo;
      }

    }

  }

  catch (err)
  {
    const listContainer = document.getElementById("logsListContainer");

    if (listContainer)
    {
      listContainer.innerHTML =
        '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro de conexão ao carregar logs.</p></div>';
    }

  }

}

function renderizarPaginacaoLogs(totalPaginas)
{
  const container = document.getElementById("logsPagination");

  if (!container) return;

  if (totalPaginas <= 1)
  {
    container.innerHTML = "";
    return;
  }

  const atual = logsState.pagina;
  const maxBotoes = 7;
  let inicio = Math.max(1, atual - Math.floor(maxBotoes / 2));
  let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

  if (fim - inicio + 1 < maxBotoes)
  {
    inicio = Math.max(1, fim - maxBotoes + 1);
  }

  const botoes = [];

  botoes.push(`<button class="btn-page" data-pagina="${atual - 1}" ${atual <= 1 ? "disabled" : ""}>
        <i class="fas fa-chevron-left"></i>
    </button>`);

  if (inicio > 1)
  {
    botoes.push(`<button class="btn-page" data-pagina="1">1</button>`);

    if (inicio > 2)
    {
      botoes.push(`<span class="page-ellipsis">...</span>`);
    }

  }

  for (let i = inicio; i <= fim; i++)
  {
    botoes.push(
      `<button class="btn-page ${i === atual ? "active" : ""}" data-pagina="${i}">${i}</button>`,
    );
  }

  if (fim < totalPaginas)
  {

    if (fim < totalPaginas - 1)
    {
      botoes.push(`<span class="page-ellipsis">...</span>`);
    }

    botoes.push(
      `<button class="btn-page" data-pagina="${totalPaginas}">${totalPaginas}</button>`,
    );
  }

  botoes.push(`<button class="btn-page" data-pagina="${atual + 1}" ${atual >= totalPaginas ? "disabled" : ""}>
        <i class="fas fa-chevron-right"></i>
    </button>`);

  container.innerHTML = botoes.join("");

  container.querySelectorAll(".btn-page:not(:disabled)").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pagina = parseInt(btn.dataset.pagina);

      if (pagina && pagina !== logsState.pagina)
      {
        logsState.pagina = pagina;
        carregarLogs();
      }

    });
  });
}

function configurarFiltrosLogs()
{
  const btnFiltrar = document.getElementById("btnFiltrarLogs");

  if (btnFiltrar)
  {
    btnFiltrar.addEventListener("click", () => {
      logsState.modulo =
        document.getElementById("filtroModulo")?.value || "todos";
      logsState.busca =
        document.getElementById("filtroBusca")?.value.trim() || "";
      logsState.de = document.getElementById("filtroDe")?.value || "";
      logsState.ate = document.getElementById("filtroAte")?.value || "";
      logsState.pagina = 1;
      carregarLogs();
    });
  }

  const btnLimpar = document.getElementById("btnLimparFiltros");

  if (btnLimpar)
  {
    btnLimpar.addEventListener("click", () => {
      document.getElementById("filtroModulo").value = "todos";
      document.getElementById("filtroBusca").value = "";
      document.getElementById("filtroDe").value = "";
      document.getElementById("filtroAte").value = "";

      logsState.modulo = "todos";
      logsState.busca = "";
      logsState.de = "";
      logsState.ate = "";
      logsState.pagina = 1;
      carregarLogs();
    });
  }

  const buscaInput = document.getElementById("filtroBusca");

  if (buscaInput)
  {
    buscaInput.addEventListener("keydown", (e) => {

      if (e.key === "Enter") btnFiltrar?.click();
    });
  }

  const btnLimparLogs = document.getElementById("btnLimparLogs");

  if (btnLimparLogs)
  {
    btnLimparLogs.addEventListener("click", () => {
      Swal.fire({
        title: "Limpar Logs Antigos?",
        html: `
                    <p style="margin-bottom:16px;color:var(--air-force-blue);font-weight:600;">
                        Remover registros de log com mais de:
                    </p>
                    <select id="diasLimpeza" class="dash-field" style="width:100%;">
                        <option value="30">30 dias</option>
                        <option value="60">60 dias</option>
                        <option value="90" selected>90 dias</option>
                        <option value="180">180 dias</option>
                        <option value="365">1 ano</option>
                    </select>
                `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, limpar",
        confirmButtonColor: "#c62828",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#598392",
        preConfirm: async () => {
          const dias = parseInt(document.getElementById("diasLimpeza").value);
          try
          {
            const res = await fetch(`${ADMIN_API}/logs-admin.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ action: "limpar", dias }),
            });
            const json = await res.json();

            if (!json.success)
            {
              Swal.showValidationMessage(json.message || "Erro ao limpar logs");
              return false;
            }

            return json;
          }

          catch (e)
          {
            Swal.showValidationMessage("Erro de conexão");
            return false;
          }

        },
      }).then((result) => {

        if (result.isConfirmed)
        {
          Swal.fire({
            icon: "success",
            title: result.value?.message || "Logs removidos!",
            timer: 2000,
            showConfirmButton: false,
          });
          carregarLogs();
        }

      });
    });
  }

}
