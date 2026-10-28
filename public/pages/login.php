<?php

/*

  Código Legado do Morango ♡⸜(˶˃ ᵕ ˂˶)⸝♡ - Login.php

    include ("../PHP/conexao.php");
    session_start();
    $erro = array();

    if (isset($_POST['email']) && strlen($_POST['email']) > 0){
        $_SESSION['email'] = $con->escape_string($_POST['email']);
        $_SESSION['senha'] = $_POST['senha'];
        $sql_code = "SELECT senha, id FROM usuario WHERE email = '$_SESSION[email]'";
        $sql_query = $con->query($sql_code) or die($con->error);
        $dado = $sql_query->fetch_assoc();
        $total = $sql_query->num_rows;

        if($total == 0){
            $erro[] = "Este email não existe no banco de dados";
        } else {

            if (password_verify($_SESSION['senha'], $dado['senha']) ){
                $_SESSION['usuario'] = $dado['id'];
            } else {
                $erro[] = "Senha incorreta";
            }

        }

        if(count($erro) == 0){
            echo "<script>alert('Login efetuado com sucesso');location.href='Inicial.html';</script>";
        }

    }

*/

require_once dirname(__DIR__, 2) . '/api/middleware/verificador-base.php';
require_once dirname(__DIR__, 2) . '/api/config/csrf.php';

if (isset($_SESSION['usuario_id']))
{
    header('Location: dashboard.php');
    exit();
}

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Login e Acesso ao Sistema">
    <title>Login | Victória</title>

    <?= csrfMetaTag() ?>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/login.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
</head>

<body>

    <button class="btn-toggle-tema tema-toggle-flutuante" id="btn-toggle-tema" type="button" aria-label="Alternar tema" title="Tema"><i class="fa-solid fa-moon" aria-hidden="true"></i></button>

    <main class="container-login-centralizado">
        <div class="card-login-split-flutuante">

            <div class="split-coluna-visual-card">
                <div class="bloco-testemunho">
                    <i class="fas fa-quote-left"></i>
                    <h3>"A navegação autônoma transformou a forma como compreendemos a tecnologia."</h3>
                    <p class="autor-testemunho">Projeto Victória • Engenharia Inovadora</p>
                </div>
            </div>

            <div class="split-coluna-formulario-card">
                <a href="../index.php" class="link-voltar"><i class="fas fa-arrow-left"></i> Voltar</a>

                <div class="header-login">
                    <div class="logo-container">
                        <img src="../assets/img/logos/logo-victoria.webp" alt="Logo Victória" class="logo-pequena">
                    </div>
                    <h2>Bem-vindo(a) de volta!</h2>
                </div>

                <form class="formulario-login" id="loginForm">

                    <div class="campo-form-agrupado">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="seu@email.com" required
                            autocomplete="current-password">
                    </div>

                    <div class="campo-form-agrupado">
                        <label for="password">Senha</label>
                        <input type="password" id="password" name="password" placeholder="Sua senha" required
                            autocomplete="current-password">
                        <i class="fas fa-eye toggle-password" title="Mostrar senha"></i>
                    </div>

                    <div class="opcoes-adicionais-central">
                        <a href="#" class="link-opcoes" id="esqueciSenha">Esqueci minha senha</a>
                        <a href="cadastro.php" class="link-opcoes">Não tem uma conta? Crie uma agora!</a>
                    </div>

                    <button type="submit" class="botao-submit-card">Entrar na Victória</button>

                    <div class="separador-card">ou</div>

                    <div class="botao-social-card google">
                        <i class="fab fa-google"></i> Continuar com Google
                        <span class="badge-em-breve">Em breve</span>
                    </div>

                    <div class="botao-social-card microsoft">
                        <i class="fab fa-microsoft"></i> Continuar com Microsoft 365
                        <span class="badge-em-breve">Em breve</span>
                    </div>

                </form>

                <div class="rodape-login-card">
                    <p>&copy; 2026 Projeto Victória.</p>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
    <script type="module" src="../assets/js/pages/login.js"></script>
</body>

</html>
