import { Auth } from "../auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("termsCheckbox");
  const circle = document.getElementById("checkmarkCircle");

  if (checkbox && circle)
  {
    circle.addEventListener("click", () => {
      checkbox.checked = !checkbox.checked;
    });
  }

  const form =
    document.getElementById("cadastroForm") || document.querySelector("form");
  const btnSubmit = form?.querySelector('button[type="submit"]');

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("password")?.value;
    const confirmSenha = document.getElementById("confirm-password")?.value;
    const termos = document.querySelector('input[name="terms"]')?.checked;

    if (!nome || !email || !senha || !confirmSenha)
    {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Preencha todos os campos.",
      });
      return;
    }

    if (senha !== confirmSenha)
    {
      Swal.fire({
        icon: "error",
        title: "Senhas diferentes",
        text: "As senhas não coincidem.",
      });
      return;
    }

    if (senha.length < 6)
    {
      Swal.fire({
        icon: "warning",
        title: "Senha fraca",
        text: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (!termos)
    {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Aceite os Termos de Serviço para continuar.",
      });
      return;
    }

    const textoOriginal = btnSubmit?.innerHTML;

    if (btnSubmit)
    {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    }

    const result = await Auth.cadastro(nome, email, senha);

    if (result.success)
    {
      Swal.fire({
        icon: "success",
        title: "Cadastro realizado!",
        text: "Redirecionando para o login...",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "login.php";
      });
    }
    else
    {
      Swal.fire({
        icon: "error",
        title: "Erro no cadastro",
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
