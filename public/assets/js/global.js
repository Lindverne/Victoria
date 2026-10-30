import { Auth } from "./auth.js";
import { initHeader } from "./components/header.js";
import { initAnimations } from "./utils/animacoes.js";
import { initEntryAnimation } from "./utils/animacao-entrada.js";
import { aplicarTemaInicial, initTema } from "./utils/tema.js";
import { urlImagemSegura } from "./utils/url-segura.js";

function exibirBannerConsole()
{
  const caminhoBase = window.location.pathname.includes("/pages/")
    ? "../assets/img/"
    : "assets/img/";

  const carregarImagem = async (caminho) => {
    const resposta = await fetch(caminho);
    const blob = await resposta.blob();

    return new Promise((resolver) =>
    {
      const leitor = new FileReader();

      leitor.onload = () => {
        resolver(leitor.result);
      };

      leitor.readAsDataURL(blob);
    });
  };

  const desenharImagem = (dataUrl, largura, altura) => {
    console.log(
      "%c ",
      `background-image: url(${dataUrl}); background-size: contain; background-repeat: no-repeat; padding: 0 0 ${altura}px ${largura}px;`,
    );
  };

  const exibirBanner = async () => {
    try
    {
      const devtools = await carregarImagem(`${caminhoBase}extras/devtools.png`);
      desenharImagem(devtools, 275, 275);

      console.log(
        "%c 💧 Victória - Versão 0.9.7 - Rem",
        "color: #eff6e0; font-weight: bold; font-size: 13px; padding-left: 3px; letter-spacing: 0.5px;",
      );
    }

    catch (erroBanner)
    {
      console.log(
        "%cVictória - Versão 0.9.7 - Rem",
        "color: #eff6e0; font-weight: bold; font-size: 13px;",
      );
    }
  };

  exibirBanner();
}

exibirBannerConsole();

export async function apiFetch(input, init = {})

{
  try
  {
    const url =
      typeof input === "string" || input instanceof URL
        ? String(input)
        : (input?.url ?? "");
    const method = (init.method ?? input?.method ?? "GET").toUpperCase();
    const sameOrigin =
      url.startsWith("/") ||
      url.startsWith("./") ||
      url.startsWith("../") ||
      new URL(url, window.location.href).origin === window.location.origin;

    if (method !== "GET" && sameOrigin)
    {
      const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      if (token)
      {
        init.headers = new Headers(init.headers ?? {});

        if (!init.headers.has("X-CSRF-Token"))
        {
          init.headers.set("X-CSRF-Token", token);
        }

      }

    }

  }

  catch (e)
  {
  }

  return fetch(input, init);
}

function setupCsrfFetchLegacy()
{
  const originalFetch = window.fetch.bind(window);

  window.fetch = function (input, init = {}) {
    try
    {
      const url =
        typeof input === "string" || input instanceof URL
          ? String(input)
          : (input?.url ?? "");
      const method = (init.method ?? input?.method ?? "GET").toUpperCase();
      const sameOrigin =
        url.startsWith("/") ||
        url.startsWith("./") ||
        url.startsWith("../") ||
        new URL(url, window.location.href).origin === window.location.origin;

      if (method !== "GET" && sameOrigin)
      {
        const token = document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content");

        if (token)
        {
          init.headers = new Headers(init.headers ?? {});

          if (!init.headers.has("X-CSRF-Token"))
          {
            init.headers.set("X-CSRF-Token", token);
          }

        }

      }

    }

    catch (e)
    {
    }

    return originalFetch(input, init);
  };

}

setupCsrfFetchLegacy();

(function setupSwalTheme() {

  if (typeof Swal === "undefined") return;
  const origFire = Swal.fire.bind(Swal);
  Swal.fire = function (options) {

    if (typeof options === "string")
    {
      return origFire(options, arguments[1], arguments[2]);
    }

    if (typeof options === "object" && options !== null)
    {
      const defaults = {
        background: "rgba(255, 255, 255, 0.95)",
        color: "var(--ink-black)",
        confirmButtonColor: "var(--cor-botao)",
        cancelButtonColor: "#8a9a8b",
        customClass: {
          container: "swal-container-custom",
          popup: "swal-popup-custom",
          title: "swal-title-custom",
        },
      };

      if (!options.toast)
      {
        defaults.backdrop = "rgba(0, 0, 0, 0.5)";
      }

      return origFire(Object.assign({}, defaults, options));
    }

    return origFire(options);
  };

})();

function mostrarAlerta(titulo, texto, icone = "info")
{
  const iconColors = {
    success: "var(--air-force-blue)",
    error: "#c44545",
    warning: "#e8a838",
    info: "var(--texto-secundario)",
  };

  if (typeof Swal === "undefined")
  {
    return;
  }

  Swal.fire({
    title: titulo,
    text: texto,
    icon: icone,
    iconColor: iconColors[icone] ?? iconColors.info,
    didOpen: (popup) => {
      popup.style.zIndex = "10000";
    },
  });
}

