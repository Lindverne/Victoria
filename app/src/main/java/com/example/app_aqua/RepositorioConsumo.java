package com.example.app_aqua;

import java.util.ArrayList;
import java.util.List;

/**
 * Histórico de cálculos de consumo, guardado em memória enquanto o
 * app estiver aberto.
 *
 * A TelaDashboard grava aqui a cada cálculo e a TelaRelatorios lê
 * daqui — assim as duas telas sempre mostram os mesmos dados, não
 * importa por qual aba o usuário navegou.
 *
 * Observação: por ser em memória, o histórico se perde quando o app
 * é fechado ou o sistema mata o processo (persistir em banco ou
 * SharedPreferences é um passo futuro).
 */
public class RepositorioConsumo
{
    // Mesmo limite que a lista do Dashboard sempre teve
    private static final int LIMITE_REGISTROS = 10;

    // Lista viva: os adapters do Dashboard e dos Relatórios leem dela
    private static final ArrayList<RegistroConsumo> registros =
            new ArrayList<>();

    private RepositorioConsumo()
    {
        // Classe utilitária — não deve ser instanciada
    }

    /**
     * Adiciona um cálculo no topo do histórico, respeitando o limite.
     */
    public static void adicionar(RegistroConsumo registro)
    {
        registros.add(0, registro);

        if (registros.size() > LIMITE_REGISTROS)
        {
            registros.remove(registros.size() - 1);
        }
    }

    /**
     * Lista viva de registros (o adapter do ListView aponta para ela).
     */
    public static List<RegistroConsumo> getRegistros()
    {
        return registros;
    }

    /**
     * Soma do consumo (m³) de todos os registros.
     */
    public static double consumoTotal()
    {
        double total = 0;

        for (RegistroConsumo registro : registros)
        {
            total += registro.getConsumo();
        }

        return total;
    }

    /**
     * Soma do custo total (R$) de todos os registros.
     */
    public static double custoTotal()
    {
        double total = 0;

        for (RegistroConsumo registro : registros)
        {
            total += registro.getValorTotal();
        }

        return total;
    }

    /**
     * Média de consumo (m³) por cálculo — zero quando não há registros.
     */
    public static double consumoMedio()
    {
        if (registros.isEmpty())
        {
            return 0;
        }

        return consumoTotal() / registros.size();
    }

    /**
     * Limpa o histórico (usado ao encerrar a sessão, para o próximo
     * usuário não ver os cálculos do anterior).
     */
    public static void limpar()
    {
        registros.clear();
    }
}
