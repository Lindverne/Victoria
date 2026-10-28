"use strict";

export const ADMIN_API = window.location.pathname.includes("/pages/")

  ? "../../api/admin"
  : "../api/admin";

export const LOG_ICONS = {

  auth: "auth",
  login: "auth",
  cadastro: "auth",
  logout: "auth",
  gastos: "gastos",
  consumo: "gastos",
  usuarios: "usuarios",
  perfil: "usuarios",
  empresas: "usuarios",
  admin: "admin",
  noticias: "admin",
};

export function escapeHtml(text)

{

  if (!text) return "";
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML.replace(/'/g, "&#39;");
}

export function formatarMoeda(valor)

{
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

export function mostrarErro(msg)

{
  Swal.fire({
    icon: "error",
    title: "Erro",
    text: msg,
    confirmButtonColor: "var(--cor-botao)",
  });
}
