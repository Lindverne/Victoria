package com.example.app_aqua;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager2.widget.ViewPager2;

import java.util.ArrayList;
import java.util.List;

public class TelaInicial extends AppCompatActivity {

    // Id do usuário logado, repassado entre as telas pela barra de abas
    private int usuarioId;

    // Carrossel da tela Início
    private ViewPager2 viewPagerCarrossel;
    private View dot1;
    private View dot2;

    // Abas da barra de navegação (a aba "Início" é a atual — não precisa de listener)
    private LinearLayout navDashboard;
    private LinearLayout navPerfil;
    private LinearLayout navRelatorios;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_index);

        usuarioId =
                getIntent().getIntExtra("usuario_id", 0);

        iniciarComponentes();
        configurarCarrossel();
        configurarNavegacao();
    }

    private void iniciarComponentes() {

        viewPagerCarrossel =
                findViewById(R.id.viewPagerCarrossel);

        dot1 =
                findViewById(R.id.dot1);

        dot2 =
                findViewById(R.id.dot2);

        navDashboard =
                findViewById(R.id.navDashboard);

        navPerfil =
                findViewById(R.id.navPerfil);

        navRelatorios =
                findViewById(R.id.navRelatorios);
    }

    private void configurarCarrossel() {

        // Conteúdo dos slides — cada um com sua própria imagem de fundo
        List<AdapterCarrossel.Slide> slides =
                new ArrayList<>();

        // Slide 1: mensagem de introdução ao projeto
        slides.add(
                new AdapterCarrossel.Slide(
                        getString(R.string.index_hero_subtitulo),
                        getString(R.string.index_hero_titulo),
                        getString(R.string.index_hero_descricao),
                        R.drawable.slide_carrossel_01
                )
        );

        // Slide 2: chamada para usar o leitor físico
        slides.add(
                new AdapterCarrossel.Slide(
                        getString(R.string.slide2_tag),
                        getString(R.string.slide2_titulo),
                        getString(R.string.slide2_desc),
                        R.drawable.slide_carrossel_02
                )
        );

        viewPagerCarrossel.setAdapter(
                new AdapterCarrossel(slides)
        );

        // Quando o usuário desliza, atualiza o indicador (dots)
        viewPagerCarrossel.registerOnPageChangeCallback(
                new ViewPager2.OnPageChangeCallback() {

                    @Override
                    public void onPageSelected(int position) {
                        atualizarDots(position);
                    }
                }
        );

        // Estado inicial: primeiro slide ativo
        atualizarDots(0);
    }

    private void atualizarDots(int posicao) {

        View ativo =
                (posicao == 0) ? dot1 : dot2;

        View inativo =
                (posicao == 0) ? dot2 : dot1;

        LinearLayout.LayoutParams paramsAtivo =
                new LinearLayout.LayoutParams(
                        dpParaPixel(32),
                        dpParaPixel(4)
                );

        LinearLayout.LayoutParams paramsInativo =
                new LinearLayout.LayoutParams(
                        dpParaPixel(20),
                        dpParaPixel(4)
                );

        // O dot2 SEMPRE tem 8dp de margem à esquerda (como definido no XML)
        if (ativo == dot2) {
            paramsAtivo.setMarginStart(
                    dpParaPixel(8));
        }

        if (inativo == dot2) {
            paramsInativo.setMarginStart(
                    dpParaPixel(8));
        }

        ativo.setLayoutParams(paramsAtivo);
        ativo.setBackgroundResource(R.drawable.bg_dot_ativo);

        inativo.setLayoutParams(paramsInativo);
        inativo.setBackgroundResource(R.drawable.bg_dot_inativo);
    }

    private int dpParaPixel(int dp) {

        return (int) (dp
                * getResources().getDisplayMetrics().density);
    }

    private void configurarNavegacao() {

        // Aba DASHBOARD
        navDashboard.setOnClickListener(
                v -> {
                    Intent intent =
                            new Intent(
                                    TelaInicial.this,
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
                                    TelaInicial.this,
                                    TelaPerfil.class
                            );

                    intent.putExtra(
                            "usuario_id",
                            usuarioId
                    );

                    startActivity(intent);
                }
        );

        // Aba RELATÓRIOS: abre a tela de relatórios
        navRelatorios.setOnClickListener(
                v -> {
                    Intent intent =
                            new Intent(
                                    TelaInicial.this,
                                    TelaRelatorios.class
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
