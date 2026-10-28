<?php

$heroSubtitle = $heroSubtitle ?? 'Subtítulo';
$heroTitle = $heroTitle ?? 'Título';
$heroDescription = $heroDescription ?? 'Descrição do projeto.';
$heroImage = $heroImage ?? ASSETS_URL . '/img/global/bg-hero-section.jpg';

?>
<section class="hero-section static-hero">
    <div class="carousel-container">
        <div class="carousel-slide active">
            <img src="<?= htmlspecialchars($heroImage) ?>" alt="Imagem de fundo da seção de abertura">
            <img class="hero-img-dark" src="<?= ASSETS_URL ?>/img/global/bg-hero-section-dark.jpg" alt="" aria-hidden="true">
            <div class="hero-overlay"></div>
            <div class="hero-text reveal active">
                <span class="hero-subtitle"><?= htmlspecialchars($heroSubtitle) ?></span>
                <h1><?= htmlspecialchars($heroTitle) ?></h1>
                <p><?= htmlspecialchars($heroDescription) ?></p>
            </div>
        </div>
    </div>
</section>
