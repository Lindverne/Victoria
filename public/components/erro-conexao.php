<?php

function renderizarErroConexao(string $mensagem = 'Erro de conexão com o banco de dados.'): void
{
    ?>
    <div class="erro-conexao-card" role="alert">
        <i class="fas fa-times-circle" aria-hidden="true"></i>
        <p><?= htmlspecialchars($mensagem) ?></p>
    </div>
    <?php
}
