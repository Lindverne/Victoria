package com.example.app_aqua;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

/**
 * Adapter da lista de registros de consumo, usada no Dashboard e nos
 * Relatórios. Cada linha é um RegistroConsumo renderizado como texto
 * de várias linhas.
 *
 * Os dois usos diferem só no nível de detalhe:
 * - Dashboard  → versão resumida (Data, Consumo, Total);
 * - Relatórios → versão detalhada (+ Categoria, Água e Esgoto).
 */
public class AdapterRegistros extends ArrayAdapter<RegistroConsumo>
{
    // true = versão detalhada (Relatórios); false = resumida (Dashboard)
    private final boolean detalhado;

    public AdapterRegistros(Context contexto, boolean detalhado)
    {
        super(
                contexto,
                android.R.layout.simple_list_item_1,
                RepositorioConsumo.getRegistros()
        );

        this.detalhado = detalhado;
    }

    @Override
    public View getView(
            int posicao,
            View itemExistente,
            ViewGroup pai
    )
    {
        TextView item =
                (TextView) super.getView(posicao, itemExistente, pai);

        RegistroConsumo registro = getItem(posicao);

        item.setText(
                detalhado
                        ? registro.formatarDetalhado()
                        : registro.formatar()
        );

        return item;
    }
}
