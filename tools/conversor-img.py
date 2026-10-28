import os
from PIL import Image

def converter_para_png(diretorio_raiz):
    extensoes_para_converter = ('.jpg', '.jpeg', '.webp', '.bmp', '.jfif', '.tiff')
    
    print(f"🚀 Iniciando conversão de imagens em todo o projeto: {diretorio_raiz}")

    for raiz, _, arquivos in os.walk(diretorio_raiz):

        if "tools" in raiz.split(os.sep):
            continue

        for arquivo in arquivos:
            nome_sem_ext, extensao = os.path.splitext(arquivo)
            extensao = extensao.lower()

            if extensao in extensoes_para_converter:
                caminho_origem = os.path.join(raiz, arquivo)
                caminho_destino = os.path.join(raiz, nome_sem_ext + ".png")

                try:

                    with Image.open(caminho_origem) as img:
                        img_convertida = img.convert("RGBA")
                        img_convertida.save(caminho_destino, "PNG")
                    
                    os.remove(caminho_origem)
                    print(f"✅ Convertido: {arquivo} -> {nome_sem_ext}.png")
                except Exception as e:
                    print(f"❌ Erro ao converter {arquivo}: {e}")

if __name__ == "__main__":
    caminho_raiz = os.path.abspath(os.path.join(os.getcwd(), ".."))
    converter_para_png(caminho_raiz)
