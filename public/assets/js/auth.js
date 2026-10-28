const API_BASE = window.location.pathname.includes("/pages/")
  ? "../../api"
  : "../api";

const USER_KEY = "victoria_user";

export const Auth = (() => {

  const getCurrentUser = () => {
    try
    {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    }

    catch (e)
    {
      return null;
    }

  };

  const isAuthenticated = () => !!localStorage.getItem(USER_KEY);

  const checkSession = async () => {
    try
    {
      const res = await fetch(`${API_BASE}/middleware/verificador-sessao.php`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) return false;
      const data = await res.json();
      return data.success === true;
    }

    catch (err)
    {
      return false;
    }

  };

  const restoreSessionFromServer = async () => {
    try
    {
      const res = await fetch(`${API_BASE}/auth/sessao.php`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) return false;
      const data = await res.json();

      if (data.success && data.user)
      {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        return !!localStorage.getItem(USER_KEY);
      }

      return false;
    }

    catch (err)
    {
      return false;
    }

  };

  const clearLocalSession = (redirect = true) => {
    localStorage.removeItem(USER_KEY);

    if (redirect && !window.location.pathname.includes("login.php"))
    {
      window.location.href = "login.php";
    }

  };

  const login = async (email, senha) => {
    try
    {
      const res = await fetch(`${API_BASE}/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, senha }),
      });
      const result = await res.json();

      if (result.success)
      {
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      }

      return result;
    }

    catch (err)
    {
      return { success: false, message: "Erro de conexão com o servidor." };
    }

  };

  const cadastro = async (nome, email, senha) => {
    try
    {
      const res = await fetch(`${API_BASE}/auth/cadastro.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nome, email, senha }),
      });
      const result = await res.json();
      return result;
    }

    catch (err)
    {
      return { success: false, message: "Erro de conexão com o servidor." };
    }

  };

  const logout = async () => {
    try
    {
      await fetch(`${API_BASE}/auth/logout.php`, {
        method: "POST",
        credentials: "include",
      });
    }

    catch (err)
    {
    }
    finally
    {
      localStorage.removeItem(USER_KEY);
    }

    return { success: true };
  };

  const updateDataOnServer = async (data) => {
    const user = getCurrentUser();

    if (!user) return { success: false, message: "Não logado." };
    data.id = user.id;
    try
    {
      const res = await fetch(`${API_BASE}/usuarios/atualizacao.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success)
      {
        const { senha_atual, nova_senha, confirmar_senha, senha, ...safeData } =
          data;
        const updatedUser = { ...user, ...safeData };
        try
        {
          localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        }

        catch (e)
        {
        }

        return { success: true, user: updatedUser };
      }

      return result;
    }

    catch (err)
    {
      return { success: false, message: "Erro de conexão com o servidor." };
    }

  };

  const updateAvatar = async (avatarData) =>
    updateDataOnServer({ avatar: avatarData });
  const updateWallpaper = async (wallpaperData) =>
    updateDataOnServer({ wallpaper: wallpaperData });
  const updateProfile = async (profileData) => updateDataOnServer(profileData);

  return {
    getCurrentUser,
    isAuthenticated,
    checkSession,
    restoreSessionFromServer,
    clearLocalSession,
    login,
    cadastro,
    logout,
    updateAvatar,
    updateWallpaper,
    updateProfile,
  };

})();

export async function checkAuthOnPageLoad()

{
  const page = window.location.pathname.toLowerCase();
  const protegidas = [
    "dashboard.php",
    "relatorios.php",
    "perfil.php",
    "admin.php",
  ];

  if (!protegidas.some((p) => page.includes(p))) return;

  if (!Auth.isAuthenticated())
  {
    const sessaoRestaurada = await Auth.restoreSessionFromServer();

    if (sessaoRestaurada)
    {
      location.reload();
      return;
    }

    verificarAcessoNegado();
    return;
  }

  try
  {
    const sessionOk = await Auth.checkSession();

    if (!sessionOk)
    {
      Auth.clearLocalSession(false);
      verificarAcessoNegado();
    }

  }

  catch (err)
  {
  }

}

export async function validateHeaderSession()

{

  if (!Auth.isAuthenticated()) return;

  const sessionOk = await Auth.checkSession();

  if (!sessionOk)
  {
    Auth.clearLocalSession(false);

    location.reload();
  }

}

document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.toLowerCase();
  const protegidas = [
    "dashboard.php",
    "relatorios.php",
    "perfil.php",
    "admin.php",
  ];

  if (protegidas.some((p) => page.includes(p)))
  {
    checkAuthOnPageLoad();
  }
  else
  {
    validateHeaderSession();
  }

});

function verificarAcessoNegado()
{
  Swal.fire({
    title: "Acesso restrito",
    text: "Você precisa estar logado para visualizar esta página.",
    icon: "error",
    confirmButtonText: "Ir para o login",
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then(() => {
    window.location.href = "login.php";
  });
}
