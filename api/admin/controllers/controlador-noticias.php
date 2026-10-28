<?php

declare(strict_types=1);

namespace Victoria\Admin\Controllers;

require_once __DIR__ . '/../controlador-admin-crud.php';

use Victoria\Admin\ControladorAdminCrud;
use PDO;

class ControladorNoticias extends ControladorAdminCrud
{
    public function __construct(PDO $conn, int $usuarioId)
    {
        parent::__construct($conn, $usuarioId);
        
        $this->tabela = 'noticias';
        $this->moduloLog = 'noticias';
        
        $this->colunasListar = [
            'id', 'titulo', 'resumo', 'conteudo', 'imagem_capa', 'categoria',
            'fonte', 'destaque', 'status', 'visualizacoes',
            "DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at",
            "DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at",
        ];
        
        $this->colunasCriar = ['id_autor', 'titulo', 'resumo', 'conteudo', 'imagem_capa', 'categoria', 'fonte', 'destaque', 'status'];
        $this->colunasAtualizar = ['titulo', 'resumo', 'conteudo', 'imagem_capa', 'categoria', 'fonte', 'destaque', 'status'];
        $this->colunasObrigatoriasCriar = ['titulo', 'resumo', 'conteudo', 'categoria'];
        $this->colunasObrigatoriasAtualizar = ['titulo', 'resumo', 'conteudo', 'categoria'];
    }

    protected function handleCreate(array $input): void
    {
        $input['id_autor'] = $this->usuarioId;

        parent::handleCreate($input);
    }

    protected function validacoesExtrasCriar(array $input): void
    {

        if (empty($input['titulo'])) {
            throw new \Exception('O título é obrigatório.');
        }

        if (empty($input['resumo'])) {
            throw new \Exception('O resumo é obrigatório.');
        }

        if (empty($input['conteudo'])) {
            throw new \Exception('O conteúdo é obrigatório.');
        }

        if (empty($input['categoria'])) {
            throw new \Exception('A categoria é obrigatória.');
        }

    }

    protected function validacoesExtrasAtualizar(array $input, int $id): void
    {
        
    }

    protected function sanitizarValor(string $campo, mixed $valor): mixed
    {

        if (in_array($campo, ['destaque', 'status'], true)) {
            return (int) $valor;
        }

        if ($campo === 'id_autor') {
            return (int) $valor;
        }

        return parent::sanitizarValor($campo, $valor);
    }

}
