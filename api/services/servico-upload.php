<?php

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../config/registrar-log.php';

class ServicoUpload
{
    private PDO $conn;
    private int $usuarioId;
    private string $diretorioUpload;
    private array $tiposMimePermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    private array $extensoesPermitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    private int $tamanhoMaximo = 5 * 1024 * 1024; 

    public function __construct(PDO $conn, int $usuarioId, string $subdiretorioUpload = 'noticias')
    {
        $this->conn = $conn;
        $this->usuarioId = $usuarioId;
        $this->diretorioUpload = __DIR__ . '/../../public/assets/img/pages/' . $subdiretorioUpload . '/';
        
        if (!is_dir($this->diretorioUpload)) {
            @mkdir($this->diretorioUpload, 0750, true);
        }

    }

    
    public function processarUploadArquivo(array $arquivo): array
    {
        
        if ($arquivo['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Erro no upload do arquivo.');
        }

        
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $tipoMime = $finfo->file($arquivo['tmp_name']);
        
        if (!in_array($tipoMime, $this->tiposMimePermitidos)) {
            throw new Exception('Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.');
        }

        
        if ($arquivo['size'] > $this->tamanhoMaximo) {
            throw new Exception('Arquivo muito grande. Máximo: 5MB.');
        }

        
        $infoImagem = getimagesize($arquivo['tmp_name']);

        if ($infoImagem === false) {
            throw new Exception('Arquivo não é uma imagem válida.');
        }

        
        return $this->salvarArquivo($arquivo['tmp_name'], $tipoMime, 'upload');
    }

    
    public function processarUploadBase64(string $payloadBase64): array
    {
        
        if (!preg_match('/^data:image\/(\w+);base64,/', $payloadBase64, $matches)) {
            throw new Exception('Formato de dados inválido. Use data URI base64.');
        }

        $tipo = strtolower($matches[1]);
        
        
        $mapaExt = [
            'jpeg' => 'jpg',
            'jpg' => 'jpg',
            'png' => 'png',
            'gif' => 'gif',
            'webp' => 'webp',
        ];
        
        if (!isset($mapaExt[$tipo])) {
            throw new Exception('Tipo de imagem não permitido.');
        }
        
        $ext = $mapaExt[$tipo];
        $tipoMime = 'image/' . ($tipo === 'jpg' ? 'jpeg' : $tipo);

        
        $dados = base64_decode(explode(',', $payloadBase64)[1]);
        
        if ($dados === false || strlen($dados) > $this->tamanhoMaximo) {
            throw new Exception('Dados de imagem inválidos ou muito grandes.');
        }

        
        $img = @imagecreatefromstring($dados);

        if ($img === false) {
            throw new Exception('Dados não correspondem a uma imagem válida.');
        }

        imagedestroy($img);

        
        return $this->salvarDados($dados, $ext, $tipoMime, 'base64');
    }

    
    private function salvarArquivo(string $caminhoTmp, string $tipoMime, string $origem): array
    {
        $ext = $this->mimeParaExtensao($tipoMime);
        $nomeArquivo = $this->gerarNomeArquivo($ext);
        $caminhoArquivo = $this->diretorioUpload . $nomeArquivo;

        if (!move_uploaded_file($caminhoTmp, $caminhoArquivo)) {
            throw new Exception('Erro ao salvar arquivo.');
        }

        return $this->finalizarUpload($nomeArquivo, $tipoMime, $origem);
    }

    
    private function salvarDados(string $dados, string $ext, string $tipoMime, string $origem): array
    {
        $nomeArquivo = $this->gerarNomeArquivo($ext);
        $caminhoArquivo = $this->diretorioUpload . $nomeArquivo;

        if (file_put_contents($caminhoArquivo, $dados) === false) {
            throw new Exception('Erro ao salvar arquivo.');
        }

        return $this->finalizarUpload($nomeArquivo, $tipoMime, $origem);
    }

    
    private function finalizarUpload(string $nomeArquivo, string $tipoMime, string $origem): array
    {
        
        $caminhoRelativo = $nomeArquivo;

        registrarLog($this->conn, $this->usuarioId, 'noticias', 'Upload de imagem', 
            "Imagem {$nomeArquivo} enviada via {$origem}");

        return [
            'success' => true,
            'url' => $caminhoRelativo,
            'path' => $caminhoRelativo,
            'filename' => $nomeArquivo,
            'mime_type' => $tipoMime,
        ];
    }

    private function mimeParaExtensao(string $tipoMime): string
    {
        return match($tipoMime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            default => 'jpg',
        };
    }

    private function gerarNomeArquivo(string $ext): string
    {
        return 'noticia_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    }

    
    public static function validarImagem(string $caminhoTmp): bool
    {
        $infoImagem = getimagesize($caminhoTmp);
        return $infoImagem !== false;
    }

}
