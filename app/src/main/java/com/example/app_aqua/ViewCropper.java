package com.example.app_aqua;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;

/**
 * View de recorte "estilo WhatsApp": a janela de recorte é FIXA no centro
 * da tela (círculo ou retângulo arredondado) e o usuário arrasta a foto e
 * dá zoom com dois dedos para encaixá-la atrás da janela.
 *
 * O recorte final é calculado transformando a janela (coordenadas de
 * tela) de volta para os pixels da foto, usando a matriz inversa.
 */
public class ViewCropper extends View {

    // Zoom máximo permitido em relação ao zoom mínimo (efeito "cover")
    private static final float ZOOM_MAXIMO = 6f;

    private Bitmap imagem;

    // Proporção (largura/altura) e formato da janela de recorte
    private float proporcao = 1f;
    private boolean circular = true;

    // Transformação foto → tela (e a inversa, para calcular o recorte)
    private final Matrix matriz = new Matrix();
    private final Matrix inversa = new Matrix();

    // Menor escala possível: a foto cobrindo a janela inteira
    private float zoomMinimo = 1f;

    // Janela de recorte, em coordenadas da tela
    private final RectF janela = new RectF();

    // Pincéis (criados uma vez só, para não gerar lixo a cada frame)
    private final Paint pincelFora = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint pincelContorno = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Path mascara = new Path();

    // Gestos: arrastar com 1 dedo, zoom com 2
    private final GestureDetector gestosArrasto;
    private final ScaleGestureDetector gestosZoom;

    public ViewCropper(Context contexto) {
        this(contexto, null);
    }

    public ViewCropper(Context contexto, AttributeSet atributos) {
        super(contexto, atributos);

        gestosZoom =
                new ScaleGestureDetector(
                        contexto,
                        new ScaleGestureDetector
                                .SimpleOnScaleGestureListener() {

                            @Override
                            public boolean onScale(
                                    ScaleGestureDetector detector
                            ) {

                                aplicarZoom(
                                        detector.getScaleFactor(),
                                        detector.getFocusX(),
                                        detector.getFocusY()
                                );

                                return true;
                            }
                        }
                );

        gestosArrasto =
                new GestureDetector(
                        contexto,
                        new GestureDetector.SimpleOnGestureListener() {

                            @Override
                            public boolean onDown(MotionEvent e) {
                                // Precisa "aceitar" o toque para o arrasto funcionar
                                return true;
                            }

                            @Override
                            public boolean onScroll(
                                    MotionEvent inicio,
                                    MotionEvent atual,
                                    float distanciaX,
                                    float distanciaY
                            ) {

                                // A foto acompanha o dedo
                                mover(
                                        -distanciaX,
                                        -distanciaY
                                );

                                return true;
                            }
                        }
                );

        pincelFora.setColor(0x99000000);
        pincelFora.setStyle(Paint.Style.FILL);

        pincelContorno.setColor(Color.WHITE);
        pincelContorno.setStyle(Paint.Style.STROKE);
        pincelContorno.setStrokeWidth(2f);
    }

    /**
     * Define a foto que será recortada e o formato da janela.
     *
     * @param proporcaoJanela largura/altura da janela (ex.: 1 = quadrado)
     * @param janelaCircular true = janela circular (avatar), false = retângulo
     */
    public void configurar(
            Bitmap novaImagem,
            float proporcaoJanela,
            boolean janelaCircular
    ) {

        imagem = novaImagem;
        proporcao = proporcaoJanela;
        circular = janelaCircular;

        if (getWidth() > 0 && getHeight() > 0) {
            enquadrar();
        }

        invalidate();
    }

    // ===================== ENQUADRAMENTO =====================

    @Override
    protected void onSizeChanged(
            int largura,
            int altura,
            int larguraAntiga,
            int alturaAntiga
    ) {
        super.onSizeChanged(
                largura,
                altura,
                larguraAntiga,
                alturaAntiga
        );

        if (largura > 0 && altura > 0) {
            enquadrar();
        }
    }

    /**
     * Calcula a janela de recorte no centro e encaixa a foto nela
     * (efeito "cover": a foto sempre cobre a janela por inteiro).
     */
    private void enquadrar() {

        if (imagem == null) {
            return;
        }

        // Janela: 80% da largura da view, respeitando a proporção
        float largura = getWidth() * 0.8f;
        float altura = largura / proporcao;

        // Não deixa a janela passar de 75% da altura disponível
        if (altura > getHeight() * 0.75f) {
            altura = getHeight() * 0.75f;
            largura = altura * proporcao;
        }

        float centroX = getWidth() / 2f;
        float centroY = getHeight() / 2f;

        janela.set(
                centroX - largura / 2f,
                centroY - altura / 2f,
                centroX + largura / 2f,
                centroY + altura / 2f
        );

        // Zoom mínimo = a foto cobre a janela inteira
        zoomMinimo = Math.max(
                janela.width() / imagem.getWidth(),
                janela.height() / imagem.getHeight()
        );

        matriz.reset();

        // Centraliza a foto no meio da janela, já na escala mínima
        float fotoLargura = imagem.getWidth() * zoomMinimo;
        float fotoAltura = imagem.getHeight() * zoomMinimo;

        matriz.postScale(zoomMinimo, zoomMinimo);

        matriz.postTranslate(
                janela.centerX() - fotoLargura / 2f,
                janela.centerY() - fotoAltura / 2f
        );

        limitar();
    }