function initRedesSociais()
{
  const baseExtras =
    (location.pathname.includes("/pages/") ? "../assets" : "assets") +
    "/img/extras/";

  const mostrarFuturo = (titulo, texto, imagem) => {
    Swal.fire({
      title: `${titulo} em breve!`,
      text: texto,
      imageUrl: baseExtras + imagem,
      imageWidth: 130,
      imageAlt: titulo,
      confirmButtonColor: "var(--cor-botao)",
      confirmButtonText: "Entendi!",
    });
  };

  document.querySelectorAll(".social-icons a[data-rede-social]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const rede = link.dataset.redeSocial;

      mostrarFuturo(
        rede,
        `Ainda não temos presença da Victória no ${rede}, mas futuramente estaremos por lá!`,
        link.dataset.imagem,
      );
    });
  });

  document
    .querySelectorAll(".botao-social-card.google, .botao-social-card.microsoft")
    .forEach((botao) => {
      botao.addEventListener("click", () => {
        const provedor = botao.classList.contains("google")
          ? "Google"
          : "Microsoft 365";

        mostrarFuturo(
          provedor,
          `Ainda não temos login com ${provedor}, mas essa função vai estar disponível em breve!`,
          botao.classList.contains("google") ? "google.png" : "microsoft.png",
        );
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  aplicarTemaInicial();
  initTema();
  initHeader();
  initAnimations();
  initEntryAnimation();
  initRedesSociais();

  const btnVoltarTopo = document.getElementById("backtotop");
  const rodapeAncora = document.querySelector(".floating-footer");

  if (btnVoltarTopo)
  {
    const bottomPadrao = 80;
    const atualizarVoltarTopo = () => {
      const visivel = window.scrollY > 350;
      btnVoltarTopo.classList.toggle("show", visivel);

      if (!visivel || !rodapeAncora) return;
      const f = rodapeAncora.getBoundingClientRect();

      if (f.top > 0 && f.top < window.innerHeight)
      {
        const novoBottom = Math.max(16, window.innerHeight - f.top + 20);
        btnVoltarTopo.style.bottom = novoBottom + "px";
      }
      else
      {
        btnVoltarTopo.style.bottom = bottomPadrao + "px";
      }

    };

    atualizarVoltarTopo();
    document.addEventListener("scroll", atualizarVoltarTopo, { passive: true });
    window.addEventListener("resize", atualizarVoltarTopo);
    btnVoltarTopo.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const modalCrop = document.getElementById("modal-crop-foto");
  const dropzone = document.getElementById("dropzone-avatar");
  const inputFoto = document.getElementById("input-foto-oculto");
  const imagemParaCortar = document.getElementById("imagem-para-cortar");
  const cropperContainer = document.querySelector(".cropper-container");
  const btnSalvarCrop = document.getElementById("btn-salvar-crop");
  const btnCancelarModal = document.getElementById("btn-cancelar-crop");
  const btnFecharModalX = document.getElementById("btn-fechar-modal-crop");

  let cropperInstance = null;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {

        if (entry.isIntersecting)
        {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }

      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(".container-box, .section-header, .spec-card, .reveal")
    .forEach((el) => {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });

  if (dropzone && inputFoto)
  {
    dropzone.addEventListener("click", () => inputFoto.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.style.backgroundColor = "rgba(89, 131, 146, 0.15)";
      dropzone.style.borderColor = "var(--soft-periwinkle)";
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.style.backgroundColor = "";
      dropzone.style.borderColor = "";
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.style.backgroundColor = "";
      dropzone.style.borderColor = "";

      const files = e.dataTransfer.files;

      if (files.length > 0 && files[0].type.startsWith("image/"))
      {
        processarArquivoComCropper(files[0]);
      }
      else
      {
        mostrarAlerta(
          "Formato inválido",
          "Por favor, arraste uma imagem válida.",
          "error",
        );
      }

    });

    inputFoto.addEventListener("change", (e) => {

      if (e.target.files.length > 0)
      {
        processarArquivoComCropper(e.target.files[0]);
      }

    });
  }

  document.addEventListener("paste", (e) => {

    if (!modalCrop || modalCrop.style.display === "none") return;

    const items = e.clipboardData?.items;

    if (!items) return;

    for (const item of items)
    {

      if (item.type.startsWith("image/"))
      {
        processarArquivoComCropper(item.getAsFile());
        break;
      }

    }

  });

  const urlAvatarInput = document.getElementById("urlAvatar");

  if (urlAvatarInput)
  {
    urlAvatarInput.addEventListener("change", function (e) {
      const url = e.target.value.trim();

      if (url)
      {

        if (modalCrop) modalCrop.style.display = "flex";
        inicializarCropper(url);
      }

    });
  }

  function inicializarCropper(imagemSrc)
  {

    if (cropperInstance)
    {
      cropperInstance.destroy();
      cropperInstance = null;
    }

    if (dropzone) dropzone.style.display = "none";

    if (cropperContainer) cropperContainer.style.display = "block";

    if (imagemParaCortar)
    {

      definirSrcSeguro(imagemParaCortar, imagemSrc);

      cropperInstance = new Cropper(imagemParaCortar, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 0.85,
        responsive: true,
        restore: true,
        guides: false,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        background: false,
        modal: false,
        ready() {
          const container = document
            .getElementById("imagem-para-cortar")
            ?.closest(".cropper-container");

          if (container) container.classList.add("cropper-circle");
        },
      });
    }

    if (btnSalvarCrop) btnSalvarCrop.style.display = "inline-block";
  }

  function processarArquivoComCropper(file)
  {

    if (!file.type.startsWith("image/"))
    {
      mostrarAlerta(
        "Formato inválido",
        "Por favor, selecione um arquivo de imagem.",
        "error",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {

      if (modalCrop) modalCrop.style.display = "flex";
      inicializarCropper(e.target.result);
    };

    reader.readAsDataURL(file);
  }

  function fecharModalCrop()
  {

    if (modalCrop) modalCrop.style.display = "none";

    if (cropperInstance)
    {
      cropperInstance.destroy();
      cropperInstance = null;
    }

    if (dropzone)
    {
      dropzone.style.setProperty("display", "flex", "important");
      dropzone.style.setProperty("flex-direction", "column", "important");
    }

    if (cropperContainer) cropperContainer.style.display = "none";

    if (inputFoto) inputFoto.value = "";

    if (btnSalvarCrop) btnSalvarCrop.style.display = "none";

    const urlInput = document.getElementById("urlAvatar");

    if (urlInput) urlInput.value = "";
  }

  if (btnSalvarCrop)
  {
    btnSalvarCrop.addEventListener("click", async () => {

      if (!cropperInstance)
      {
        mostrarAlerta(
          "Nenhuma imagem",
          "Selecione uma imagem antes de salvar.",
          "error",
        );
        return;
      }

      const textoOriginal = btnSalvarCrop.innerHTML;
      btnSalvarCrop.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Salvando...';
      btnSalvarCrop.disabled = true;

      try
      {
        const canvas = cropperInstance.getCroppedCanvas({
          width: 600,
          height: 600,
          fillColor: "#fff",
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        });

        const avatarData = canvas.toDataURL("image/jpeg", 0.7);
        const result = await Auth.updateAvatar(avatarData);

        if (result.success)
        {

          if (typeof carregarDadosUsuario === "function")
          {
            carregarDadosUsuario();
          }

          else if (typeof configurarDadosUsuario === "function")
          {
            configurarDadosUsuario();
          }

          const modalFoto = document.getElementById("modalFotoPerfil");

          if (modalFoto)
          {
            modalFoto.innerHTML = `<img src="${avatarData}" alt="Foto de perfil">`;
            modalFoto.style.background = "transparent";
          }

          const navAvatar = document.querySelector(
            ".nav-avatar-img, .user-avatar img",
          );

          if (navAvatar && urlImagemSegura(avatarData))
          {
            navAvatar.src = avatarData;
          }

          Swal.fire({
            title: "Foto atualizada",
            text: "Sua foto de perfil foi salva com sucesso.",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          fecharModalCrop();
        }
        else
        {
          mostrarAlerta("Erro ao salvar", result.message, "error");
        }

      }

      catch (err)
      {
        mostrarAlerta(
          "Erro inesperado",
          "Não foi possível salvar a imagem.",
          "error",
        );
      }
      finally
      {
        btnSalvarCrop.innerHTML = textoOriginal;
        btnSalvarCrop.disabled = false;
      }

    });
  }

  if (btnCancelarModal)
    btnCancelarModal.addEventListener("click", fecharModalCrop);

  if (btnFecharModalX)
    btnFecharModalX.addEventListener("click", fecharModalCrop);

  if ("serviceWorker" in navigator)
  {
    window.addEventListener("load", () => {
      const appRoot = window.location.pathname.replace(
        /(pages\/)?[^\/]+\.php$/,
        "",
      );
      navigator.serviceWorker
        .register(`${appRoot}sw.js`)
        .catch(() => {});
    });
  }

  document.addEventListener("click", (e) => {

    if (e.target.closest(".btn-editar-foto") && modalCrop)
    {
      modalCrop.style.display = "flex";
    }

    const toggleBtn = e.target.closest(".toggle-password");

    if (toggleBtn)
    {
      const input = toggleBtn.previousElementSibling;

      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggleBtn.classList.toggle("fa-eye", !isPassword);
      toggleBtn.classList.toggle("fa-eye-slash", isPassword);
    }

  });
});
