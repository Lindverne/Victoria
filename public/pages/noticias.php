<?php

require_once dirname(__DIR__) . '/helpers/caminhos.php';
require_once dirname(__DIR__, 2) . '/api/middleware/verificador-base.php';
require_once dirname(__DIR__, 2) . '/api/config/csrf.php';

$categoriaFiltro = $_GET['categoria'] ?? '';
$pagina = max(1, (int) ($_GET['page'] ?? 1));
$porPagina = 10;
$offset = ($pagina - 1) * $porPagina;
$isAjax = ($_GET['ajax'] ?? '') === '1';

require_once dirname(__DIR__, 2) . '/api/config/conexao-base.php';
require_once dirname(__DIR__) . '/components/erro-conexao.php';

$conn = conectarBanco();
$erroConexao = $conn === null;

try
{
    if ($conn === null)
    {
        throw new RuntimeException('Sem conexão com o banco de dados.');
    }

    

    $destaques = $conn->query(
        "SELECT id, titulo, resumo, imagem_capa, categoria, fonte, visualizacoes,
                DATE_FORMAT(created_at, '%d/%m/%Y') as data
         FROM noticias WHERE status = 1
         ORDER BY destaque DESC, created_at DESC LIMIT 5"
    )->fetchAll();

    $idsDestaques = array_column($destaques, 'id');

    

    $whereExtra = !empty($categoriaFiltro) ? ' AND categoria = ?' : '';
    $baseWhere  = 'WHERE status = 1' . $whereExtra;

    if (!empty($idsDestaques))
    {
        $ph = implode(',', array_fill(0, count($idsDestaques), '?'));
        $baseWhere .= " AND id NOT IN ({$ph})";
    }

    
    $countParams = !empty($categoriaFiltro) ? [$categoriaFiltro] : [];
    $countAll    = $countParams;

    if (!empty($idsDestaques))
    {
        $countAll = array_merge($countAll, $idsDestaques);
    }

    $stmtCount = $conn->prepare("SELECT COUNT(*) FROM noticias {$baseWhere}");
    $stmtCount->execute($countAll);
    $totalNoticias = (int) $stmtCount->fetchColumn();
    $totalPaginas  = max(1, ceil($totalNoticias / $porPagina));

    
    $listaParams = $countParams;

    if (!empty($idsDestaques))
    {
        $listaParams = array_merge($listaParams, $idsDestaques);
    }

    $listaParams[] = $porPagina;
    $listaParams[] = $offset;

    $stmtLista = $conn->prepare(
        "SELECT id, titulo, resumo, imagem_capa, categoria, fonte, visualizacoes,
                DATE_FORMAT(created_at, '%d/%m/%Y') as data
         FROM noticias {$baseWhere}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?"
    );
    $i = 1;

    foreach ($listaParams as $p)
    {
        $stmtLista->bindValue($i++, $p, is_int($p) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }

    $stmtLista->execute();
    $noticias = $stmtLista->fetchAll();

    

    $idsUltimas = array_column($noticias, 'id');
    $idsExcluir = array_merge($idsDestaques, $idsUltimas);
    $emAlta     = [];

    if (!empty($idsExcluir))
    {
        $ph2 = implode(',', array_fill(0, count($idsExcluir), '?'));
        $stmtAlta = $conn->prepare(
            "SELECT id, titulo, categoria, visualizacoes
             FROM noticias
             WHERE status = 1 AND id NOT IN ({$ph2})
             ORDER BY visualizacoes DESC LIMIT 5"
        );
        $stmtAlta->execute($idsExcluir);
        $emAlta = $stmtAlta->fetchAll();
    }

    else
    {
        $emAlta = $conn->query(
            "SELECT id, titulo, categoria, visualizacoes
             FROM noticias WHERE status = 1
             ORDER BY visualizacoes DESC LIMIT 5"
        )->fetchAll();
    }

    

    $categorias = $conn->query(
        'SELECT DISTINCT categoria FROM noticias WHERE status = 1 ORDER BY categoria'
    )->fetchAll(PDO::FETCH_COLUMN);
}

catch (Exception $e)
{
    error_log('[Noticias] ' . $e->getMessage());
    $destaques = [];
    $noticias = [];
    $emAlta = [];
    $categorias = [];
    $totalPaginas = 1;
    $pagina = 1;
}

if ($isAjax):
    header('Content-Type: text/html; charset=UTF-8');

?><div class="news-latest-list" id="newsList">
        <?php

if ($erroConexao):

    renderizarErroConexao();

elseif (count($noticias) > 0):

?>

            <?php

foreach ($noticias as $n):

?>
            <article class="news-latest-item" data-id="<?= (int) $n['id'] ?>">
                <?php

if ($n['imagem_capa']):

?>
                <div class="news-latest-thumb">
                    <img src="<?= imagemCapaUrl($n['imagem_capa']) ?>" alt="<?= htmlspecialchars($n['titulo']) ?>" loading="lazy">
                </div>
                <?php

endif;

?>
                <div class="news-latest-body">
                    <h3><?= htmlspecialchars($n['titulo']) ?></h3>
                    <p><?php

$r = $n['resumo'];
                    echo htmlspecialchars(mb_substr($r, 0, 150)) . (strlen($r) > 150 ? '...' : '');

?></p>
                    <div class="news-meta">
                        <span class="category-tag"><?= htmlspecialchars($n['categoria']) ?></span>
                        <span class="news-meta-time"><i class="far fa-calendar-alt"></i> <?= htmlspecialchars($n['data']) ?></span>
                        <?php

if (!empty($n['fonte'])):

?>
                        <span class="news-meta-time"><i class="fas fa-source"></i> <?= htmlspecialchars($n['fonte']) ?></span>
                        <?php

endif;

?>
                        <span class="news-meta-time"><i class="far fa-eye"></i> <?= (int) $n['visualizacoes'] ?></span>
                    </div>
                </div>
            </article>
            <?php

endforeach;

?>

        <?php

else:

?>
            <div class="news-empty-state">
                <i class="fas fa-newspaper"></i>
                <p>Nenhuma notícia encontrada<?= !empty($categoriaFiltro) ? ' nesta categoria' : '' ?>.</p>
            </div>
        <?php

endif;

?>
    </div>
    <?php

$catParam = !empty($categoriaFiltro) ? '&categoria=' . urlencode($categoriaFiltro) : '';

    if ($totalPaginas > 1):

?>
    <div class="news-pagination" id="newsPagination">
        <?php

if ($pagina > 1):

?>
        <a href="noticias.php?page=<?php

echo $pagina - 1 . $catParam;

?>" class="nav-btn-access page-link"><i class="fas fa-chevron-left"></i> Anterior</a>
        <?php

endif;

?>
        <span class="news-page-info">Página <?= $pagina ?> de <?= $totalPaginas ?></span>
        <?php

if ($pagina < $totalPaginas):

?>
        <a href="noticias.php?page=<?php

echo $pagina + 1 . $catParam;

?>" class="nav-btn-access page-link">Próxima <i class="fas fa-chevron-right"></i></a>
        <?php

endif;

?>
    </div>
    <?php

endif;
    exit();

endif;

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Notícias sobre água, sustentabilidade, saneamento e tecnologia hídrica - Victória">
    <title>Notícias | Victória</title>

    <?= csrfMetaTag() ?>

    <script src="../assets/js/tema-boot.js"></script>
    <link rel="stylesheet" href="../assets/css/global/variables.css">
    <link rel="stylesheet" href="../assets/css/global/variables-dark.css">
    <link rel="stylesheet" href="../assets/css/global/global.css">
    <link rel="stylesheet" href="../assets/css/components/tema.css">
    <link rel="stylesheet" href="../assets/css/pages/noticias.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/components/modal-animacoes.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/responsividade.css">

    <link rel="icon" href="../assets/img/favicon/icon-victoria.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js"></script>
</head>

<body>
    <div id="top"></div>

    <?php

require_once dirname(__DIR__) . '/components/header.php';

?>

    <?php

$heroSubtitle = 'Informativo';
    $heroTitle = 'Notícias';
    $heroDescription = 'Atualizações sobre abastecimento, tarifas e consumo regional.';
    require_once dirname(__DIR__) . '/components/hero-section.php';

?>

    <main class="section-padding">
        <div class="container-box">

            
            <?php

if (count($destaques) > 0):

?>
            <div class="section-header">
                <span class="category-tag">Informativo</span>
                <h2>Destaques</h2>
            </div>

            <div class="news-featured-grid" id="featuredGrid">
                <?php

foreach ($destaques as $i => $n):

?>
                <article class="news-featured-card reveal" data-id="<?= (int) $n['id'] ?>">
                    <img src="<?= imagemCapaUrl($n['imagem_capa'] ?? 'default.jpg') ?>" alt="<?= htmlspecialchars($n['titulo']) ?>" <?= $i === 0 ? 'fetchpriority="high"' : 'loading="lazy"' ?>>
                    <div class="news-featured-content">
                        <span class="news-featured-tag"><?= htmlspecialchars($n['categoria']) ?></span>
                        <h3><?= htmlspecialchars($n['titulo']) ?></h3>
                    </div>
                </article>
                <?php

endforeach;

?>
            </div>
            <?php

endif;

?>

            
            <div class="news-main-grid">

                
                <section>
                    <div class="news-latest-header">
                        <i class="fa-solid fa-newspaper"></i>
                        <h2><?= !empty($categoriaFiltro) ? htmlspecialchars($categoriaFiltro) : 'Últimas Notícias' ?></h2>
                        <?php

if (!empty($categoriaFiltro)):

?>
                        <a href="noticias.php" class="nav-btn-access btn-limpar-filtro" id="btnLimparFiltro">
                            <i class="fas fa-times"></i> Limpar filtro
                        </a>
                        <?php

endif;

?>
                    </div>

                    
                    <?php

if (count($categorias) > 0):

?>
                    <div class="news-filter-bar" id="newsFilterBar">
                        <button type="button" class="news-filter-btn <?= empty($categoriaFiltro) ? 'active' : '' ?>" data-categoria="">Todas</button>
                        <?php

foreach ($categorias as $cat):

?>
                        <button type="button" class="news-filter-btn <?= $categoriaFiltro === $cat ? 'active' : '' ?>" data-categoria="<?= htmlspecialchars($cat, ENT_QUOTES) ?>"><?= htmlspecialchars(
    $cat,
) ?></button>
                        <?php

endforeach;

?>
                    </div>
                    <?php

endif;

?>

                    
                    <div class="news-latest-list" id="newsList">
                        <?php

if ($erroConexao):

    renderizarErroConexao();

elseif (count($noticias) > 0):

?>

                            <?php

foreach ($noticias as $n):

?>
                            <article class="news-latest-item reveal" data-id="<?= (int) $n['id'] ?>">
                                <?php

if ($n['imagem_capa']):

?>
                                <div class="news-latest-thumb">
                                    <img src="<?= imagemCapaUrl($n['imagem_capa']) ?>" alt="<?= htmlspecialchars($n['titulo']) ?>" loading="lazy">
                                </div>
                                <?php

endif;

?>
                                <div class="news-latest-body">
                                    <h3><?= htmlspecialchars($n['titulo']) ?></h3>
                                    <p><?php

$r = $n['resumo'];
                                    echo htmlspecialchars(mb_substr($r, 0, 150)) . (strlen($r) > 150 ? '...' : '');

?></p>
                                    <div class="news-meta">
                                        <span class="category-tag"><?= htmlspecialchars($n['categoria']) ?></span>
                                        <span class="news-meta-time"><i class="far fa-calendar-alt"></i> <?= htmlspecialchars($n['data']) ?></span>
                                        <?php

if (!empty($n['fonte'])):

?>
                                        <span class="news-meta-time"><i class="fas fa-source"></i> <?= htmlspecialchars($n['fonte']) ?></span>
                                        <?php

endif;

?>
                                        <span class="news-meta-time"><i class="far fa-eye"></i> <?= (int) $n['visualizacoes'] ?></span>
                                    </div>
                                </div>
                            </article>
                            <?php

endforeach;

?>

                        <?php

else:

?>
                            <div class="news-empty-state">
                                <i class="fas fa-newspaper"></i>
                                <p>Nenhuma notícia encontrada<?= !empty($categoriaFiltro) ? ' nesta categoria' : '' ?>.</p>
                            </div>
                        <?php

endif;

?>
                    </div>

                    <?php

$catParam = !empty($categoriaFiltro) ? '&categoria=' . urlencode($categoriaFiltro) : '';

                    if ($totalPaginas > 1):

?>
                    <div class="news-pagination" id="newsPagination">
                        <?php

if ($pagina > 1):

?>
                        <a href="noticias.php?page=<?php

echo $pagina - 1 . $catParam;

?>" class="nav-btn-access page-link"><i class="fas fa-chevron-left"></i> Anterior</a>
                        <?php

endif;

?>
                        <span class="news-page-info">Página <?= $pagina ?> de <?= $totalPaginas ?></span>
                        <?php

if ($pagina < $totalPaginas):

?>
                        <a href="noticias.php?page=<?php

echo $pagina + 1 . $catParam;

?>" class="nav-btn-access page-link">Próxima <i class="fas fa-chevron-right"></i></a>
                        <?php

endif;

?>
                    </div>
                    <?php

endif;

?>
                </section>

                
                <aside class="perfil-activity-sidebar reveal">
                    <div class="sidebar-header">
                        <i class="fa-solid fa-fire"></i>
                        <h2>Em Alta</h2>
                    </div>

                    <div class="activity-list">
                        <?php

if (count($emAlta) > 0):

?>

                            <?php

foreach ($emAlta as $i => $n):

?>
                            <div class="activity-item">
                                <span class="activity-icon <?= $i < 3 ? 'activity-icon-top' : '' ?>">
                                    <?= $i + 1 ?>
                                </span>
                                <div class="activity-content">
                                    <p class="activity-title"><?= htmlspecialchars($n['titulo']) ?></p>
                                    <p class="activity-time"><i class="far fa-eye"></i> <?= (int) $n['visualizacoes'] ?> visualizações</p>
                                </div>
                            </div>
                            <?php

endforeach;

?>

                        <?php

else:

?>
                            <div class="news-empty-state-sm">
                                <p>Nenhuma notícia ainda.</p>
                            </div>
                        <?php

endif;

?>
                    </div>
                </aside>
            </div>
        </div>
    </main>

    <?php

require_once dirname(__DIR__) . '/components/footer.php';

?>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script type="module" src="../assets/js/auth.js"></script>
    <script type="module" src="../assets/js/global.js"></script>
    <script src="../assets/js/pages/noticias.js"></script>
    <script>
    (function() {
        'use strict';

        const filterBar = document.getElementById('newsFilterBar');
        const newsList = document.getElementById('newsList');
        const pagination = document.getElementById('newsPagination');
        const latestHeader = document.querySelector('.news-latest-header h2');
        const limparFiltro = document.getElementById('btnLimparFiltro');

        if (!filterBar || !newsList) return;

        
        function carregarLista(categoria, page)
        {
            const params = new URLSearchParams({ ajax: '1' });

            if (categoria) params.set('categoria', categoria);

            if (page > 1) params.set('page', page);

            const url = 'noticias.php?' + params.toString();

            fetch(url)
                .then(r => r.text())
                .then(html => {
                    
                    const tmp = document.createElement('div');
                    tmp.innerHTML = html;

                    const novaLista = tmp.querySelector('#newsList');
                    const novaPag = tmp.querySelector('#newsPagination');

                    if (novaLista)
                    {
                        newsList.innerHTML = novaLista.innerHTML;
                    }

                    if (novaPag && pagination)
                    {
                        pagination.innerHTML = novaPag.innerHTML;
                    }

                    else if (pagination)
                    {
                        pagination.innerHTML = '';
                    }

                    
                    document.querySelectorAll('.page-link').forEach(el => {
                        el.addEventListener('click', function(e) {
                            e.preventDefault();
                            const url = new URL(this.href);
                            carregarLista(url.searchParams.get('categoria') || '', parseInt(url.searchParams.get('page') || '1'));
                        });
                    });

                    
                    if (latestHeader)
                    {
                        latestHeader.textContent = categoria || 'Últimas Notícias';
                    }

                    
                    if (limparFiltro)
                    {
                        limparFiltro.style.display = categoria ? '' : 'none';
                    }

                })
                .catch(() => {
                    
                    window.location.href = url;
                });
        }

        
        filterBar.addEventListener('click', function(e) {
            const btn = e.target.closest('.news-filter-btn');

            if (!btn) return;

            const categoria = btn.getAttribute('data-categoria') || '';

            
            filterBar.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            
            carregarLista(categoria, 1);

            
            const params = new URLSearchParams();

            if (categoria) params.set('categoria', categoria);
            const novaUrl = 'noticias.php' + (params.toString() ? '?' + params.toString() : '');
            window.history.replaceState({ categoria: categoria, page: 1 }, '', novaUrl);
        });

        
        if (limparFiltro)
        {
            limparFiltro.addEventListener('click', function(e) {
                e.preventDefault();
                
                filterBar.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
                const todasBtn = filterBar.querySelector('[data-categoria=""]');

                if (todasBtn) todasBtn.classList.add('active');

                carregarLista('', 1);
                window.history.replaceState({ categoria: '', page: 1 }, '', 'noticias.php');
            });
        }

        
        document.querySelectorAll('.page-link').forEach(el => {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                const url = new URL(this.href);
                carregarLista(url.searchParams.get('categoria') || '', parseInt(url.searchParams.get('page') || '1'));
            });
        });
    })();
    </script>
</body>

</html>
