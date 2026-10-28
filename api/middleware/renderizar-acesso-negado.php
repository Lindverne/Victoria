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
        <script src="<?= $publicBase ?>/assets/js/tema-boot.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <style>
            body {
                margin: 0; min-height: 100vh;
                background: #eff6e0;
                font-family: 'Montserrat', sans-serif;
                display: flex; align-items: center; justify-content: center;
            }

            .swal2-popup {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid #598392 !important;
                border-radius: 30px !important;
                color: #01161e !important;
                font-family: 'Montserrat', sans-serif !important;
            }

            .swal2-title {
                color: #124559 !important;
                font-weight: 800 !important;
                font-family: 'Montserrat', sans-serif !important;
            }

            .swal2-html-container {
                color: #01161e !important;
                font-family: 'Montserrat', sans-serif !important;
            }

            .swal2-confirm {
                background: #598392 !important;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 50px !important;
                padding: 12px 35px !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                font-size: 0.8rem !important;
                border: none !important;
            }

            .swal2-cancel {
                background: transparent !important;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 50px !important;
                padding: 12px 35px !important;
                font-weight: 700 !important;
                font-size: 0.8rem !important;
                border: 2px solid #aec3b0 !important;
                color: #8a9a8b !important;
            }

            .swal2-cancel:hover {
                background: rgba(174, 195, 176, 0.1) !important;
            }

            .swal2-icon {
                border-color: #598392 !important;
            }

            .swal2-icon .swal2-icon-content {
                color: #598392 !important;
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
                color: rgba(239, 246, 224, 0.85) !important;
            }

            [data-theme='dark'] .swal2-confirm {
                background: #3d6b7a !important;
            }

            [data-theme='dark'] .swal2-cancel {
                border: 2px solid rgba(134, 179, 189, 0.4) !important;
                color: #86b3bd !important;
            }

            [data-theme='dark'] .swal2-cancel:hover {
                background: rgba(134, 179, 189, 0.15) !important;
            }

        </style>
    </head>
    <body>
        <script>
            Swal.fire({
                title: 'Acesso Restrito',
                html: '<p style="font-size: 1rem; line-height: 1.7; margin: 0;">' +
                      <?= json_encode($mensagem, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) ?> +
                      '</p>',
                icon: 'warning',
                iconColor: '#e8a838',
                showCancelButton: true,
                confirmButtonColor: '#598392',
                confirmButtonText: 'Ir para Login',
                cancelButtonColor: '#8a9a8b',
                cancelButtonText: 'Voltar',
                allowOutsideClick: false,
                allowEscapeKey: false<?php

if (!$mostrarLogin):

?>,
                showConfirmButton: false,
                confirmButtonText: null,
                cancelButtonText: 'Voltar',
                cancelButtonColor: '#598392'<?php

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
        </script>
    </body>
    </html>
    <?php exit();
}
