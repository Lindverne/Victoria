<?php

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
    <meta name="description" content="Victória - Cadastro no Sistema">
    <title>Cadastro | Victória</title>

    <?= csrfMetaTag() ?>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">

    <link rel="stylesheet" href="../assets/css/pages/cadastro.css">

    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
</head>

<body>

    <button class="btn-toggle-tema tema-toggle-flutuante" id="btn-toggle-tema" type="button" aria-label="Alternar tema" title="Tema"><i class="fa-solid fa-moon" aria-hidden="true"></i></button>

    <main class="container-cadastro-centralizado">
        <div class="card-cadastro-split-flutuante">

            <div class="split-coluna-formulario-card">
                <a href="login.php" class="link-voltar"><i class="fas fa-arrow-left"></i> Voltar</a>

                <div class="header-cadastro">
                    <div class="logo-container">
                        <img src="../assets/img/logos/logo-victoria.webp" alt="Logo Victória" class="logo-pequena">
                    </div>
                    <h2>Criar sua conta</h2>
                </div>

                <form class="formulario-cadastro" id="cadastroForm">

                    <div class="campo-form-agrupado">
                        <label for="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" placeholder="Seu nome completo" required>
                    </div>

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

                    <div class="campo-form-agrupado">
                        <label for="confirm-password">Confirmar Senha</label>
                        <input type="password" id="confirm-password" name="confirm-password"
                            placeholder="Confirme a senha" required autocomplete="current-password">
                        <i class="fas fa-eye toggle-password" title="Mostrar senha"></i>
                    </div>

                    <div class="opcoes-adicionais-central">
                        <div class="agree-terms">
                            <input type="checkbox" name="terms" id="termsCheckbox">
                            <span class="checkmark" id="checkmarkCircle"></span>
                            <span class="agree-text">Concordo com os <a href="termos.php">Termos de Serviço</a></span>
                        </div>
                    </div>

                    <button type="submit" class="botao-submit-card">Criar Conta na Victória</button>

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

                <div class="rodape-cadastro-card">
                    <p>Já tem conta? <a href="login.php">Faça login aqui</a></p>
                </div>
            </div>

            <div class="split-coluna-visual-card">
                <div class="bloco-testemunho">
                    <i class="fas fa-quote-left"></i>
                    <h3>"Juntar-se à Victória foi uma decisão que transformou minha experiência."</h3>
                    <p class="autor-testemunho">Comunidade Victória • Inovadores</p>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>

    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
    <script type="module" src="../assets/js/pages/cadastro.js"></script>
</body>

</html>
