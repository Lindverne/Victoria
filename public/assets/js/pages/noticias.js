(function () {
  "use strict";

  const API_BASE = "../../api";

  async function abrirNoticia(id)
  {
    try
    {
      const res = await fetch(`${API_BASE}/noticias/detalhe.php?id=${id}`);
      const json = await res.json();

      if (!json.success || !json.data)
      {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível carregar a notícia.",
        });
        return;
      }

      const n = json.data;

      let imgUrl = "";

      if (n.imagem_capa)
      {

        if (n.imagem_capa.startsWith("http") || n.imagem_capa.startsWith("/"))
        {
          imgUrl = n.imagem_capa;
        }
        else
        {
          imgUrl = "../assets/img/pages/noticias/" + n.imagem_capa;
        }

      }

      fetch(`${API_BASE}/noticias/visualizar.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n.id }),
      }).catch(() => {});

      let autorHtml = "";

      if (n.autor_avatar && n.autor_avatar.length > 50)
      {
        autorHtml = `<img src="${n.autor_avatar}" alt="${n.autor_nome}" class="news-modal-avatar"> ${n.autor_nome}`;
      }
      else
      {
        const inicial = n.autor_nome.charAt(0).toUpperCase();
        autorHtml = `<span class="news-modal-avatar-inicial">${inicial}</span> ${n.autor_nome}`;
      }

      const html = `
                <div class="news-modal">
                    ${
                      imgUrl
                        ? `
                    <div class="news-modal-banner">
                        <img src="${imgUrl}" alt="${n.titulo}">
                        <div class="news-modal-banner-overlay"></div>
                    </div>
                    `
                        : ""
                    }

                    <div class="news-modal-body">
                        <div class="news-modal-meta">
                            <span class="news-modal-category">${n.categoria}</span>
                            <span class="news-modal-meta-item">${autorHtml}</span>
                            <span class="news-modal-date"><i class="far fa-calendar-alt"></i> ${n.data}</span>
                        </div>
                        <h2 class="news-modal-title">${n.titulo}</h2>
                        ${n.resumo ? `<p class="news-modal-resumo">${n.resumo}</p>` : ""}
                        <hr class="news-modal-divider">
                        <div class="news-modal-conteudo">${DOMPurify.sanitize(n.conteudo, { ADD_ATTR: ["target"] })}</div>
                        ${n.fonte ? `<p class="news-modal-fonte"><i class="fas fa-source"></i> Fonte: ${n.fonte}</p>` : ""}
                    </div>
                </div>
            `;

      Swal.fire({
        html: html,
        showConfirmButton: false,
        showCloseButton: true,
        closeButtonHtml: '<i class="fas fa-times"></i>',
        width: "860px",
        padding: "0",
        background: "transparent",
        color: "var(--ink-black)",
        customClass: {
          popup: "swal-news-modal",
          closeButton: "swal-news-close",
        },
        showClass: {
          popup: "",
          backdrop: "",
        },
        hideClass: {
          popup: "",
          backdrop: "",
        },
        backdrop: true,
        didOpen: () => {
          const overlay = document.createElement("div");

          overlay.id = "news-modal-blur-overlay";
          overlay.style.cssText =
            "position: fixed !important; inset: 0 !important; z-index: 1059 !important; " +
            "background: rgba(1, 22, 30, 0.55) !important; " +
            "backdrop-filter: blur(10px) !important; " +
            "-webkit-backdrop-filter: blur(10px) !important; " +
            "pointer-events: auto !important;";

          document.body.appendChild(overlay);
          document.body.classList.add("swal2-news-open");
          document.body.style.overflow = "hidden";

          const container = document.querySelector(".swal2-container");

          if (container)
          {
            container.classList.add("swal2-container-news");
          }

          const backdrop = document.querySelector(".swal2-backdrop");

          if (backdrop)
          {
            backdrop.classList.add("swal2-backdrop-news");
            backdrop.dataset.blurOriginal = backdrop.getAttribute("style") || "";
            backdrop.setAttribute("style",
              "position: fixed !important; inset: 0 !important; display: block !important; opacity: 1 !important; " +
              "background: rgba(1, 22, 30, 0.55) !important; " +
              "backdrop-filter: blur(10px) !important; " +
              "-webkit-backdrop-filter: blur(10px) !important;"
            );
          }

          let aplicandoBlur = false;
          let blurObserver = null;

          const aplicarBlur = () => {
            if (aplicandoBlur) return;
            aplicandoBlur = true;

            const b = document.querySelector(".swal2-backdrop");

            if (b && b.classList.contains("swal2-backdrop-news"))
            {
              b.setAttribute("style",
                "position: fixed !important; inset: 0 !important; display: block !important; opacity: 1 !important; " +
                "background: rgba(1, 22, 30, 0.55) !important; " +
                "backdrop-filter: blur(10px) !important; " +
                "-webkit-backdrop-filter: blur(10px) !important;"
              );
            }

            aplicandoBlur = false;
          };

          aplicarBlur();
          setTimeout(aplicarBlur, 0);
          setTimeout(aplicarBlur, 50);
          setTimeout(aplicarBlur, 150);

          blurObserver = new MutationObserver(() => {
            const bb = document.querySelector(".swal2-backdrop");
            if (bb && bb.classList.contains("swal2-backdrop-news"))
            {
              bb.setAttribute("style",
                "position: fixed !important; inset: 0 !important; display: block !important; opacity: 1 !important; " +
                "background: rgba(1, 22, 30, 0.55) !important; " +
                "backdrop-filter: blur(10px) !important; " +
                "-webkit-backdrop-filter: blur(10px) !important;"
              );
            }
          });

          if (backdrop) blurObserver.observe(backdrop, { attributes: true });

          window.blurObserverNews = blurObserver;

          const img = document.querySelector(".news-modal-banner img");

          if (img)
          {
            img.style.opacity = "0";
            img.onload = () => {
              img.style.opacity = "1";
            };

            if (img.complete) img.style.opacity = "1";
          }
        },
        didClose: () => {
          const observer = window.blurObserverNews;

          if (observer) { observer.disconnect(); window.blurObserverNews = null; }

          const overlay = document.getElementById("news-modal-blur-overlay");

          if (overlay) overlay.remove();

          document.body.classList.remove("swal2-news-open");
          document.body.style.overflow = "";

          const container = document.querySelector(".swal2-container");

          if (container) container.classList.remove("swal2-container-news");

          const backdrop = document.querySelector(".swal2-backdrop");

          if (backdrop)
          {
            backdrop.classList.remove("swal2-backdrop-news");
          }

          if (backdrop && backdrop.dataset.blurOriginal !== undefined)
          {
            backdrop.setAttribute("style", backdrop.dataset.blurOriginal);
            delete backdrop.dataset.blurOriginal;
          }
        },
      });
    }

    catch (err)
    {
      Swal.fire({
        icon: "error",
        title: "Erro de conexão",
        text: "Não foi possível carregar a notícia. Verifique sua conexão.",
      });
    }

  }

  document.addEventListener("click", function (e) {
    let target = e.target.closest("[data-id]");

    if (!target) return;

    if (
      !target.classList.contains("news-latest-item") &&
      !target.classList.contains("news-featured-card")
    )
      return;

    if (e.target.closest("a")) return;

    const id = parseInt(target.dataset.id, 10);

    if (!id) return;

    e.preventDefault();
    abrirNoticia(id);
  });
})();
