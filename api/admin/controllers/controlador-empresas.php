<?php

declare(strict_types=1);

namespace Victoria\Admin\Controllers;

require_once __DIR__ . '/../controlador-admin-crud.php';

use Victoria\Admin\ControladorAdminCrud;
use PDO;

class ControladorEmpresas extends ControladorAdminCrud
{
    public function __construct(PDO $conn, int $usuarioId)
    {
        parent::__construct($conn, $usuarioId);
        
        $this->tabela = 'empresas';
        $this->moduloLog = 'admin';
        
        $this->colunasListar = [
            'id',
            'nome',
            'cidade',
            'estado',
            'status',
            "DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at",
            "DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at",
        ];
        
        $this->colunasCriar = ['nome', 'cidade', 'estado', 'status'];
        $this->colunasAtualizar = ['nome', 'cidade', 'estado', 'status'];
        $this->colunasObrigatoriasCriar = ['nome'];
        $this->colunasObrigatoriasAtualizar = ['nome'];
    }

    protected function validacoesExtrasCriar(array $input): void
    {

        if (empty($input['nome'])) {
            throw new \Exception('Nome da empresa é obrigatório.');
        }

    }

    protected function validacoesExtrasAtualizar(array $input, int $id): void
    {

        if (empty($input['nome'])) {
            throw new \Exception('Nome da empresa é obrigatório.');
        }

    }

    protected function sanitizarValor(string $campo, mixed $valor): mixed
    {

        if ($campo === 'status') {
            return (int) $valor;
        }

        return parent::sanitizarValor($campo, $valor);
    }

    protected function verificarDependenciasDelete(int $id): void
    {
        $stmt = $this->conn->prepare('SELECT COUNT(*) FROM usuarios WHERE id_empresa = ?');
        $stmt->execute([$id]);
        $vinculados = (int) $stmt->fetchColumn();

        if ($vinculados > 0) {
            throw new \Exception("Esta empresa possui {$vinculados} usuário(s) vinculado(s). Remova-os primeiro.");
        }

    }

}
