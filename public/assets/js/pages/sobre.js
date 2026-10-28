document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".perfil-futuro").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const card = link.closest(".team-card");
      const foto = card ? card.querySelector("img") : null;
      const nome = link.dataset.nome;
      const rede = link.dataset.rede;

      let titulo = "";
      let texto = "";
      let url = null;

      if (nome === "Guilherme Augusto") {
        if (rede === "GitHub") {
          titulo = "- GitHub do Guilherme - <br> Em breve!";
          texto = "O Guilherme ainda não está no GitHub, mas futuramente ele vai estar por lá!";
        } else {
          titulo = "- LinkedIn do Guilherme - <br> Em breve!";
          texto = "O Guilherme ainda não está no LinkedIn, mas futuramente ele vai estar por lá!";
        }
      }

      else if (nome === "Heitor Riquena Cirilo Muniz") {
        if (rede === "GitHub") {
          titulo = "- GitHub do Heitor - <br> Em breve!";
          texto = "O Heitor ainda não está no GitHub, mas futuramente ele vai estar por lá!";
        } else {
          titulo = "- LinkedIn do Heitor - <br> Em breve!";
          texto = "O Heitor ainda não está no LinkedIn, mas futuramente ele vai estar por lá!";
        }
      }

      else if (nome === "João Pedro") {
        if (rede === "GitHub") {
          titulo = "- GitHub do João - <br> Em breve!";
          texto = "O João ainda não está no GitHub, mas futuramente ele vai estar por lá!";
        } else {
          titulo = "- LinkedIn do João - <br> Em breve!";
          texto = "O João ainda não está no LinkedIn, mas futuramente ele vai estar por lá!";
        }
      }

      else if (nome === "Julio Cesar Borges Leandro") {
        if (rede === "GitHub") {
          url = "https://github.com/julio3323";
        } else {
          titulo = "- LinkedIn do Julio - <br> Em breve!";
          texto = "O Julio ainda não está no LinkedIn, mas futuramente ele vai estar por lá!";
        }
      }

      else if (nome === "Maria Isabella") {
        if (rede === "GitHub") {
          titulo = "- GitHub da Maria - <br> Em breve!";;
          texto = "A Maria ainda não está no GitHub, mas futuramente ela vai estar por lá!";
        } else {
          titulo = "- LinkedIn da Maria - <br> Em breve!";
          texto = "A Maria ainda não está no LinkedIn, mas futuramente ela vai estar por lá!";
        }
      }

      else if (nome === "Matheus Guedes") {
        if (rede === "GitHub") {
          url = "https://github.com/Lindverne";
        } else {
          titulo = "- LinkedIn do Guedes - <br> Em breve!";
          texto = "O Matheus Guedes ainda não está no LinkedIn, mas futuramente ele vai estar por lá!";
        }
      }

      else if (nome === "Matheus Marangoni") {
        if (rede === "GitHub") {
          url = "https://github.com/matheus-marangoni-baptista";
        } else {
          titulo = "- LinkedIn do Marangoni - <br> Em breve!";
          texto = "O Matheus Marangoni ainda não está no LinkedIn, mas futuramente ele vai estar por lá!";
        }
      }

      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      if (titulo && texto) {
        Swal.fire({
          title: titulo,
          text: texto,
          imageUrl: foto ? foto.src : undefined,
          imageWidth: 110,
          imageAlt: nome,
          confirmButtonColor: "var(--cor-botao)",
          confirmButtonText: "Entendi!",
        });
      }
    });
  });
});