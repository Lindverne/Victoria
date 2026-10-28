(function ()
{
    try
    {
        let tema = localStorage.getItem('victoria_theme');

        if (tema !== 'dark' && tema !== 'light')
        {
            tema = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        document.documentElement.setAttribute('data-theme', tema || 'light');
    }

    catch (e)
    {
    }

})();
