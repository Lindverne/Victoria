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

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navListCenter = document.querySelector(".nav-list-center");

  if (hamburgerBtn && navListCenter)
  {
    const overlay = document.createElement("div");
    overlay.className = "nav-mobile-overlay";
    document.body.appendChild(overlay);

    function toggleMobileMenu()
    {
      const isOpen = hamburgerBtn.classList.toggle("active");
      navListCenter.classList.toggle("mobile-open", isOpen);
      overlay.classList.toggle("active", isOpen);
      hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    function closeMobileMenu()
    {
      hamburgerBtn.classList.remove("active");
      navListCenter.classList.remove("mobile-open");
      overlay.classList.remove("active");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    hamburgerBtn.addEventListener("click", toggleMobileMenu);
    overlay.addEventListener("click", closeMobileMenu);

    navListCenter.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const parent = link.closest(".nav-item");

        if (parent && parent.classList.contains("has-dropdown"))
        {
          e.preventDefault();
          const submenu = parent.querySelector(".mega-menu-wrapper");

          if (submenu) submenu.classList.toggle("mobile-open");
          return;
        }

        closeMobileMenu();
      });
    });

    window.addEventListener("resize", () => {

      if (window.innerWidth > 992) closeMobileMenu();
    });

    document.addEventListener("keydown", (e) => {

      if (e.key === "Escape" && navListCenter.classList.contains("mobile-open"))
      {
        closeMobileMenu();
        hamburgerBtn.focus();
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

  const adminLink = document.querySelector(".nav-item-admin");

  if (adminLink)
  {
    if (user.tipo_usuario && user.tipo_usuario === 2)
    {
      adminLink.classList.remove("nav-hidden");
    }

    else
    {
      adminLink.classList.add("nav-hidden");
    }

  }

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

  const navAvatar = document.getElementById("btn-avatar-nav");

  if (navAvatar) navAvatar.innerHTML = avatarHTML;

  const containerGrande = document.querySelector(".avatar-grande-container");

  if (containerGrande) containerGrande.innerHTML = avatarHTML;

  const emailEl = document.querySelector(".user-email");

  if (emailEl) emailEl.textContent = email;

  const saudacaoEl = document.querySelector(".saudacao-usuario");

  if (saudacaoEl) saudacaoEl.textContent = `Olá, ${nome.split(" ")[0]}!`;
}
