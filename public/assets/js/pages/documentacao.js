const docActions = {
  copy: function (path) {
    const fullUrl = window.location.origin + "/" + path;
    navigator.clipboard.writeText(fullUrl).then(() => {
      Swal.fire({
        title: "Link Copiado!",
        text: "O link do PDF foi copiado com sucesso.",
        icon: "success",
        confirmButtonColor: "var(--cor-botao)",
        timer: 2000,
        timerProgressBar: true,
      });
    });
  },
  share: function (name) {

    if (navigator.share)
    {
      navigator.share({
        title: "Victória - Documentação",
        text: `Confira o fichamento: ${name}`,
        url: window.location.href,
      });
    }

  },
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("doc-container");
  const reveals = document.querySelectorAll(".reveal");

  const fichamentos = [
    "Pesquisa de Sensores Hídricos",
    "Estudo de Protocolos IoT",
    "Análise de Mercado e Telemetria",
    "Sustentabilidade e Reuso",
    "Arquitetura de Banco de Dados",
    "Interface e UX Design",
  ];

  fichamentos.forEach((titulo, index) => {
    const num = index + 1;
    container.innerHTML += `
            <div class="doc-card">
                <div class="doc-icon"><i class="fa-solid fa-file-pdf"></i></div>
                <h3>Ficha 0${num}</h3>
                <p>${titulo}</p>
                <a href="../assets/docs/ficha0${num}.pdf" download class="btn-install">
                    <i class="fa-solid fa-download"></i> Instalar PDF
                </a>
                <div class="doc-actions-row">
                    <a href="../assets/docs/ficha0${num}.pdf" target="_blank" class="btn-sec" title="Visualizar">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <button onclick="docActions.copy('assets/docs/ficha0${num}.pdf')" class="btn-sec" title="Copiar Link">
                        <i class="fa-solid fa-link"></i>
                    </button>
                    <button onclick="docActions.share('Ficha 0${num}')" class="btn-sec" title="Compartilhar">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </div>
        `;
  });

  const checkReveal = () => {
    reveals.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible)
      {
        element.addClass
          ? element.addClass("active")
          : element.classList.add("active");
      }

    });
  };

  setTimeout(checkReveal, 100);

  window.addEventListener("scroll", checkReveal);
});
