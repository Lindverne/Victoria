<?php

require_once __DIR__ . '/../config/urls.php';

function renderizarAcessoNegado(string $mensagem = 'Você não tem permissão para acessar esta página.', bool $mostrarLogin = true): never
{
    $publicBase = getPublicBaseUrl();
    http_response_code(403);

?>
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acesso Restrito | Victória</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
        <link rel="icon" href="<?= $publicBase ?>/assets/img/favicon/icon-victoria.ico">
        <script src="<?= $publicBase ?>/assets/js/tema-boot.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <style>
            body {
                margin: 0;
                min-height: 100vh;
                font-family: 'Montserrat', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .swal2-popup {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(18, 69, 89, 0.15) !important;
                border-radius: 30px !important;
                color: #01161e !important;
                font-family: 'Montserrat', sans-serif !important;
            }

            .swal2-title {
                color: #01161e !important;
                font-weight: 800 !important;
                font-family: 'Montserrat', sans-serif !important;
            }

            .swal2-html-container {
                color: #01161e !important;
                font-family: 'Montserrat', sans-serif !important;
            }

            .swal2-confirm,
            .swal2-cancel {
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 50px !important;
                padding: 12px 35px !important;
                font-weight: 700 !important;
                font-size: 0.8rem !important;
                border: none !important;
                color: #ffffff !important;
            }

            .swal2-confirm {
                background: #124559 !important;
                text-transform: uppercase !important;
            }

            .swal2-confirm:hover {
                background: #0e3a4a !important;
                opacity: 1 !important;
            }

            .swal2-cancel {
                background: #01161e !important;
            }

            .swal2-cancel:hover {
                background: #000f18 !important;
                opacity: 1 !important;
            }

            .swal2-icon {
                border-color: #3d6b7a !important;
            }

            .swal2-icon .swal2-icon-content {
                color: #3d6b7a !important;
            }

            [data-theme='dark'] {
                color-scheme: dark;
            }

            [data-theme='dark'] body {
                background: #0a141b;
            }

            [data-theme='dark'] .swal2-popup {
                background: rgba(15, 27, 36, 0.97) !important;
                border: 1px solid rgba(134, 179, 189, 0.25) !important;
                color: #eff6e0 !important;
            }

            [data-theme='dark'] .swal2-title {
                color: #eff6e0 !important;
            }

            [data-theme='dark'] .swal2-html-container {
                color: #eff6e0 !important;
            }

            [data-theme='dark'] .swal2-confirm {
                background: #86b3bd !important;
            }

            [data-theme='dark'] .swal2-confirm:hover {
                background: #6a9ba5 !important;
                opacity: 1 !important;
            }

            [data-theme='dark'] .swal2-cancel {
                background: #0a141b !important;
            }

            [data-theme='dark'] .swal2-cancel:hover {
                background: #081016 !important;
                opacity: 1 !important;
            }

            [data-theme='dark'] .swal2-icon {
                border-color: #7fa3ab !important;
            }

            [data-theme='dark'] .swal2-icon .swal2-icon-content {
                color: #7fa3ab !important;
            }

        </style>
    </head>
    <body>
        <script>
            Swal.fire({
                title: 'Acesso Restrito',
                html: '<p style="font-size: 1rem; line-height: 1.7; margin: 0; font-family: \'Montserrat\', sans-serif;">' +
                      <?= json_encode($mensagem, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?> +
                      '</p>',
                icon: 'warning',
                iconColor: '#e8a838',
                showCancelButton: true,
                confirmButtonColor: '#124559',
                confirmButtonText: 'Ir para Login',
                cancelButtonColor: '#01161e',
                cancelButtonText: 'Voltar',
                allowOutsideClick: false,
                allowEscapeKey: false<?php

if (!$mostrarLogin):

?>,
                showConfirmButton: false,
                confirmButtonText: null,
                cancelButtonText: 'Voltar',
                cancelButtonColor: '#0a141b'<?php

endif;

?>
            }).then((result) => {

                if (result.isConfirmed)
                {
                    window.location.href = '<?= $publicBase ?>/pages/login.php';
                }

                else
                {
                    window.history.back();
                }

            });

            const btnConfirm = document.querySelector('.swal2-confirm');
            const btnCancel = document.querySelector('.swal2-cancel');
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            if (btnConfirm)
            {
                btnConfirm.style.setProperty('background', isDark ? '#86b3bd' : '#124559', 'important');
                btnConfirm.style.setProperty('color', '#ffffff', 'important');
                btnConfirm.style.setProperty('border', 'none', 'important');
                btnConfirm.style.setProperty('border-radius', '50px', 'important');
                btnConfirm.style.setProperty('padding', '12px 35px', 'important');
                btnConfirm.style.setProperty('font-weight', '700', 'important');
                btnConfirm.style.setProperty('font-size', '0.8rem', 'important');
                btnConfirm.style.setProperty('font-family', '\'Montserrat\', sans-serif', 'important');
            }

            if (btnCancel)
            {
                btnCancel.style.setProperty('background', isDark ? '#0a141b' : '#01161e', 'important');
                btnCancel.style.setProperty('color', '#ffffff', 'important');
                btnCancel.style.setProperty('border', 'none', 'important');
                btnCancel.style.setProperty('border-radius', '50px', 'important');
                btnCancel.style.setProperty('padding', '12px 35px', 'important');
                btnCancel.style.setProperty('font-weight', '700', 'important');
                btnCancel.style.setProperty('font-size', '0.8rem', 'important');
                btnCancel.style.setProperty('font-family', '\'Montserrat\', sans-serif', 'important');
            }
        </script>
    </body>
    </html>
    <?php exit();
}
