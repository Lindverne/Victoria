package com.example.app_aqua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

/**
 * Adapter do carrossel (ViewPager2) da tela Início.
 *
 * O ViewPager2 usa um RecyclerView.Adapter "por baixo dos panos":
 * cada item da lista é um slide que ocupa a tela inteira, e o
 * deslizar do dedo troca o item — exatamente como num RecyclerView.
 */
public class AdapterCarrossel extends RecyclerView.Adapter<AdapterCarrossel.SlideViewHolder> {

    /**
     * Modelo simples de um slide: tag (rótulo pequeno), título, descrição
     * e (opcionalmente) uma imagem de fundo própria.
     */
    public static class Slide {

        public final String tag;
        public final String titulo;
        public final String descricao;

        // 0 = sem imagem própria → usa a foto padrão do layout (bg_global)
        public final int imagemRes;

        public Slide(String tag, String titulo, String descricao) {
            this(tag, titulo, descricao, 0);
        }

        public Slide(
                String tag,
                String titulo,
                String descricao,
                int imagemRes
        ) {
            this.tag = tag;
            this.titulo = titulo;
            this.descricao = descricao;
            this.imagemRes = imagemRes;
        }
    }

    private final List<Slide> slides;

    public AdapterCarrossel(List<Slide> slides) {
        this.slides = slides;
    }

    @NonNull
    @Override
    public SlideViewHolder onCreateViewHolder(
            @NonNull ViewGroup parent,
            int viewType
    ) {

        // Cria a "casca" visual de um slide a partir do XML
        View view =
                LayoutInflater
                        .from(parent.getContext())
                        .inflate(
                                R.layout.item_slide_carrossel,
                                parent,
                                false
                        );

        return new SlideViewHolder(view);
    }

    @Override
    public void onBindViewHolder(
            @NonNull SlideViewHolder holder,
            int position
    ) {

        // Preenche a casca com os dados do slide desta posição
        Slide slide = slides.get(position);

        holder.txtTag.setText(slide.tag);
        holder.txtTitulo.setText(slide.titulo);
        holder.txtDescricao.setText(slide.descricao);

        // Se o slide tiver uma imagem própria, troca a foto de fundo
        if (slide.imagemRes != 0) {
            holder.imgFundo.setImageResource(slide.imagemRes);
        }
    }

    @Override
    public int getItemCount() {
        return slides.size();
    }

    static class SlideViewHolder extends RecyclerView.ViewHolder {

        ImageView imgFundo;
        TextView txtTag;
        TextView txtTitulo;
        TextView txtDescricao;

        SlideViewHolder(@NonNull View itemView) {
            super(itemView);

            imgFundo =
                    itemView.findViewById(R.id.imgSlideFundo);

            txtTag =
                    itemView.findViewById(R.id.txtSlideTag);

            txtTitulo =
                    itemView.findViewById(R.id.txtSlideTitulo);

            txtDescricao =
                    itemView.findViewById(R.id.txtSlideDescricao);
        }
    }
}
