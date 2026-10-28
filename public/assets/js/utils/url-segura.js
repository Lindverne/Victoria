export function urlImagemSegura(valor)
{
  if (typeof valor !== "string")
  {
    return false;
  }

  const url = valor.trim().toLowerCase();

  if (url === "")
  {
    return false;
  }

  const schemesProibidos = ["javascript:", "vbscript:", "file:", "ftp:", "about:"];

  for (const scheme of schemesProibidos)
  {
    if (url.startsWith(scheme))
    {
      return false;
    }

  }

  if (url.startsWith("data:") && !url.startsWith("data:image/"))
  {
    return false;
  }

  return true;
}
