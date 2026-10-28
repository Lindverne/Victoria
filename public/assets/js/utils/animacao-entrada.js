export function initEntryAnimation()

{
  const path = window.location.pathname.toLowerCase();

  const ehIndex =
    path.includes("index.php") || path === "/victoria/public/" || path === "/";

  if (!ehIndex) return;

  if (sessionStorage.getItem("victoria_splash_seen")) return;

  const base = getAssetsPath();

  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href = `${base}/assets/css/components/animacao-entrada.css`;
  document.head.appendChild(cssLink);

  const overlay = document.createElement("div");
  overlay.className = "victoria-splash";
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:var(--fundo-principal);overflow:hidden;";
  overlay.innerHTML = `
        <div class="splash-particles" id="splashParticles"></div>
        <div class="splash-ring splash-ring--spinner"></div>
        <div class="splash-ring splash-ring--glow"></div>
        <div class="splash-logo-wrapper">
            <img src="${base}/assets/img/logos/logo-victoria.webp"
                 alt="Victória"
                 class="splash-logo-img"
                 onerror="this.style.display='none'">
            <div class="splash-title">Projeto Victória</div>
            <div class="splash-subtitle">Monitoramento Inteligente</div>
        </div>
    `;

  document.body.appendChild(overlay);

  const particlesContainer = overlay.querySelector("#splashParticles");

  if (particlesContainer)
  {

    for (let i = 0; i < 100; i++)
    {
      const p = document.createElement("div");
      p.className = "splash-particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.bottom = "0";
      p.style.animationDelay = Math.random() * 3 + "s";
      p.style.animationDuration = 2.5 + Math.random() * 2 + "s";
      p.style.width = p.style.height = 2 + Math.random() * 7 + "px";
      p.style.setProperty("--sway-x", Math.random() * 50 - 25 + "px");
      p.style.background =
        Math.random() > 0.6
          ? "rgba(174, 195, 176, 0.6)"
          : "var(--air-force-blue, #598392)";
      p.style.opacity = "0";
      particlesContainer.appendChild(p);
    }

  }

  const duracao = 2600;

  setTimeout(() => {
    document.body.classList.add("victoria-ready");

    overlay.classList.add("victoria-splash--hidden");
    sessionStorage.setItem("victoria_splash_seen", "1");

    setTimeout(() => {
      overlay.remove();
    }, 900);
  }, duracao);
}

function getAssetsPath()
{
  return window.location.pathname.includes("/pages/") ? ".." : ".";
}
