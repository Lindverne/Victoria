const inicializarTextoCircular = () =>
{
  const elementos = document.querySelectorAll(".circular-text");

  elementos.forEach((elemento) =>
  {
    const texto = elemento.dataset.text || elemento.textContent.trim();

    if (!texto)
    {
      return;
    }

    const tamanho = parseInt(elemento.dataset.size, 10) || 160;
    const tamanhoFonte = parseInt(elemento.dataset.fontSize, 10) || 16;
    const duracao = parseInt(elemento.dataset.speed, 10) || 15;
    const direcao = elemento.dataset.direction || "clockwise";
    const preencher = elemento.dataset.fill !== "false";

    elemento.style.width = tamanho + "px";
    elemento.style.height = tamanho + "px";
    elemento.style.fontSize = tamanhoFonte + "px";

    const ring = elemento.querySelector(".circular-text__ring");
    const tilt = elemento.querySelector(".circular-text__tilt");

    if (!ring)
    {
      return;
    }

    ring.innerHTML = "";

    const letras = Array.from(texto);
    const quantidade = letras.length;
    const angulos = [];

    if (preencher)
    {
      for (let i = 0; i < quantidade; i++)
      {
        angulos.push((360 / quantidade) * i);
      }
    }

    letras.forEach((letra, indice) =>
    {
      const span = document.createElement("span");
      span.className = "circular-text__letter";
      const angulo = angulos[indice] ?? 0;
      span.style.transform = "rotate(" + angulo + "deg)";
      span.textContent = letra;
      ring.appendChild(span);
    });

    elemento.setAttribute("data-settled", "true");

    let anguloAtual = 0;
    let velocidade = (360 / duracao) * (direcao === "counterclockwise" ? -1 : 1);
    let lancamento = 0;
    let pairando = false;
    let arrastando = false;
    let anguloInicial = null;
    let amostras = [];

    const aplicarInclinacao = (nx, ny) =>
    {
      if (!tilt)
      {
        return;
      }

      tilt.style.transform = "rotateX(" + (-ny * 20) + "deg) rotateY(" + (nx * 20) + "deg)";
    };

    const resetarInclinacao = () =>
    {
      if (!tilt)
      {
        return;
      }

      tilt.style.transform = "";
    };

    const animar = () =>
    {
      if (!arrastando)
      {
        lancamento *= Math.exp(-0.016 / 0.7);

        if (Math.abs(lancamento) < 1)
        {
          lancamento = 0;
        }

        const velocidadeAtual = velocidade * (pairando ? 4 : 1) + lancamento;
        anguloAtual = (anguloAtual + velocidadeAtual * 0.016) % 360;
        ring.style.transform = "rotate(" + anguloAtual + "deg)";
      }

      requestAnimationFrame(animar);
    };

    requestAnimationFrame(animar);

    elemento.addEventListener("pointerenter", () =>
    {
      pairando = true;
    });

    elemento.addEventListener("pointerleave", () =>
    {
      pairando = false;
      resetarInclinacao();
    });

    elemento.addEventListener("pointermove", (e) =>
    {
      if (arrastando)
      {
        return;
      }

      const retangulo = elemento.getBoundingClientRect();
      const nx = ((e.clientX - retangulo.left) / retangulo.width) * 2 - 1;
      const ny = ((e.clientY - retangulo.top) / retangulo.height) * 2 - 1;
      aplicarInclinacao(nx, ny);
    });

    elemento.addEventListener("pointerdown", (e) =>
    {
      if (e.button !== 0)
      {
        return;
      }

      arrastando = true;
      lancamento = 0;
      anguloInicial = null;
      amostras = [[e.timeStamp, 0]];
    });

    elemento.addEventListener("pointerup", () =>
    {
      if (!arrastando)
      {
        return;
      }

      arrastando = false;

      if (amostras.length > 1)
      {
        const inicio = amostras[0];
        const fim = amostras[amostras.length - 1];
        const decorrido = fim[0] - inicio[0];

        if (decorrido > 0)
        {
          const velocidadeArrasto = ((fim[1] - inicio[1]) / decorrido) * 1000;
          lancamento = Math.max(-1440, Math.min(1440, velocidadeArrasto));
        }
      }
    });

    elemento.addEventListener("pointercancel", () =>
    {
      arrastando = false;
    });

    elemento.addEventListener("pointermove", (e) =>
    {
      if (!arrastando)
      {
        return;
      }

      const retangulo = elemento.getBoundingClientRect();
      const dx = e.clientX - (retangulo.left + retangulo.width / 2);
      const dy = e.clientY - (retangulo.top + retangulo.height / 2);

      if (Math.hypot(dx, dy) < retangulo.width * 0.06)
      {
        return;
      }

      const angulo = (Math.atan2(dy, dx) * 180) / Math.PI;

      if (anguloInicial !== null)
      {
        let delta = angulo - anguloInicial;

        if (delta > 180)
        {
          delta -= 360;
        }

        if (delta < -180)
        {
          delta += 360;
        }

        anguloAtual = (anguloAtual + delta) % 360;
        ring.style.transform = "rotate(" + anguloAtual + "deg)";
        amostras.push([e.timeStamp, anguloAtual]);

        while (amostras.length > 2 && e.timeStamp - amostras[0][0] > 100)
        {
          amostras.shift();
        }
      }

      anguloInicial = angulo;
    });
  });
};

if (document.readyState === "loading")
{
  document.addEventListener("DOMContentLoaded", inicializarTextoCircular);
}
else
{
  inicializarTextoCircular();
}
