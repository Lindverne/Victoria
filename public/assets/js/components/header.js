import { Auth } from "../auth.js";

export function initHeader()

{
  const btnLoginNav = document.getElementById("btn-login-nav");
  const wrapperUsuario = document.getElementById("wrapper-usuario-logado");

  if (Auth.isAuthenticated())
  {

    if (btnLoginNav) btnLoginNav.classList.add("nav-hidden");

    if (wrapperUsuario) wrapperUsuario.classList.remove("nav-hidden");

    configurarDadosUsuario();
    sincronizarAuthColuna();

    Auth.checkSession().then((sessionOk) => {

      if (!sessionOk)
      {
        Auth.clearLocalSession(false);
        location.reload();
      }

    });
  }

  else
  {

    if (btnLoginNav) btnLoginNav.classList.remove("nav-hidden");

    if (wrapperUsuario) wrapperUsuario.classList.add("nav-hidden");

    sincronizarAuthColuna();
  }

  document.querySelectorAll(".nav-item.has-dropdown").forEach((item) => {
    const menu = item.querySelector(".mega-menu-wrapper");

    if (!menu) return;

    let timeout;

    item.onmouseenter = () => {

      if (window.innerWidth <= 992) return;
      clearTimeout(timeout);
      menu.style.display = "block";
      void menu.offsetWidth;
      menu.classList.add("is-visible");
    };

    item.onmouseleave = () => {

      if (window.innerWidth <= 992) return;
      timeout = setTimeout(() => {
        menu.classList.remove("is-visible");
        setTimeout(() => {

          if (!menu.classList.contains("is-visible"))
          {
            menu.style.display = "none";
          }

        }, 300);
      }, 200);
    };

  });

  const megaMenuTrigger = document.getElementById("mega-menu-trigger");
  const megaMenu = document.getElementById("mega-menu-plataforma");
  const megaMenuItems = megaMenu?.querySelectorAll('[role="menuitem"]');

  function openMegaMenu()
  {
    if (!megaMenu || window.innerWidth <= 992) return;
    megaMenu.hidden = false;
    megaMenu.classList.add("is-visible");
    megaMenuTrigger?.setAttribute("aria-expanded", "true");
    setTimeout(() => megaMenuItems?.[0]?.focus(), 0);
  }

  function closeMegaMenu()
  {
    if (!megaMenu) return;
    megaMenu.classList.remove("is-visible");
    megaMenuTrigger?.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      if (!megaMenu.classList.contains("is-visible")) megaMenu.hidden = true;
    }, 300);
  }

  function handleMegaMenuKeydown(e)
  {
    if (!megaMenuItems || megaMenuItems.length === 0) return;
    const focusedIndex = Array.from(megaMenuItems).findIndex(el => el === document.activeElement);
    let nextIndex = focusedIndex;

    switch (e.key)
    {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        nextIndex = (focusedIndex + 1) % megaMenuItems.length;
        megaMenuItems[nextIndex]?.focus();
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        nextIndex = (focusedIndex - 1 + megaMenuItems.length) % megaMenuItems.length;
        megaMenuItems[nextIndex]?.focus();
        break;
      case "Home":
        e.preventDefault();
        megaMenuItems[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        megaMenuItems[megaMenuItems.length - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        closeMegaMenu();
        megaMenuTrigger?.focus();
        break;
      case "Tab":

        if (focusedIndex === megaMenuItems.length - 1 && !e.shiftKey) {
          e.preventDefault();
          closeMegaMenu();
          megaMenuTrigger?.focus();
        } else if (focusedIndex === 0 && e.shiftKey) {
          e.preventDefault();
          closeMegaMenu();
          megaMenuTrigger?.focus();
        }

        break;
    }

  }

  const navItemDropdown = document.querySelector(".nav-item.has-dropdown");

  if (navItemDropdown && megaMenu)
  {
    let timeout;
    navItemDropdown.addEventListener("mouseenter", () => {

      if (window.innerWidth <= 992) return;
      clearTimeout(timeout);
      openMegaMenu();
    });
    navItemDropdown.addEventListener("mouseleave", () => {

      if (window.innerWidth <= 992) return;
      timeout = setTimeout(closeMegaMenu, 200);
    });
    megaMenuTrigger?.addEventListener("focus", openMegaMenu);
    megaMenu.addEventListener("focusin", () => clearTimeout(timeout));
    megaMenu.addEventListener("focusout", (e) => {

      if (!megaMenu.contains(e.relatedTarget)) {
        timeout = setTimeout(closeMegaMenu, 200);
      }

    });
    megaMenu.addEventListener("keydown", handleMegaMenuKeydown);
  }

  const burgerInput = document.getElementById("burger");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const coluna = document.getElementById("mega-coluna-kasane-teto");
  const btnLogoutColuna = document.getElementById("coluna-btn-logout");
  const btnFecharColuna = document.getElementById("btn-fechar-coluna");

  const conteudoInerte = document.querySelectorAll(
    ".nav-wrapper, .hero-section, .content-wrapper, footer"
  );

  function sincronizarAuthColuna()
  {
    const autenticado = Auth.isAuthenticated();
    const btnLogin = document.getElementById("coluna-btn-login");
    const perfil = document.getElementById("coluna-perfil");

    if (btnLogin && perfil)
    {
      if (autenticado)
      {
        btnLogin.classList.add("nav-hidden");
        perfil.classList.remove("nav-hidden");
        configurarDadosUsuario();
      }
      else
      {
        btnLogin.classList.remove("nav-hidden");
        perfil.classList.add("nav-hidden");
      }
    }
  }

  if (burgerInput && hamburgerBtn && coluna)
  {
    const overlay = document.querySelector(".nav-mobile-overlay") ?? (() => {
      const el = document.createElement("div");
      el.className = "nav-mobile-overlay";
      document.body.appendChild(el);
      return el;
    })();

    function abrirColuna()
    {
      burgerInput.checked = true;
      coluna.classList.add("aberta");
      coluna.hidden = false;
      coluna.setAttribute("aria-modal", "true");
      sincronizarAuthColuna();
      overlay.classList.add("active");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      hamburgerBtn.setAttribute("aria-label", "Fechar menu de navegação");
      const burgerIcon = document.getElementById("burger-icon");

      if (burgerIcon)
      {
        burgerIcon.classList.replace("fa-bars", "fa-times");
      }
      document.body.style.overflow = "hidden";
      conteudoInerte.forEach((el) =>
      {
        if (el !== hamburgerBtn && !el.contains(hamburgerBtn))
        {
          el.setAttribute("inert", "true");
        }
      });
      const primeiroLink = coluna.querySelector(".coluna-link, .coluna-btn-login");
      if (primeiroLink) primeiroLink.focus();
    }

    function fecharColuna()
    {
      burgerInput.checked = false;
      coluna.classList.remove("aberta");
      coluna.removeAttribute("aria-modal");
      overlay.classList.remove("active");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.setAttribute("aria-label", "Abrir menu de navegação");
      document.body.style.overflow = "";
      conteudoInerte.forEach((el) => el.removeAttribute("inert"));
      hamburgerBtn.removeAttribute("inert");
      hamburgerBtn.focus();
      const burgerIcon = document.getElementById("burger-icon");

      if (burgerIcon)
      {
        burgerIcon.classList.replace("fa-times", "fa-bars");
      }

      coluna.addEventListener("transitionend", () => {
        if (!coluna.classList.contains("aberta"))
        {
          coluna.hidden = true;
        }
      }, { once: true });
    }

    hamburgerBtn.addEventListener("click", () => {
      if (burgerInput.checked) fecharColuna(); else abrirColuna();
    });

    overlay.addEventListener("click", fecharColuna);

    if (btnFecharColuna)
    {
      btnFecharColuna.addEventListener("click", fecharColuna);
    }

    coluna.querySelectorAll(".coluna-link, .coluna-btn-login").forEach((link) => {
      link.addEventListener("click", () => {
        if (link.id === "coluna-btn-logout") return;
        fecharColuna();
      });
    });

    if (btnLogoutColuna)
    {
      btnLogoutColuna.addEventListener("click", (e) => {
        e.preventDefault();
        fecharColuna();

        Swal.fire({
          title: "Sair do sistema?",
          text: "Você precisará fazer login novamente para acessar seus dados.",
          icon: "warning",
          iconColor: "#e8a838",
          showCancelButton: true,
          confirmButtonColor: "var(--cor-botao)",
          confirmButtonText: "Sim, sair",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {

          if (!result.isConfirmed) return;

          await Auth.logout();

          Swal.fire({
            title: "Sessão encerrada",
            text: "Logout realizado com sucesso.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = window.location.pathname.includes("/pages/")
              ? "../index.php"
              : "index.php";
          });
        });
      });
    }

    window.addEventListener("resize", () => {

      if (window.innerWidth > 992 && burgerInput.checked) fecharColuna();
    });

    document.addEventListener("keydown", (e) => {

      if (e.key === "Escape" && burgerInput.checked)
      {
        fecharColuna();
      }

      if (burgerInput.checked && e.key === "Tab")
      {
        const focusaveis = coluna.querySelectorAll("a[href], button, [role='menuitem']");
        const visiveis = Array.from(focusaveis).filter(el => !el.hasAttribute("hidden") && el.offsetParent !== null);

        if (visiveis.length === 0) return;

        const indiceAtual = visiveis.indexOf(document.activeElement);

        if (e.shiftKey)
        {
          if (indiceAtual <= 0)
          {
            e.preventDefault();
            visiveis[visiveis.length - 1].focus();
          }
        }
        else
        {
          if (indiceAtual === -1 || indiceAtual === visiveis.length - 1)
          {
            e.preventDefault();
            visiveis[0].focus();
          }
        }
      }

    });
  }

  const avatarTrigger = document.getElementById("btn-avatar-nav");
  const dropdownPerfil = document.getElementById("dropdown-perfil");
  const dropdownItems = dropdownPerfil?.querySelectorAll('[role="menuitem"]');
  const fecharDropdown = document.getElementById("fechar-dropdown");

  function openDropdownPerfil(focarPrimeiro = false)
  {

    if (dropdownPerfil) {
      dropdownPerfil.classList.add("ativo");
      dropdownPerfil.hidden = false;
    }

    avatarTrigger?.setAttribute("aria-expanded", "true");

    if (focarPrimeiro)
    {
      dropdownItems?.[0]?.focus();
    }
  }

  function closeDropdownPerfil()
  {

    if (dropdownPerfil) {
      dropdownPerfil.classList.remove("ativo");
    }

    avatarTrigger?.setAttribute("aria-expanded", "false");
    setTimeout(() => { if (dropdownPerfil) dropdownPerfil.hidden = true; }, 200);
  }

  function handleDropdownKeydown(e)
  {
    if (!dropdownItems || dropdownItems.length === 0) return;
    const focusedIndex = Array.from(dropdownItems).findIndex(el => el === document.activeElement);

    if (focusedIndex === -1) return;

    let nextIndex = focusedIndex;

    switch (e.key)
    {
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (focusedIndex + 1) % dropdownItems.length;
        dropdownItems[nextIndex]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (focusedIndex - 1 + dropdownItems.length) % dropdownItems.length;
        dropdownItems[nextIndex]?.focus();
        break;
      case "Home":
        e.preventDefault();
        dropdownItems[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        dropdownItems[dropdownItems.length - 1]?.focus();
        break;
      case "Escape":
      case "Tab":
        e.preventDefault();
        closeDropdownPerfil();
        avatarTrigger?.focus();
        break;
    }

  }

  if (avatarTrigger && dropdownPerfil)
  {
    avatarTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdownPerfil.classList.contains("ativo");
      isOpen ? closeDropdownPerfil() : openDropdownPerfil();
    });

    avatarTrigger.addEventListener("keydown", (e) => {

      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        dropdownPerfil.classList.contains("ativo") ? closeDropdownPerfil() : openDropdownPerfil(true);
      } else if (e.key === "Escape") {
        closeDropdownPerfil();
      }

    });

    dropdownPerfil.addEventListener("keydown", handleDropdownKeydown);

    fecharDropdown?.addEventListener("click", closeDropdownPerfil);
    fecharDropdown?.addEventListener("keydown", (e) => {

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeDropdownPerfil();
      }

    });
  }

  document.addEventListener("keydown", (e) => {

    if (e.key !== "Escape") return;

    if (dropdownPerfil && dropdownPerfil.classList.contains("ativo"))
    {
      closeDropdownPerfil();
    }

  });

  document.addEventListener("click", (e) => {

    if (dropdownPerfil && avatarTrigger && !dropdownPerfil.contains(e.target) && !avatarTrigger.contains(e.target)) {
      closeDropdownPerfil();
    }

    if (e.target.closest("#btn-logout"))
    {
      e.preventDefault();

      Swal.fire({
        title: "Sair do sistema?",
        text: "Você precisará fazer login novamente para acessar seus dados.",
        icon: "warning",
        iconColor: "#e8a838",
        showCancelButton: true,
        confirmButtonColor: "var(--cor-botao)",
        confirmButtonText: "Sim, sair",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {

        if (!result.isConfirmed) return;

        await Auth.logout();

        Swal.fire({
          title: "Sessão encerrada",
          text: "Logout realizado com sucesso.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = window.location.pathname.includes("/pages/")
            ? "../index.php"
            : "index.php";
        });
      });
    }

  });
}

