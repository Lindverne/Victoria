<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Victória - Iluminando caminhos através da tecnologia e inovação.">
    <title>Ops... | Victória</title>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">
    <link rel="stylesheet" href="../assets/css/pages/404.css">
    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body>
    <div id="top"></div>

    <?php

require_once dirname(__DIR__) . '/components/header.php';

?>

    <main class="page-404">
        <section class="section-padding page-404-section">
            <div class="container-box page-404-container">
                <img src="../assets/img/extras/404.png" alt="Gota perdida da Victória" class="error-404-icone">
                <div class="error-404-code">404</div>
                <h2 class="error-404-title">Ops! Gota perdida.</h2>
                <p class="error-404-text">
                    Parece que a página que você está procurando evaporou ou fluiu para outro lugar.<br>
                    Não se preocupe, o ecossistema Victória continua seguro.
                </p>
                <a href="../index.php" class="error-404-btn">
                    <i class="fas fa-home"></i> Voltar ao Início
                </a>
            </div>
        </section>
    </main>

    <?php

require_once dirname(__DIR__) . '/components/footer.php';

?>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script type="module" src="../assets/js/global.js"></script>
</body>

</html>
