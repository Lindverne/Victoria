import { Auth } from "../auth.js";

document.addEventListener("click", (e) => {

  if (e.target && e.target.id === "esqueciSenha")
  {
    e.preventDefault();
    Swal.fire({
      title: "Funcionalidade em desenvolvimento",
      text: "A recuperação de senha ainda está sendo implementada. Em breve você poderá redefinir sua senha!",
      icon: "warning",
      iconColor: "#e8a838",
      confirmButtonText: "Entendi",
    });
  }

});

document.addEventListener("DOMContentLoaded", () => {
  const form =
    document.getElementById("loginForm") || document.querySelector("form");
  const btnSubmit = form?.querySelector('button[type="submit"]');

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("password")?.value;

    if (!email || !senha)
    {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Preencha e-mail e senha.",
        confirmButtonText: "Ok",
      });
      return;
    }

    const textoOriginal = btnSubmit?.innerHTML;

    if (btnSubmit)
    {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    }

    const result = await Auth.login(email, senha);

    if (result.success)
    {
      Swal.fire({
        icon: "success",
        title: `Bem-vindo, ${result.user.nome.split(" ")[0]}!`,
        text: "Redirecionando...",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "dashboard.php";
      });
    }
    else
    {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: `${result.message}`,
      });

      if (btnSubmit)
      {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = textoOriginal;
      }

    }

  });
});
