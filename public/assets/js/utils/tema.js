
const STORAGE_KEY = 'victoria_theme';

function temaSalvo()
{
    try
    {
        return localStorage.getItem(STORAGE_KEY);
    }

    catch (e)
    {
        return null;
    }

}

function temaDoSistema()
{
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function atualizarIconeTema(tema)
{
    const btn = document.getElementById('btn-toggle-tema');

    if (!btn)
    {
        return;
    }

    const icon = btn.querySelector('i');

    if (!icon)
    {
        return;
    }

    if (tema === 'dark')
    {
        icon.className = 'fa-solid fa-sun';
        btn.setAttribute('aria-label', 'Alternar para tema claro');
        btn.title = 'Tema claro';
    }
    else
    {
        icon.className = 'fa-solid fa-moon';
        btn.setAttribute('aria-label', 'Alternar para tema escuro');
        btn.title = 'Tema escuro';
    }

}

export function aplicarTema(tema)

{
    const efetivo = tema === 'dark' || tema === 'light' ? tema : temaDoSistema();

    document.documentElement.dataset.theme = efetivo;

    try
    {
        localStorage.setItem(STORAGE_KEY, efetivo);
    }

    catch (e)
    {
    }

    atualizarIconeTema(efetivo);

    document.dispatchEvent(new CustomEvent('victoria:tema', { detail: { tema: efetivo } }));

    return efetivo;
}

export function aplicarTemaInicial()

{
    const salvo = temaSalvo();
    const efetivo = salvo === 'dark' || salvo === 'light' ? salvo : temaDoSistema();

    document.documentElement.dataset.theme = efetivo;
    atualizarIconeTema(efetivo);

    return efetivo;
}

export function alternarTema()

{
    const atual = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

    return aplicarTema(atual);
}

export function initTema()

{
    const btn = document.getElementById('btn-toggle-tema');

    if (btn)
    {
        btn.addEventListener('click', () => {
            alternarTema();
        });
    }

    if (window.matchMedia)
    {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {

            if (!temaSalvo())
            {
                const tema = temaDoSistema();

                document.documentElement.dataset.theme = tema;
                atualizarIconeTema(tema);
            }

        });
    }

}