    // ===================== GESTOS =====================

    @Override
    public boolean onTouchEvent(MotionEvent evento) {

        gestosZoom.onTouchEvent(evento);
        gestosArrasto.onTouchEvent(evento);

        return true;
    }

    private void aplicarZoom(float fator, float focoX, float focoY) {

        if (imagem == null) {
            return;
        }

        float zoomAtual = zoomAtual();

        float zoomNovo = zoomAtual * fator;

        // Limita entre o zoom mínimo ("cover") e o máximo
        zoomNovo = Math.max(
                zoomMinimo,
                Math.min(zoomNovo, zoomMinimo * ZOOM_MAXIMO)
        );

        fator = zoomNovo / zoomAtual;

        // Zoom "saindo" do ponto onde os dedos estão tocando
        matriz.postScale(fator, fator, focoX, focoY);

        limitar();
        invalidate();
    }

    private void mover(float dx, float dy) {

        if (imagem == null) {
            return;
        }

        matriz.postTranslate(dx, dy);

        limitar();
        invalidate();
    }

    /**
     * Garante que a foto continue cobrindo a janela: se o usuário
     * arrastar ou afastar demais, a foto volta para dentro dos limites.
     */
    private void limitar() {

        RectF foto = new RectF(
                0, 0,
                imagem.getWidth(),
                imagem.getHeight()
        );

        matriz.mapRect(foto);

        float dx = 0f;
        float dy = 0f;

        if (foto.width() >= janela.width()) {

            if (foto.left > janela.left) {
                dx = janela.left - foto.left;
            } else if (foto.right < janela.right) {
                dx = janela.right - foto.right;
            }

        } else {
            dx = janela.centerX() - foto.centerX();
        }

        if (foto.height() >= janela.height()) {

            if (foto.top > janela.top) {
                dy = janela.top - foto.top;
            } else if (foto.bottom < janela.bottom) {
                dy = janela.bottom - foto.bottom;
            }

        } else {
            dy = janela.centerY() - foto.centerY();
        }

        if (dx != 0f || dy != 0f) {
            matriz.postTranslate(dx, dy);
        }
    }

    private float zoomAtual() {

        float[] valores = new float[9];

        matriz.getValues(valores);

        return valores[Matrix.MSCALE_X];
    }

    // ===================== DESENHO =====================

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        if (imagem == null) {
            return;
        }

        // 1) A foto, na posição/zoom atuais
        canvas.drawBitmap(imagem, matriz, null);

        // 2) Escurece tudo MENOS a janela de recorte
        mascara.reset();
        mascara.setFillType(Path.FillType.EVEN_ODD);

        mascara.addRect(
                0f, 0f,
                getWidth(), getHeight(),
                Path.Direction.CW
        );

        if (circular) {
            mascara.addCircle(
                    janela.centerX(),
                    janela.centerY(),
                    janela.width() / 2f,
                    Path.Direction.CW
            );
        } else {
            mascara.addRoundRect(
                    janela,
                    24f, 24f,
                    Path.Direction.CW
            );
        }

        canvas.drawPath(mascara, pincelFora);

        // 3) Contorno da janela
        if (circular) {
            canvas.drawCircle(
                    janela.centerX(),
                    janela.centerY(),
                    janela.width() / 2f,
                    pincelContorno
            );
        } else {
            canvas.drawRoundRect(
                    janela,
                    24f, 24f,
                    pincelContorno
            );
        }
    }

    // ===================== RECORTAR =====================

    /**
     * Devolve o pedaço da foto que está dentro da janela de recorte.
     */
    public Bitmap recortar() {

        if (imagem == null) {
            return null;
        }

        // Converte a janela (coordenadas de tela) para pixels da foto
        matriz.invert(inversa);

        RectF area = new RectF(janela);
        inversa.mapRect(area);

        int x = Math.max(0, (int) area.left);
        int y = Math.max(0, (int) area.top);

        int largura = Math.min(
                imagem.getWidth() - x,
                (int) area.width()
        );

        int altura = Math.min(
                imagem.getHeight() - y,
                (int) area.height()
        );

        if (largura <= 0 || altura <= 0) {
            return null;
        }

        return Bitmap.createBitmap(
                imagem,
                x, y,
                largura, altura
        );
    }
}
