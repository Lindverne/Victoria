"use strict";

import { ADMIN_API, escapeHtml } from "./admin-utils.js";

let usuariosData = [];
let usuariosFiltrados = [];

export async function carregarUsuarios()

{
  const container = document.querySelector(".admin-content");

  if (!container) return;

  container.innerHTML =
    '<div class="admin-loading"><i class="fas fa-spinner"></i><p>Carregando usuários...</p></div>';

  try
  {
    const res = await fetch(`${ADMIN_API}/usuarios-admin.php`, {
      credentials: "include",
    });
    const json = await res.json();

    if (!json.success)
    {
      container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${escapeHtml(json.message)}</p></div>`;
      return;
    }

    usuariosData = json.data || [];
    usuariosFiltrados = [...usuariosData];
    renderizarTabelaUsuarios();
  }

  catch (err)
  {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro de conexão ao carregar usuários.</p></div>';
  }

}

function renderizarTabelaUsuarios()
{
  const container = document.querySelector(".admin-content");

  if (!container) return;

  const total = usuariosFiltrados.length;

  let linhas = usuariosFiltrados
    .map((u) => {
      const tipoLabel =
        u.tipo_usuario >= 3
          ? "Corporativo"
          : u.tipo_usuario >= 2
            ? "Administrador"
            : "Usuário";
      const tipoBadge =
        u.tipo_usuario >= 3
          ? "badge-corp"
          : u.tipo_usuario >= 2
            ? "badge-admin"
            : "badge-user";
      const tipoIcon =
        u.tipo_usuario >= 3
          ? "fa-building"
          : u.tipo_usuario >= 2
            ? "fa-shield-halved"
            : "fa-user";
      const statusLabel = Number(u.status) === 1 ? "Ativo" : "Inativo";
      const statusBadge = Number(u.status) === 1 ? "badge-ativo" : "badge-inativo";

      const dataCadastro = u.data_cadastro
        ? new Date(u.data_cadastro + " UTC")
        : null;
      const dataFmt =
        dataCadastro && !isNaN(dataCadastro)
          ? dataCadastro.toLocaleDateString("pt-BR")
          : "—";
      const ultimoLoginDate = u.ultimo_login
        ? new Date(u.ultimo_login + " UTC")
        : null;
      const ultimoLoginFmt =
        ultimoLoginDate && !isNaN(ultimoLoginDate)
          ? ultimoLoginDate.toLocaleDateString("pt-BR")
          : "Nunca";

      return `
            <tr>
                <td><strong>${escapeHtml(u.nome)}</strong></td>
                <td>${escapeHtml(u.email)}</td>
                <td><span class="badge ${tipoBadge}"><i class="fas ${tipoIcon}"></i> ${tipoLabel}</span></td>
                <td><span class="badge ${statusBadge}"><i class="fas ${Number(u.status) === 1 ? "fa-check-circle" : "fa-circle"}"></i> ${statusLabel}</span></td>
                <td>${dataFmt}</td>
                <td>${ultimoLoginFmt}</td>
                <td>
                    <div class="cell-actions">
                        <button class="btn-admin btn-admin-outline btn-admin-sm" onclick="editarUsuario(${u.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="confirmarExclusaoUsuario(${u.id}, '${escapeHtml(u.nome)}')" title="Excluir">
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
                <p>Gestão de Usuários</p>
                <h2>Usuários <small style="font-size:0.8rem;color:var(--air-force-blue);font-weight:600;">(${total})</small></h2>
            </div>
            <div class="admin-search">
                <input type="text" id="searchUsuarios" placeholder="Buscar usuário..." oninput="filtrarUsuarios(this.value)">
                <button class="btn-admin btn-admin-primary" onclick="abrirModalUsuario()">
                    <i class="fas fa-plus"></i> Novo
                </button>
            </div>
        </header>
        <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Cadastro</th>
                        <th>Último Login</th>
                        <th style="width:100px;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhas || '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--air-force-blue);font-weight:600;">Nenhum usuário encontrado.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

export function filtrarUsuarios(valor)

{
  const q = valor.toLowerCase().trim();

  if (!q)
  {
    usuariosFiltrados = [...usuariosData];
  }
  else
  {
    usuariosFiltrados = usuariosData.filter(
      (u) =>
        u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }

  renderizarTabelaUsuarios();
}

export function abrirModalUsuario(dados)

{
  let meuId = null;
  try
  {
    const eu = localStorage.getItem("victoria_user");

    if (eu) meuId = parseInt(JSON.parse(eu).id, 10) || null;
  } catch (e) {}
  const editaProprio =
    dados && meuId !== null && parseInt(dados.id, 10) === meuId;

  Swal.fire({
    title: dados ? "Editar Usuário" : "Novo Usuário",
    html: `
            <form id="formUsuario" style="text-align:left;">
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Nome</label>
                    <input type="text" id="modalNome" class="dash-field" value="${dados ? escapeHtml(dados.nome) : ""}" placeholder="Nome completo">
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Email</label>
                    <input type="email" id="modalEmail" class="dash-field" value="${dados ? escapeHtml(dados.email) : ""}" placeholder="email@exemplo.com">
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Tipo</label>
                    <select id="modalTipo" class="dash-field" ${editaProprio ? "disabled" : ""}>
                        <option value="1" ${dados && Number(dados.tipo_usuario) === 1 ? "selected" : ""}>Usuário</option>
                        <option value="2" ${dados && Number(dados.tipo_usuario) === 2 ? "selected" : ""}>Administrador</option>
                        <option value="3" ${dados && Number(dados.tipo_usuario) === 3 ? "selected" : ""}>Corporativo</option>
                    </select>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Status</label>
                    <select id="modalStatus" class="dash-field" ${editaProprio ? "disabled" : ""}>
                        <option value="1" ${!dados || Number(dados.status) === 1 ? "selected" : ""}>Ativo</option>
                        <option value="0" ${dados && Number(dados.status) === 0 ? "selected" : ""}>Inativo</option>
                    </select>
                </div>
                ${editaProprio ? '<div style="font-size:0.75rem;color:#b34700;margin-top:-8px;margin-bottom:4px;">Tipo e status não podem ser alterados na sua própria conta.</div>' : ""}
                ${
                  !dados
                    ? `
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Senha</label>
                    <input type="password" id="modalSenha" class="dash-field" placeholder="Mínimo 6 caracteres">
                </div>`
                    : ""
                }

            </form>
        `,
    confirmButtonText: dados ? "Salvar" : "Criar",
    confirmButtonColor: "#598392",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#aec3b0",

    preConfirm: async () => {
      const nome = document.getElementById("modalNome").value.trim();
      const email = document.getElementById("modalEmail").value.trim();
      const tipo = parseInt(document.getElementById("modalTipo").value);
      const status = parseInt(document.getElementById("modalStatus").value);

      if (!nome)
      {
        Swal.showValidationMessage("Nome é obrigatório");
        return false;
      }

      if (!email)
      {
        Swal.showValidationMessage("Email é obrigatório");
        return false;
      }

      const payload = { nome, email, tipo_usuario: tipo, status };

      if (!dados)
      {
        const senha = document.getElementById("modalSenha").value;

        if (!senha || senha.length < 6)
        {
          Swal.showValidationMessage("Senha deve ter no mínimo 6 caracteres");
          return false;
        }

        payload.senha = senha;
      }
      else
      {
        payload.id = dados.id;

        if (editaProprio)
        {
          payload.tipo_usuario = dados.tipo_usuario;
          payload.status = dados.status;
        }

      }

      try
      {
        const res = await fetch(`${ADMIN_API}/usuarios-admin.php`, {
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
        title: dados ? "Usuário atualizado!" : "Usuário criado!",
        timer: 1500,
        showConfirmButton: false,
      });
      carregarUsuarios();
    }

  });
}

export function editarUsuario(id)

{
  const u = usuariosData.find((u) => u.id === id);

  if (!u) return;
  abrirModalUsuario(u);
}

export function confirmarExclusaoUsuario(id, nome)

{
  Swal.fire({
    title: "Excluir usuário?",
    text: `Tem certeza que deseja excluir "${nome}"? Esta ação não pode ser desfeita.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    confirmButtonColor: "#c62828",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#598392",

    preConfirm: async () => {
      try
      {
        const res = await fetch(`${ADMIN_API}/usuarios-admin.php`, {
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
        title: "Usuário excluído!",
        timer: 1500,
        showConfirmButton: false,
      });
      carregarUsuarios();
    }

  });
}
