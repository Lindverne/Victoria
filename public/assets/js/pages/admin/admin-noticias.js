"use strict";

import { ADMIN_API, escapeHtml } from "./admin-utils.js";
import { urlImagemSegura } from "../../utils/url-segura.js";

const NOTICIAS_API = window.location.pathname.includes("/pages/")
  ? "../../api/noticias"
  : "../api/noticias";

let noticiasData = [];
let cropperNews = null;
let imagemNewsAtual = null;

const CATEGORIAS_NOTICIAS = [
  "Sustentabilidade",
  "Gestão",
  "Desafios",
  "Meio Ambiente",
  "Saneamento",
  "Tecnologia",
  "Políticas Públicas",
  "Economia",
  "Pesquisa",
  "Infraestrutura",
];

function abrirModalNewsImagem()
{
  const modal = document.getElementById("modalNewsImagem");

  if (modal)
  {
    modal.style.display = "flex";
    modal.style.zIndex = "99999";
  }

}

window.fecharModalNewsImagem = function () {
  const modal = document.getElementById("modalNewsImagem");

  if (modal) modal.style.display = "none";

  document.getElementById("urlNewsImagem").value = "";

  if (cropperNews)
  {
    cropperNews.destroy();
    cropperNews = null;
  }

  const container = document.getElementById("containerCropperNewsImagem");

  if (container) container.style.display = "none";

  const dropzone = document.getElementById("dropzoneNewsImagem");

  if (dropzone) dropzone.style.display = "";
};

function carregarImagemNoCropperNews(source)
{

  if (cropperNews) cropperNews.destroy();

  const img = document.getElementById("imagem-para-cortar-news");

  definirSrcSeguro(img, source);

  const container = document.getElementById("containerCropperNewsImagem");

  if (container) container.style.display = "block";

  cropperNews = new Cropper(img, {
    aspectRatio: 16 / 9,
    viewMode: 2,
    background: false,
  });
}

