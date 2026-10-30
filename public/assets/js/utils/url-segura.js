
export function urlImagemSegura(valor)
{
  if (typeof valor !== "string")
  {
    return null;
  }

  const url = valor.trim().toLowerCase();

  if (url === "")
  {
    return null;
  }

  const schemesProibidos = ["javascript:", "vbscript:", "file:", "ftp:", "about:"];

  for (const scheme of schemesProibidos)
  {
    if (url.startsWith(scheme))
    {
      return null;
    }

  }

  if (url.startsWith("data:") && !url.startsWith("data:image/"))
  {
    return null;
  }

  return valor;
}


export function definirSrcSeguro(elemento, valor)
{
  if (!(elemento instanceof HTMLImageElement))
  {
    return false;
  }

  const seguro = urlImagemSegura(valor);

  if (seguro === null)
  {
    return false;
  }

  elemento.src = seguro;
  return true;
}