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
