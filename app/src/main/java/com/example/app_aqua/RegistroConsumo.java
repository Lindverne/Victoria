package com.example.app_aqua;

import java.text.NumberFormat;
import java.util.Locale;

/**
 * Registro de um cálculo de consumo feito no Dashboard.
 *
 * Guarda os valores estruturados (não só texto formatado) para que a
 * tela de Relatórios possa somar, tirar médias e exibir detalhes.
 */
public class RegistroConsumo
{
    // Data do cálculo, já formatada (dd/MM/yyyy)
    private final String data;

    // Rótulo da categoria escolhida no spinner (ex.: "Residencial")
    private final String categoria;

    // Consumo do período, em metros cúbicos
    private final double consumo;

    // Valores calculados pela tabela da categoria
    private final double valorAgua;
    private final double valorEsgoto;
    private final double valorTotal;

    public RegistroConsumo(
            String data,
            String categoria,
            double consumo,
            double valorAgua,
            double valorEsgoto,
            double valorTotal
    )
    {
        this.data = data;
        this.categoria = categoria;
        this.consumo = consumo;
        this.valorAgua = valorAgua;
        this.valorEsgoto = valorEsgoto;
        this.valorTotal = valorTotal;
    }

    public String getData() { return data; }
    public String getCategoria() { return categoria; }
    public double getConsumo() { return consumo; }
    public double getValorAgua() { return valorAgua; }
    public double getValorEsgoto() { return valorEsgoto; }
    public double getValorTotal() { return valorTotal; }

    /**
     * Versão resumida — mesmo formato que o histórico do Dashboard
     * sempre usou (Data, Consumo e Total).
     */
    public String formatar()
    {
        return "Data: "
                + data
                + "\nConsumo: "
                + String.format(
                        Locale.getDefault(),
                        "%.2f",
                        consumo
                )
                + " m³"
                + "\nTotal: "
                + moeda().format(valorTotal);
    }

    /**
     * Versão detalhada — usada pela tela de Relatórios: inclui a
     * categoria e os valores de água e esgoto separados.
     */
    public String formatarDetalhado()
    {
        return "Data: "
                + data
                + "\nCategoria: "
                + categoria
                + "\nConsumo: "
                + String.format(
                        Locale.getDefault(),
                        "%.2f",
                        consumo
                )
                + " m³"
                + "\nÁgua: "
                + moeda().format(valorAgua)
                + "\nEsgoto: "
                + moeda().format(valorEsgoto)
                + "\nTotal: "
                + moeda().format(valorTotal);
    }

    private NumberFormat moeda()
    {
        return NumberFormat.getCurrencyInstance(
                new Locale("pt", "BR")
        );
    }
}
