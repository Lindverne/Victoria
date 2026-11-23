const inicializarLogoLoop = () =>
{
  const tracks = document.querySelectorAll(".logo-loop__track");

  tracks.forEach((track) =>
  {
    const itens = Array.from(track.children);

    if (itens.length === 0)
    {
      return;
    }

    itens.forEach((item) =>
    {
      const clone = item.cloneNode(true);
      clone.removeAttribute("data-active");
      track.appendChild(clone);
    });
  });
};

if (document.readyState === "loading")
{
  document.addEventListener("DOMContentLoaded", inicializarLogoLoop);
}
else
{
  inicializarLogoLoop();
}
