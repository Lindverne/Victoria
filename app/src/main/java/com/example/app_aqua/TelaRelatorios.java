package com.example.app_aqua;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

/**
 * Tela de Relatórios — mostra os cálculos de consumo registrados pelo
 * Dashboard: um resumo com totais e médias no topo e, abaixo, a lista
 * detalhada de cada cálculo (data, categoria, consumo, água, esgoto e
 * total).
 *
 * Os dados vêm do RepositorioConsumo — a mesma lista que o Dashboard
 * exibe — então as duas telas sempre batem, não importa por qual aba
 * o usuário navegou.
 */
public class TelaRelatorios extends AppCompatActivity
{
    // Id do usuário logado, repassado entre as telas pela barra de abas
    private int usuarioId;

    // Resumo do topo da tela
    private TextView txtTotalRegistros;
    private TextView txtConsumoTotal;
    private TextView txtCustoTotal;
    private TextView txtConsumoMedio;

    // Lista detalhada dos cálculos
    private ListView listViewRelatorios;

    // Mensagem exibida quando ainda não há nenhum cálculo
    private TextView txtRelatoriosVazio;

    private AdapterRegistros adapter;

    // Abas da barra (a aba "Relatórios" é a atual — não precisa de listener)
    private LinearLayout navInicio;
    private LinearLayout navDashboard;
    private LinearLayout navPerfil;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_relatorios);

        usuarioId =
                getIntent().getIntExtra("usuario_id", 0);

        iniciarComponentes();
        configurarNavegacao();
    }

    @Override
    protected void onResume()
    {

        super.onResume();

        // Atualiza a cada volta à tela: pode ter cálculo novo no Dashboard
        atualizarRelatorio();
    }

    private void iniciarComponentes()
    {

        txtTotalRegistros =
                findViewById(R.id.txtTotalRegistros);

        txtConsumoTotal =
                findViewById(R.id.txtConsumoTotal);

        txtCustoTotal =
                findViewById(R.id.txtCustoTotal);

        txtConsumoMedio =
                findViewById(R.id.txtConsumoMedio);

        listViewRelatorios =
                findViewById(R.id.listViewRelatorios);

        txtRelatoriosVazio =
                findViewById(R.id.txtRelatoriosVazio);

        // true = formato detalhado (com categoria, água e esgoto)
        adapter =
                new AdapterRegistros(
                        this,
                        true
                );

        listViewRelatorios.setAdapter(adapter);

        navInicio =
                findViewById(R.id.navInicio);

        navDashboard =
                findViewById(R.id.navDashboard);

        navPerfil =
                findViewById(R.id.navPerfil);
    }

    /**
     * Preenche o resumo e a lista com os cálculos guardados no
     * RepositorioConsumo (os mesmos que o Dashboard registra).
     */
    private void atualizarRelatorio()
    {

        List<RegistroConsumo> registros =
                RepositorioConsumo.getRegistros();

        NumberFormat moeda =
                NumberFormat.getCurrencyInstance(
                        new Locale("pt", "BR")
                );

        txtTotalRegistros.setText(
                String.format(
                        Locale.getDefault(),
                        "%d",
                        registros.size()
                )
        );

        txtConsumoTotal.setText(
                String.format(
                        Locale.getDefault(),
                        "%.2f m³",
                        RepositorioConsumo.consumoTotal()
                )
        );

        txtCustoTotal.setText(
                moeda.format(
                        RepositorioConsumo.custoTotal()
                )
        );

        txtConsumoMedio.setText(
                String.format(
                        Locale.getDefault(),
                        "%.2f m³",
                        RepositorioConsumo.consumoMedio()
                )
        );

        adapter.notifyDataSetChanged();

        // Sem cálculos ainda: mostra o aviso e esconde a lista
        boolean semRegistros = registros.isEmpty();

        txtRelatoriosVazio.setVisibility(
                semRegistros ? View.VISIBLE : View.GONE
        );

        listViewRelatorios.setVisibility(
                semRegistros ? View.GONE : View.VISIBLE
        );
    }

    private void configurarNavegacao()
    {

        // Aba INÍCIO
        navInicio.setOnClickListener(
                v -> {
                    Intent intent =
                            new Intent(
                                    TelaRelatorios.this,
                                    TelaInicial.class
                            );

                    intent.putExtra(
                            "usuario_id",
                            usuarioId
                    );

                    startActivity(intent);
                }
        );

        // Aba DASHBOARD
        navDashboard.setOnClickListener(
                v -> {
                    Intent intent =
                            new Intent(
                                    TelaRelatorios.this,
                                    TelaDashboard.class
                            );

                    intent.putExtra(
                            "usuario_id",
                            usuarioId
                    );

                    startActivity(intent);
                }
        );

        // Aba PERFIL
        navPerfil.setOnClickListener(
                v -> {
                    Intent intent =
                            new Intent(
                                    TelaRelatorios.this,
                                    TelaPerfil.class
                            );

                    intent.putExtra(
                            "usuario_id",
                            usuarioId
                    );

                    startActivity(intent);
                }
        );
    }
}