export function configurarDadosUsuario()

{
  const user = Auth.getCurrentUser();

  if (!user) return;

  const nome = user.nome || "Usuário";
  const email = user.email || "perfil@victoria.com";
  const avatar = user.avatar || "";

  const inicial = nome.charAt(0).toUpperCase();
  const temFoto = avatar && avatar.length > 50;

  let hash = 0;

  for (let i = 0; i < email.length; i++)
  {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }

  const cor = `hsl(${Math.abs(hash % 360)}, 65%, 30%)`;

  const avatarHTML = temFoto
    ? `<img src="${avatar}" alt="Foto de perfil de ${nome}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
    : `<div style="background:${cor};color:white;width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;" aria-label="Inicial do nome: ${inicial}">${inicial}</div>`;

  function montarAvatarSeguro()
  {
    const container = document.createElement("div");

    container.style.width = "100%";
    container.style.height = "100%";
    container.style.borderRadius = "50%";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.fontWeight = "bold";
    container.style.overflow = "hidden";

    if (temFoto)
    {
      const urlAvatar = String(avatar);

      if (/^https?:\/\//i.test(urlAvatar) || /^data:image\//i.test(urlAvatar))
      {
        const img = document.createElement("img");
        img.setAttribute("src", urlAvatar);
        img.setAttribute("alt", `Foto de perfil de ${nome}`);
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.borderRadius = "50%";
        img.style.objectFit = "cover";
        container.appendChild(img);
      }

      else
      {
        container.style.background = cor;
        container.style.color = "white";
        container.textContent = inicial;
        container.setAttribute("aria-label", `Inicial do nome: ${inicial}`);
      }
    }

    else
    {
      container.style.background = cor;
      container.style.color = "white";
      container.textContent = inicial;
      container.setAttribute("aria-label", `Inicial do nome: ${inicial}`);
    }

    return container;
  }

  const elementoAvatar = montarAvatarSeguro();

  const navAvatar = document.getElementById("btn-avatar-nav");

  if (navAvatar)
  {
    navAvatar.innerHTML = "";
    navAvatar.appendChild(elementoAvatar.cloneNode(true));
  }

  const containerGrande = document.querySelector(".avatar-grande-container");

  if (containerGrande)
  {
    containerGrande.innerHTML = "";
    containerGrande.appendChild(elementoAvatar.cloneNode(true));
  }

  const colunaAvatar = document.getElementById("coluna-avatar");

  if (colunaAvatar)
  {
    colunaAvatar.innerHTML = "";
    colunaAvatar.appendChild(elementoAvatar.cloneNode(true));
  }

  const emailEl = document.querySelector(".user-email");

  if (emailEl) emailEl.textContent = email;

  const saudacaoEl = document.querySelector(".saudacao-usuario");

  if (saudacaoEl) saudacaoEl.textContent = `Olá, ${nome.split(" ")[0]}!`;

  const colunaSaudacao = document.getElementById("coluna-saudacao");

  if (colunaSaudacao) colunaSaudacao.textContent = `Olá, ${nome.split(" ")[0]}!`;

  const colunaEmail = document.getElementById("coluna-email");

  if (colunaEmail) colunaEmail.textContent = email;

}
