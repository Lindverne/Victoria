"use strict";

import { ADMIN_API, escapeHtml } from "./admin-utils.js";

let empresasData = [];

export async function carregarEmpresas()

{
  const container = document.querySelector(".admin-content");

  if (!container) return;

  container.innerHTML =
    '<div class="admin-loading"><i class="fas fa-spinner"></i><p>Carregando empresas...</p></div>';

  try
  {
    const res = await fetch(`${ADMIN_API}/empresas-admin.php`, {
      credentials: "include",
    });
    const json = await res.json();

    if (!json.success)
    {
      container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${escapeHtml(json.message)}</p></div>`;
      return;
    }

    empresasData = json.data || [];
    renderizarTabelaEmpresas();
  }

  catch (err)
  {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro de conexão ao carregar empresas.</p></div>';
  }

}

function renderizarTabelaEmpresas()
{
  const container = document.querySelector(".admin-content");

  if (!container) return;

  const total = empresasData.length;

  let linhas = empresasData
    .map((e) => {
      const statusLabel = Number(e.status) === 1 ? "Ativa" : "Inativa";
      const statusBadge = Number(e.status) === 1 ? "badge-ativo" : "badge-inativo";
      const dataDate = e.created_at ? new Date(e.created_at + " UTC") : null;
      const dataFmt =
        dataDate && !isNaN(dataDate)
          ? dataDate.toLocaleDateString("pt-BR")
          : "—";

      return `
            <tr>
                <td><strong>${escapeHtml(e.nome)}</strong></td>
                <td>${escapeHtml(e.cidade || "—")}</td>
                <td>${escapeHtml(e.estado || "—")}</td>
                <td><span class="badge ${statusBadge}">${statusLabel}</span></td>
                <td>${dataFmt}</td>
                <td>
                    <div class="cell-actions">
                        <button class="btn-admin btn-admin-outline btn-admin-sm" onclick="editarEmpresa(${e.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="confirmarExclusaoEmpresa(${e.id}, '${escapeHtml(e.nome)}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    })
    .join("");

  container.innerHTML = `
        <header class="admin-page-header">
            <div>
                <p>Gestão de Empresas</p>
                <h2>Empresas <small style="font-size:0.8rem;color:var(--air-force-blue);font-weight:600;">(${total})</small></h2>
            </div>
            <div>
                <button class="btn-admin btn-admin-primary" onclick="abrirModalEmpresa()">
                    <i class="fas fa-plus"></i> Nova Empresa
                </button>
            </div>
        </header>
        <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Status</th>
                        <th>Criada em</th>
                        <th style="width:100px;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhas || '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--air-force-blue);font-weight:600;">Nenhuma empresa cadastrada.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

export function abrirModalEmpresa(dados)

{
  Swal.fire({
    title: dados ? "Editar Empresa" : "Nova Empresa",
    html: `
            <form id="formEmpresa" style="text-align:left;">
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Nome</label>
                    <input type="text" id="modalEmpNome" class="dash-field" value="${dados ? escapeHtml(dados.nome) : ""}" placeholder="Razão social">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="margin-bottom:12px;">
                        <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Cidade</label>
                        <input type="text" id="modalEmpCidade" class="dash-field" value="${dados ? escapeHtml(dados.cidade || "") : ""}" placeholder="Cidade">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Estado</label>
                        <select id="modalEmpEstado" class="dash-field">
                            <option value="">Selecione...</option>
                            ${[
                              "AC",
                              "AL",
                              "AP",
                              "AM",
                              "BA",
                              "CE",
                              "DF",
                              "ES",
                              "GO",
                              "MA",
                              "MT",
                              "MS",
                              "MG",
                              "PA",
                              "PB",
                              "PR",
                              "PE",
                              "PI",
                              "RJ",
                              "RN",
                              "RS",
                              "RO",
                              "RR",
                              "SC",
                              "SP",
                              "SE",
                              "TO",
                            ]
                              .map(
                                (sigla) =>
                                  `<option value="${sigla}" ${dados && dados.estado === sigla ? "selected" : ""}>${sigla}</option>`,
                              )
                              .join("")}
                        </select>
                    </div>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Status</label>
                    <select id="modalEmpStatus" class="dash-field">
                        <option value="1" ${!dados || Number(dados.status) === 1 ? "selected" : ""}>Ativa</option>
                        <option value="0" ${dados && Number(dados.status) === 0 ? "selected" : ""}>Inativa</option>
                    </select>
                </div>
            </form>
        `,
    confirmButtonText: dados ? "Salvar" : "Criar",
    confirmButtonColor: "#598392",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#aec3b0",

    preConfirm: async () => {
      const nome = document.getElementById("modalEmpNome").value.trim();

      if (!nome)
      {
        Swal.showValidationMessage("Nome é obrigatório");
        return false;
      }

      const payload = {
        nome,
        cidade: document.getElementById("modalEmpCidade").value.trim(),
        estado: document.getElementById("modalEmpEstado").value,
        status: parseInt(document.getElementById("modalEmpStatus").value),
      };

      if (dados) payload.id = dados.id;

      try
      {
        const res = await fetch(`${ADMIN_API}/empresas-admin.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const json = await res.json();

        if (!json.success)
        {
          Swal.showValidationMessage(json.message || "Erro ao salvar");
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
        title: dados ? "Empresa atualizada!" : "Empresa criada!",
        timer: 1500,
        showConfirmButton: false,
      });
      carregarEmpresas();
    }

  });
}

export function editarEmpresa(id)

{
  const e = empresasData.find((e) => e.id === id);

  if (!e) return;
  abrirModalEmpresa(e);
}

export function confirmarExclusaoEmpresa(id, nome)

{
  Swal.fire({
    title: "Excluir empresa?",
    text: `Tem certeza que deseja excluir "${nome}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    confirmButtonColor: "#c62828",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#598392",

    preConfirm: async () => {
      try
      {
        const res = await fetch(`${ADMIN_API}/empresas-admin.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id, action: "delete" }),
        });
        const json = await res.json();

        if (!json.success)
        {
          Swal.showValidationMessage(json.message || "Erro ao excluir");
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
        title: "Empresa excluída!",
        timer: 1500,
        showConfirmButton: false,
      });
      carregarEmpresas();
    }

  });
}
