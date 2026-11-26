const DATA_IMAGE_BASE64_RE =
  /^data:image\/(?:png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/]*={0,2}$/i;

export function urlImagemSegura(valor)
{
  if (typeof valor !== "string")
  {
    return null;
  }

  const bruto = valor.trim();

  if (bruto === "")
  {
    return null;
  }

  if (bruto.startsWith("data:"))
  {
    return DATA_IMAGE_BASE64_RE.test(bruto) ? bruto : null;
  }

  try
  {
    const url = new URL(bruto, window.location.origin);
    const protocolo = url.protocol;

    if (protocolo === "http:" || protocolo === "https:")
    {
      return url.toString();
    }

    return null;
  }

  catch (e)
  {
    return null;
  }
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
