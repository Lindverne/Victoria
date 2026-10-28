"use strict";

import { carregarDashboard } from "./admin-dashboard.js";
import {

  carregarUsuarios,
  editarUsuario,
  confirmarExclusaoUsuario,
  filtrarUsuarios,
  abrirModalUsuario,
} from "./admin-usuarios.js";

import {

  carregarEmpresas,
  editarEmpresa,
  confirmarExclusaoEmpresa,
  abrirModalEmpresa,
} from "./admin-empresas.js";

import {

  carregarNoticias,
  editarNoticia,
  confirmarExclusaoNoticia,
  abrirModalNoticia,
} from "./admin-noticias.js";

import { carregarLogs } from "./admin-logs.js";

window.editarUsuario = editarUsuario;
window.confirmarExclusaoUsuario = confirmarExclusaoUsuario;
window.filtrarUsuarios = filtrarUsuarios;
window.abrirModalUsuario = abrirModalUsuario;
window.editarEmpresa = editarEmpresa;
window.confirmarExclusaoEmpresa = confirmarExclusaoEmpresa;
window.abrirModalEmpresa = abrirModalEmpresa;
window.editarNoticia = editarNoticia;
window.confirmarExclusaoNoticia = confirmarExclusaoNoticia;
window.abrirModalNoticia = abrirModalNoticia;

document.addEventListener("DOMContentLoaded", () => {
  const sidebarNav = document.getElementById("adminSidebarNav");

  if (sidebarNav)
  {
    sidebarNav.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-tab]");

      if (!link) return;
      e.preventDefault();
      const tab = link.dataset.tab;

      if (tab) switchTab(tab);
    });
  }

  const tab =
    new URLSearchParams(window.location.search).get("tab") || "dashboard";
  carregarAbaInicial(tab);
});

function carregarAbaInicial(tab)
{

  if (tab === "dashboard")
  {
    carregarDashboard();
  }
  else
  {
    carregarAba(tab);
  }

}

function switchTab(tab)
{
  const url = new URL(window.location);
  url.searchParams.set("tab", tab);
  window.history.pushState({ tab }, "", url);

  document.querySelectorAll("#adminSidebarNav a[data-tab]").forEach((a) => {
    a.classList.toggle("active", a.dataset.tab === tab);
  });

  carregarAba(tab);
}

function carregarAba(tab)
{
  const container = document.querySelector(".admin-content");

  if (!container) return;

  container.innerHTML =
    '<div class="admin-loading"><i class="fas fa-spinner fa-spin"></i><p>Carregando...</p></div>';

  if (tab === "dashboard")
  {
    fetch(`?ajax=1&tab=dashboard`, { credentials: "include" })
      .then((r) => r.text())
      .then((html) => {
        container.innerHTML = html;
        carregarDashboard();
      })
      .catch(() => {
        container.innerHTML =
          '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar dashboard.</p></div>';
      });
  } else if (tab === "usuarios") carregarUsuarios();

  else if (tab === "empresas") carregarEmpresas();

  else if (tab === "noticias") carregarNoticias();

  else if (tab === "logs") carregarLogs();
}

window.addEventListener("popstate", () => {
  const tab =
    new URLSearchParams(window.location.search).get("tab") || "dashboard";
  document.querySelectorAll("#adminSidebarNav a[data-tab]").forEach((a) => {
    a.classList.toggle("active", a.dataset.tab === tab);
  });
  carregarAba(tab);
});
