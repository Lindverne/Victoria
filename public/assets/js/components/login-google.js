const GOOGLE_CLIENT_ID = getenvGoogleClientId();

function getenvGoogleClientId()
{
  const meta = document.querySelector('meta[name="google-client-id"]');

  return meta ? meta.getAttribute("content") : null;
}

function iniciarLoginGoogle()
{
  if (!GOOGLE_CLIENT_ID)
  {
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: lidarRespostaGoogle
  });

  const btnGoogle = document.getElementById("btn-google-login");

  if (btnGoogle)
  {
    btnGoogle.addEventListener("click", () => {
      google.accounts.id.prompt();
    });
  }
}

function lidarRespostaGoogle(resposta)
{
  const idToken = resposta.credential;

  if (!idToken)
  {
    mostrarErroGoogle("Token do Google não recebido.");
    return;
  }

  const apiBase = window.location.pathname.includes("/pages/")
    ? "../../api"
    : "../api";

  fetch(`${apiBase}/auth/login-google.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": obterCsrfToken()
    },
    credentials: "include",
    body: JSON.stringify({ id_token: idToken })
  })
    .then((respostaHttp) => respostaHttp.json())
    .then((dados) => {
      if (dados.success)
      {
        localStorage.setItem("victoria_user", JSON.stringify(dados.user));
        Swal.fire({
          title: "Login realizado!",
          text: "Bem-vindo(a) de volta, " + dados.user.nome + ".",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.href = window.location.pathname.includes("/pages/")
            ? "../index.php"
            : "index.php";
        });
      }
      else
      {
        mostrarErroGoogle(dados.message || "Erro ao fazer login com Google.");
      }
    })
    .catch(() => {
      mostrarErroGoogle("Erro de conexão com o servidor.");
    });
}

function mostrarErroGoogle(mensagem)
{
  Swal.fire({
    title: "Erro no login",
    text: mensagem,
    icon: "error",
    confirmButtonText: "Tentar novamente"
  });
}

function obterCsrfToken()
{
  const meta = document.querySelector('meta[name="csrf-token"]');

  return meta ? meta.getAttribute("content") : null;
}

export { iniciarLoginGoogle };