function processarArquivoNewsImagem(file)
{

  if (!file.type.startsWith("image/"))
  {
    Swal.fire("Erro", "O arquivo precisa ser uma imagem!", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    carregarImagemNoCropperNews(e.target.result);
    const fileInput = document.getElementById("fileNewsImagem");

    if (fileInput) fileInput.value = "";
  };

  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzoneNewsImagem");
  const fileInput = document.getElementById("fileNewsImagem");
  const urlInput = document.getElementById("urlNewsImagem");
  const btnSalvar = document.getElementById("btnSalvarNewsImagem");

  if (dropzone && fileInput)
  {
    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "#124559";
      dropzone.style.background = "rgba(89, 131, 146, 0.1)";
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.style.borderColor = "#598392";
      dropzone.style.background = "";
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "#598392";
      dropzone.style.background = "";
      const file = e.dataTransfer.files[0];

      if (file) processarArquivoNewsImagem(file);
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (file) processarArquivoNewsImagem(file);
    });
  }

  if (urlInput)
  {
    urlInput.addEventListener("change", (e) => {

      if (e.target.value) carregarImagemNoCropperNews(e.target.value);
    });
  }

  if (btnSalvar)
  {
    btnSalvar.addEventListener("click", async () => {
      let finalData = null;

      if (cropperNews)
      {
        const canvas = cropperNews.getCroppedCanvas({
          width: 1200,
          height: 675,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        });

        const webp = canvas.toDataURL("image/webp", 0.8);
        finalData = webp.startsWith("data:image/webp")
          ? webp
          : canvas.toDataURL("image/jpeg", 0.85);
      }
      else
      {
        finalData = urlInput ? urlInput.value.trim() : "";
      }

      if (!finalData)
      {
        Swal.fire(
          "Aviso",
          "Selecione uma imagem ou cole uma URL primeiro.",
          "warning",
        );
        return;
      }

      if (finalData.startsWith("data:") || /^https?:\/\//i.test(finalData))
      {
        try
        {
          const res = await fetch(`${NOTICIAS_API}/upload.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ data: finalData }),
          });
          const json = await res.json();

          if (!json.success)
          {
            Swal.fire(
              "Erro",
              json.message || "Falha ao enviar imagem.",
              "error",
            );
            return;
          }

          imagemNewsAtual = json.url || json.path || json.filename || "";
        }

        catch (err)
        {
          Swal.fire("Erro", "Falha de conexão ao enviar imagem.", "error");
          return;
        }

      }
      else
      {
        imagemNewsAtual = finalData;
      }

      const preview = document.getElementById("previewNewsImagem");

      if (preview)
      {
        const previewSrc =
          imagemNewsAtual.startsWith("http") || imagemNewsAtual.startsWith("/")
            ? imagemNewsAtual
            : `../../assets/img/pages/noticias/${imagemNewsAtual}`;
        preview.innerHTML = DOMPurify.sanitize(
          `<img src="${previewSrc}"
                    style="max-width:100%;max-height:120px;border-radius:8px;object-fit:cover;">`,
          {
            ADD_ATTR: ["style"],
          },
        );
        preview.style.display = "block";
      }

      const hidden = document.getElementById("hiddenNewsImagem");

      if (hidden) hidden.value = imagemNewsAtual;

      window.fecharModalNewsImagem();
    });
  }

  document.addEventListener("paste", (e) => {
    const modal = document.getElementById("modalNewsImagem");

    if (!modal || modal.style.display === "none") return;

    const items = e.clipboardData?.items;

    if (!items) return;

    for (const item of items)
    {

      if (item.type.startsWith("image/"))
      {
        processarArquivoNewsImagem(item.getAsFile());
        break;
      }

    }

  });
});

export async function carregarNoticias()

{
  const container = document.querySelector(".admin-content");

  if (!container) return;

  container.innerHTML =
    '<div class="admin-loading"><i class="fas fa-spinner"></i><p>Carregando notícias...</p></div>';

  try
  {
    const res = await fetch(`${NOTICIAS_API}/listar.php?admin=1`, {
      credentials: "include",
    });
    const json = await res.json();

    if (!json.success)
    {
      container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${escapeHtml(json.message)}</p></div>`;
      return;
    }

    noticiasData = json.data || [];
    renderizarTabelaNoticias(json.categorias || []);
  }

  catch (err)
  {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro de conexão ao carregar notícias.</p></div>';
  }

}

function renderizarTabelaNoticias(categorias)
{
  const container = document.querySelector(".admin-content");

  if (!container) return;

  const total = noticiasData.length;

  let linhas = noticiasData
    .map((n) => {
      const statusLabel = Number(n.status) === 1 ? "Publicado" : "Rascunho";
      const statusBadge = Number(n.status) === 1 ? "badge-ativo" : "badge-inativo";
      const destaqueIcon = Number(n.destaque) === 1 ? "⭐" : "";
      const dataDate = n.created_at ? new Date(n.created_at + " UTC") : null;
      const dataFmt =
        dataDate && !isNaN(dataDate)
          ? dataDate.toLocaleDateString("pt-BR")
          : "—";

      return `
            <tr>
                <td><strong>${escapeHtml(n.titulo)}</strong> ${destaqueIcon}</td>
                <td><span class="badge badge-${n.categoria ? n.categoria.toLowerCase().slice(0, 6) : "default"}">${escapeHtml(n.categoria || "—")}</span></td>
                <td>${escapeHtml(n.autor_nome)}</td>
                <td><span class="badge ${statusBadge}">${statusLabel}</span></td>
                <td>${n.visualizacoes}</td>
                <td>${dataFmt}</td>
                <td>
                    <div class="cell-actions">
                        <button class="btn-admin btn-admin-outline btn-admin-sm" onclick="editarNoticia(${n.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="confirmarExclusaoNoticia(${n.id}, '${escapeHtml(n.titulo)}')" title="Excluir">
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
                <p>Gestão de Notícias</p>
                <h2>Notícias <small style="font-size:0.8rem;color:var(--air-force-blue);font-weight:600;">(${total})</small></h2>
            </div>
            <div>
                <button class="btn-admin btn-admin-primary" onclick="abrirModalNoticia()">
                    <i class="fas fa-plus"></i> Nova Notícia
                </button>
            </div>
        </header>
        <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Categoria</th>
                        <th>Autor</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Criada em</th>
                        <th style="width:100px;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhas || '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--air-force-blue);font-weight:600;">Nenhuma notícia encontrada.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

export function abrirModalNoticia(dados)

{
  const isEdit = !!dados;

  Swal.fire({
    title: isEdit ? "Editar Notícia" : "Nova Notícia",
    width: 700,
    html: `
            <form id="formNoticia" style="text-align:left;">
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Título *</label>
                    <input type="text" id="modalNTitulo" class="dash-field" value="${isEdit ? escapeHtml(dados.titulo) : ""}" placeholder="Título da notícia">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="margin-bottom:12px;">
                        <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Categoria *</label>
                        <select id="modalNCategoria" class="dash-field">
                            <option value="">Selecione...</option>
                            ${CATEGORIAS_NOTICIAS.map(
                              (c) =>
                                `<option value="${c}" ${isEdit && dados.categoria === c ? "selected" : ""}>${c}</option>`,
                            ).join("")}
                        </select>
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Fonte</label>
                        <input type="text" id="modalNFonte" class="dash-field" value="${isEdit ? escapeHtml(dados.fonte || "") : ""}" placeholder="Ex: Agência Brasil">
                    </div>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Resumo *</label>
                    <textarea id="modalNResumo" class="dash-field" rows="2" placeholder="Breve descrição (máx. 500 caracteres)">${isEdit ? escapeHtml(dados.resumo) : ""}</textarea>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Conteúdo *</label>
                    <textarea id="modalNConteudo" class="dash-field" rows="6" placeholder="Texto completo da notícia...">${isEdit ? escapeHtml(dados.conteudo) : ""}</textarea>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Imagem de Capa</label>
                    <div id="previewNewsImagem" style="${isEdit && dados.imagem_capa ? "display:block;margin-bottom:8px;" : "display:none;margin-bottom:8px;"}">
                        ${isEdit && dados.imagem_capa ? `<img src="${escapeHtml(dados.imagem_capa)}" style="max-width:100%;max-height:120px;border-radius:8px;object-fit:cover;">` : ""}
                    </div>
                    <button type="button" id="btnSelecionarImagem" class="btn-admin btn-admin-outline" style="width:100%;padding:10px;">
                        <i class="fas fa-image"></i> ${isEdit && dados.imagem_capa ? "Trocar Imagem" : "Selecionar Imagem"}
                    </button>
                    <input type="hidden" id="hiddenNewsImagem" value="${isEdit ? escapeHtml(dados.imagem_capa || "") : ""}">
                    <small style="display:block;margin-top:4px;color:var(--air-force-blue);font-size:0.7rem;">
                        <i class="fas fa-info-circle"></i> Clique para fazer upload, arrastar, colar (Ctrl+V) ou informar URL
                    </small>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                    <div>
                        <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Status</label>
                        <select id="modalNStatus" class="dash-field">
                            <option value="0" ${isEdit && Number(dados.status) === 0 ? "selected" : ""}>Rascunho</option>
                            <option value="1" ${!isEdit || Number(dados.status) === 1 ? "selected" : ""}>Publicado</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-weight:700;font-size:0.8rem;color:var(--dark-teal);display:block;margin-bottom:4px;">Destaque</label>
                        <select id="modalNDestaque" class="dash-field">
                            <option value="0" ${!isEdit || Number(dados.destaque) === 0 ? "selected" : ""}>Normal</option>
                            <option value="1" ${isEdit && Number(dados.destaque) === 1 ? "selected" : ""}>⭐ Destaque</option>
                        </select>
                    </div>
                    <div style="display:flex;align-items:flex-end;padding-bottom:12px;">
                        ${isEdit ? `<span style="font-size:0.75rem;color:var(--air-force-blue);">${dados.visualizacoes} visualizações</span>` : ""}
                    </div>
                </div>
            </form>
        `,
    confirmButtonText: isEdit ? "Salvar" : "Criar",
    confirmButtonColor: "#598392",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#aec3b0",

    didOpen: () => {
      const btnImg = document.getElementById("btnSelecionarImagem");

      if (btnImg)
        btnImg.onclick = (e) => {
          e.preventDefault();
          abrirModalNewsImagem();
        };

    },
    preConfirm: async () => {
      const titulo = document.getElementById("modalNTitulo").value.trim();
      const resumo = document.getElementById("modalNResumo").value.trim();
      const conteudo = document.getElementById("modalNConteudo").value.trim();
      const categoria = document.getElementById("modalNCategoria").value;

      if (!titulo)
      {
        Swal.showValidationMessage("Título é obrigatório");
        return false;
      }

      if (!resumo)
      {
        Swal.showValidationMessage("Resumo é obrigatório");
        return false;
      }

      if (!conteudo)
      {
        Swal.showValidationMessage("Conteúdo é obrigatório");
        return false;
      }

      if (!categoria)
      {
        Swal.showValidationMessage("Categoria é obrigatória");
        return false;
      }

      const payload = {
        titulo,
        resumo,
        conteudo,
        categoria,
        imagem_capa: document.getElementById("hiddenNewsImagem").value.trim(),
        fonte: document.getElementById("modalNFonte").value.trim(),
        status: parseInt(document.getElementById("modalNStatus").value),
        destaque: parseInt(document.getElementById("modalNDestaque").value),
      };

      if (isEdit) payload.id = dados.id;

      try
      {
        const res = await fetch(`${ADMIN_API}/noticias-admin.php`, {
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
        title: isEdit ? "Notícia atualizada!" : "Notícia criada!",
        timer: 1500,
        showConfirmButton: false,
      });
      carregarNoticias();
    }

  });
}

export function editarNoticia(id)

{
  const n = noticiasData.find((n) => n.id === id);

  if (!n) return;
  abrirModalNoticia(n);
}

export function confirmarExclusaoNoticia(id, titulo)

{
  Swal.fire({
    title: "Excluir notícia?",
    text: `Tem certeza que deseja excluir "${titulo}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    confirmButtonColor: "#c62828",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#598392",

    preConfirm: async () => {
      try
      {
        const res = await fetch(`${ADMIN_API}/noticias-admin.php`, {
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
        title: "Notícia excluída!",
        timer: 1500,
        showConfirmButton: false,
      });
      carregarNoticias();
    }

  });
}
