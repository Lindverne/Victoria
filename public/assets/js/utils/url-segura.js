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

  if (url.startsWith("data:"))
  {
    const mimeValidos = ["data:image/png", "data:image/jpeg", "data:image/gif", "data:image/webp"];
    let ehMimeValido = false;

    for (const mime of mimeValidos)
    {
      if (url.startsWith(mime))
      {
        ehMimeValido = true;
        break;
      }
    }

    if (!ehMimeValido)
    {
      return null;
    }
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

  const url = seguro.toLowerCase();
  const ehUrlSegura =
    url.startsWith("http:") ||
    url.startsWith("https:") ||
    url.startsWith("data:image/") ||
    url.startsWith("/") ||
    url.startsWith("./") ||
    url.startsWith("../");

  if (!ehUrlSegura)
  {
    return false;
  }

  elemento.src = seguro;
  return true;
}
