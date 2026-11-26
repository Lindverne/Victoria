package com.example.app_aqua;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TelaPerfil extends AppCompatActivity {

    // Redução automática antes do envio:
    // lado máximo da imagem (px) e qualidade do JPEG (0–100)
    private static final int TAMANHO_MAXIMO_PX = 1000;
    private static final int QUALIDADE_JPEG = 80;

    // Id do usuário logado, enviado pela TelaDashboard
    private int usuarioId;

    // Dados do usuário, buscados no servidor
    private TextView perfilNome;
    private TextView perfilEmail;

    // Fotos do perfil (avatar circular e banner)
    private ImageView imgAvatar;
    private ImageView imgBanner;

    private LinearLayout btnEditarBanner;
    private ImageButton btnEditarAvatar;
    private Button btnEditarPerfil;

    // Botão de sair, no fim da página
    private Button btnSairPerfil;

    // Descrição (bio) do perfil — bloco próprio, acima dos metadados
    private TextView perfilBio;

    // Campos de texto do bloco de metadados (perfilMetaInline)
    private TextView perfilCidade;
    private TextView perfilProfissao;
    private TextView perfilWebsite;
    private TextView perfilTelefone;
    private TextView perfilDataNascimento;

    // Valores atuais (para pré-preencher o diálogo de edição)
    private String cidadeAtual = "";
    private String profissaoAtual = "";
    private String websiteAtual = "";
    private String telefoneAtual = "";
    private String dataNascimentoAtual = "";
    private String bioAtual = "";

    // Abas da barra de navegação (a aba "Perfil" é a atual — não precisa de listener)
    private LinearLayout navInicio;
    private LinearLayout navDashboard;
    private LinearLayout navRelatorios;

    // Qual imagem está sendo trocada no momento: "avatar" ou "banner"
    private String tipoImagemAtual = "";

    // Seletor de imagem da galeria (API moderna de ActivityResult)
    private final ActivityResultLauncher<String> seletorImagem =
            registerForActivityResult(
                    new ActivityResultContracts.GetContent(),
                    uri -> {
                        if (uri != null) {
                            imagemEscolhida(uri);
                        }
                    }
            );

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_perfil);

        usuarioId =
                getIntent().getIntExtra("usuario_id", 0);

        iniciarComponentes();
        configurarEventos();
        configurarNavegacao();
        carregarPerfil();
    }

    private void iniciarComponentes() {

        perfilNome =
                findViewById(R.id.perfilNome);

        perfilEmail =
                findViewById(R.id.perfilEmail);

        perfilBio =
                findViewById(R.id.perfilBio);

        imgAvatar =
                findViewById(R.id.imgAvatar);

        imgBanner =
                findViewById(R.id.imgBanner);

        btnEditarBanner =
                findViewById(R.id.btnEditarBanner);

        btnEditarAvatar =
                findViewById(R.id.btnEditarAvatar);

        btnEditarPerfil =
                findViewById(R.id.btnEditarPerfil);

        perfilCidade =
                findViewById(R.id.perfilCidade);

        perfilProfissao =
                findViewById(R.id.perfilProfissao);

        perfilWebsite =
                findViewById(R.id.perfilWebsite);

        perfilTelefone =
                findViewById(R.id.perfilTelefone);

        perfilDataNascimento =
                findViewById(R.id.perfilDataNascimento);

        navInicio =
                findViewById(R.id.navInicio);

        navDashboard =
                findViewById(R.id.navDashboard);

        navRelatorios =
                findViewById(R.id.navRelatorios);

        btnSairPerfil =
                findViewById(R.id.btnSairPerfil);
    }

    // ===================== TROCAR FOTOS (AVATAR / BANNER) =====================

    private void configurarEventos() {

        // Toque na câmera: troca a FOTO DE PERFIL (avatar)
        btnEditarAvatar.setOnClickListener(
                v -> abrirGaleria("avatar")
        );

        // Toque em "Alterar Wallpaper": troca a foto do BANNER
        btnEditarBanner.setOnClickListener(
                v -> abrirGaleria("banner")
        );

        // Abre a edição dos metadados (cidade, profissão, website…)
        btnEditarPerfil.setOnClickListener(
                v -> abrirEditarPerfil()
        );

        // Botão no fim da página: pede confirmação antes de sair
        btnSairPerfil.setOnClickListener(
                v -> confirmarSaida()
        );
    }

    private void abrirGaleria(String tipo) {

        tipoImagemAtual = tipo;

        seletorImagem.launch("image/*");
    }

    private void imagemEscolhida(Uri uri) {

        // Carrega já reduzida (máx. 1000px) e abre a tela de RECORTE
        try {

            Bitmap original =
                    carregarReduzida(uri);

            if (original == null) {
                avisarErroImagem();
                return;
            }

            abrirRecorte(original);

        } catch (Exception e) {
            avisarErroImagem();
        }
    }

    private void avisarErroImagem() {

        Toast.makeText(
                this,
                R.string.perfil_img_erro_processar,
                Toast.LENGTH_SHORT
        ).show();
    }

    private void enviarImagem(String base64) {

        API api =
                ApiClient
                        .getRetrofit()
                        .create(API.class);

        api.atualizarImagem(
                        usuarioId,
                        tipoImagemAtual,
                        base64
                )
                .enqueue(new Callback<>() {

                    @Override
                    public void onResponse(
                            Call<Resposta> call,
                            Response<Resposta> response
                    ) {

                        if (response.isSuccessful()
                                && response.body() != null) {

                            Toast.makeText(
                                    TelaPerfil.this,
                                    response.body().getMensagem(),
                                    Toast.LENGTH_SHORT
                            ).show();

                        } else {

                            Toast.makeText(
                                    TelaPerfil.this,
                                    R.string.perfil_img_erro_upload,
                                    Toast.LENGTH_SHORT
                            ).show();
                        }
                    }

                    @Override
                    public void onFailure(
                            Call<Resposta> call,
                            Throwable t
                    ) {

                        Toast.makeText(
                                TelaPerfil.this,
                                R.string.perfil_img_erro_upload,
                                Toast.LENGTH_SHORT
                        ).show();
                    }
                });
    }

    // ===================== RECORTE DA FOTO =====================

    private void abrirRecorte(Bitmap original) {

        // Avatar: janela quadrada (1:1) em formato de círculo
        // Banner: janela retangular (2:1)
        float proporcao =
                "avatar".equals(tipoImagemAtual) ? 1f : 2f;

        boolean circular =
                "avatar".equals(tipoImagemAtual);

        Dialog dialogo =
                new Dialog(this);

        dialogo.setContentView(
                R.layout.dialog_recorte
        );

        dialogo.show();

        // Deixa o diálogo quase em tela cheia, sem moldura
        dialogo
                .getWindow()
                .setBackgroundDrawable(
                        new ColorDrawable(Color.TRANSPARENT)
                );

        dialogo
                .getWindow()
                .setLayout(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                );

        ViewCropper cropper =
                dialogo.findViewById(R.id.viewCropper);

        cropper.configurar(
                original,
                proporcao,
                circular
        );

        dialogo
                .findViewById(R.id.btnCancelarRecorte)
                .setOnClickListener(v -> dialogo.dismiss());

        dialogo
                .findViewById(R.id.btnConfirmarRecorte)
                .setOnClickListener(
                        v -> {

                            Bitmap recorte =
                                    cropper.recortar();

                            dialogo.dismiss();

                            if (recorte != null) {
                                imagemPronta(recorte);
                            }
                        }
                );
    }

    /**
     * Recebe o bitmap já RECORTADO, comprime em JPEG, converte
     * para base64, mostra na tela e envia ao servidor.
     */
    private void imagemPronta(Bitmap bitmap) {

        ByteArrayOutputStream saida =
                new ByteArrayOutputStream();

        bitmap.compress(
                Bitmap.CompressFormat.JPEG,
                QUALIDADE_JPEG,
                saida
        );

        String base64 =
                Base64.encodeToString(
                        saida.toByteArray(),
                        Base64.NO_WRAP
                );

        // Mostra na hora (feedback imediato) e salva no servidor
        if ("avatar".equals(tipoImagemAtual)) {
            imgAvatar.setImageBitmap(bitmap);
        } else {
            imgBanner.setImageBitmap(bitmap);
        }

        enviarImagem(base64);
    }

    private Bitmap carregarReduzida(Uri uri) throws Exception {

        // 1ª leitura: pega apenas as DIMENSÕES (inJustDecodeBounds = true)
        BitmapFactory.Options medicoes =
                new BitmapFactory.Options();

        medicoes.inJustDecodeBounds = true;

        InputStream entrada =
                getContentResolver().openInputStream(uri);

        BitmapFactory.decodeStream(
                entrada,
                null,
                medicoes
        );

        entrada.close();

        // Calcula o fator de redução (sempre potência de 2)
        int amostra = 1;

        while (medicoes.outWidth / amostra > TAMANHO_MAXIMO_PX
                || medicoes.outHeight / amostra > TAMANHO_MAXIMO_PX) {

            amostra = amostra * 2;
        }

        // 2ª leitura: decodifica já reduzida
        BitmapFactory.Options opcoes =
                new BitmapFactory.Options();

        opcoes.inSampleSize = amostra;

        InputStream imagem =
                getContentResolver().openInputStream(uri);

        Bitmap bitmap =
                BitmapFactory.decodeStream(
                        imagem,
                        null,
                        opcoes
                );

        imagem.close();

        return bitmap;
    }

    // ===================== EDITAR PERFIL (METADADOS) =====================

    private void abrirEditarPerfil() {

        Dialog dialogo =
                new Dialog(this);

        dialogo.setContentView(
                R.layout.dialog_editar_perfil
        );

        dialogo.show();

        dialogo
                .getWindow()
                .setBackgroundDrawable(
                        new ColorDrawable(Color.TRANSPARENT)
                );

        dialogo
                .getWindow()
                .setLayout(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                );

        EditText inputBio =
                dialogo.findViewById(R.id.inputBio);

        EditText inputCidade =
                dialogo.findViewById(R.id.inputCidade);

        EditText inputProfissao =
                dialogo.findViewById(R.id.inputProfissao);

        EditText inputWebsite =
                dialogo.findViewById(R.id.inputWebsite);

        EditText inputTelefone =
                dialogo.findViewById(R.id.inputTelefone);

        EditText inputDataNascimento =
                dialogo.findViewById(R.id.inputDataNascimento);

        // Pré-preenche com os valores atuais
        inputBio.setText(bioAtual);
        inputCidade.setText(cidadeAtual);
        inputProfissao.setText(profissaoAtual);
        inputWebsite.setText(websiteAtual);
        inputTelefone.setText(telefoneAtual);
        inputDataNascimento.setText(dataNascimentoAtual);

        dialogo
                .findViewById(R.id.btnCancelarEditar)
                .setOnClickListener(v -> dialogo.dismiss());

        dialogo
                .findViewById(R.id.btnSalvarEditar)
                .setOnClickListener(
                        v -> {

                            String cidade =
                                    inputCidade
                                            .getText()
                                            .toString()
                                            .trim();

                            String profissao =
                                    inputProfissao
                                            .getText()
                                            .toString()
                                            .trim();

                            String website =
                                    inputWebsite
                                            .getText()
                                            .toString()
                                            .trim();

                            String telefone =
                                    inputTelefone
                                            .getText()
                                            .toString()
                                            .trim();

                            String dataNascimento =
                                    inputDataNascimento
                                            .getText()
                                            .toString()
                                            .trim();

                            String bio =
                                    inputBio
                                            .getText()
                                            .toString()
                                            .trim();

                            dialogo.dismiss();

                            salvarPerfil(
                                    cidade,
                                    profissao,
                                    website,
                                    telefone,
                                    dataNascimento,
                                    bio
                            );
                        }
                );
    }

    private void salvarPerfil(
            String cidade,
            String profissao,
            String website,
            String telefone,
            String dataNascimento,
            String bio
    ) {

        API api =
                ApiClient
                        .getRetrofit()
                        .create(API.class);

        api.atualizarPerfil(
                        usuarioId,
                        cidade,
                        profissao,
                        website,
                        telefone,
                        dataNascimento,
                        bio
                )
                .enqueue(new Callback<>() {

                    @Override
                    public void onResponse(
                            Call<Resposta> call,
                            Response<Resposta> response
                    ) {

                        if (response.isSuccessful()
                                && response.body() != null
                                && "sucesso".equals(
                                response.body().getStatus()
                        )) {

                            // Atualiza a tela com os valores salvos
                            aplicaMeta(
                                    cidade,
                                    profissao,
                                    website,
                                    telefone,
                                    dataNascimento,
                                    bio
                            );

                            Toast.makeText(
                                    TelaPerfil.this,
                                    response.body().getMensagem(),
                                    Toast.LENGTH_SHORT
                            ).show();

                        } else {

                            Toast.makeText(
                                    TelaPerfil.this,
                                    R.string.perfil_erro_atualizar,
                                    Toast.LENGTH_SHORT
                            ).show();
                        }
                    }

                    @Override
                    public void onFailure(
                            Call<Resposta> call,
                            Throwable t
                    ) {

                        Toast.makeText(
                                TelaPerfil.this,
                                R.string.perfil_erro_atualizar,
                                Toast.LENGTH_SHORT
                        ).show();
                    }
                });
    }

    /**
     * Aplica na tela os metadados vindos do servidor (carregarPerfil).
     */
    private void aplicarMetaNaTela(Resposta resultado) {

        aplicaMeta(
                resultado.getCidade(),
                resultado.getProfissao(),
                resultado.getWebsite(),
                resultado.getTelefone(),
                resultado.getDataNascimento(),
                resultado.getBio()
        );
    }

    /**
     * Mostra a bio e os metadados nos blocos da tela e guarda os valores
     * atuais para pré-preencher o diálogo na próxima edição.
     * Campo vazio volta a mostrar o placeholder da tela.
     */
    private void aplicaMeta(
            String cidade,
            String profissao,
            String website,
            String telefone,
            String dataNascimento,
            String bio
    ) {

        cidadeAtual = cidade == null ? "" : cidade;
        profissaoAtual = profissao == null ? "" : profissao;
        websiteAtual = website == null ? "" : website;
        telefoneAtual = telefone == null ? "" : telefone;
        dataNascimentoAtual = dataNascimento == null ? "" : dataNascimento;
        bioAtual = bio == null ? "" : bio;

        perfilBio.setText(
                bioAtual.isEmpty()
                        ? getString(R.string.perfil_bio_placeholder)
                        : bioAtual
        );

        perfilCidade.setText(
                cidadeAtual.isEmpty()
                        ? "…"
                        : cidadeAtual
        );

        perfilProfissao.setText(
                profissaoAtual.isEmpty()
                        ? "…"
                        : profissaoAtual
        );

        perfilWebsite.setText(
                websiteAtual.isEmpty()
                        ? getString(R.string.perfil_meta_website)
                        : websiteAtual
        );

        perfilTelefone.setText(
                telefoneAtual.isEmpty()
                        ? "…"
                        : telefoneAtual
        );

        perfilDataNascimento.setText(
                dataNascimentoAtual.isEmpty()
                        ? getString(R.string.perfil_meta_data_indisponivel)
                        : dataNascimentoAtual
        );
    }

    // ===================== DADOS DO PERFIL (SERVIDOR) =====================

    /**
     * Busca nome, email e fotos do usuário logado no servidor
     * (Perfil.php) e preenche os campos da tela.
     */
    private void carregarPerfil() {

        API api =
                ApiClient
                        .getRetrofit()
                        .create(API.class);

        api.perfil(usuarioId)
                .enqueue(new Callback<>() {

                    @Override
                    public void onResponse(
                            Call<Resposta> call,
                            Response<Resposta> response
                    ) {

                        if (response.isSuccessful()
                                && response.body() != null) {

                            Resposta resultado =
                                    response.body();

                            if ("sucesso".equals(
                                    resultado.getStatus()
                            )) {

                                perfilNome.setText(
                                        resultado.getNome()
                                );

                                perfilEmail.setText(
                                        resultado.getEmail()
                                );

                                aplicarImagensDoPerfil(
                                        resultado
                                );

                                aplicarMetaNaTela(
                                        resultado
                                );

                            } else {

                                Toast.makeText(
                                        TelaPerfil.this,
                                        resultado.getMensagem(),
                                        Toast.LENGTH_SHORT
                                ).show();
                            }

                        } else {

                            Toast.makeText(
                                    TelaPerfil.this,
                                    "Erro ao carregar o perfil",
                                    Toast.LENGTH_SHORT
                            ).show();
                        }
                    }

                    @Override
                    public void onFailure(
                            Call<Resposta> call,
                            Throwable t
                    ) {

                        Toast.makeText(
                                TelaPerfil.this,
                                "Falha de conexão",
                                Toast.LENGTH_SHORT
                        ).show();
                    }
                });
    }

    /**
     * Decodifica as fotos (base64 → Bitmap) recebidas do servidor
     * e coloca no avatar e no banner. Se o usuário ainda não enviou
     * nenhuma foto, mantém a aparência padrão da tela.
     */
    private void aplicarImagensDoPerfil(Resposta resultado) {

        try {

            if (resultado.getAvatar() != null) {

                byte[] bytes =
                        Base64.decode(
                                resultado.getAvatar(),
                                Base64.NO_WRAP
                        );

                imgAvatar.setImageBitmap(
                        BitmapFactory.decodeByteArray(
                                bytes,
                                0,
                                bytes.length
                        )
                );
            }

            if (resultado.getBanner() != null) {

                byte[] bytes =
                        Base64.decode(
                                resultado.getBanner(),
                                Base64.NO_WRAP
                        );

                imgBanner.setImageBitmap(
                        BitmapFactory.decodeByteArray(
                                bytes,
                                0,
                                bytes.length
                        )
                );
            }

        } catch (Exception e) {
            // Foto corrompida: ignora e mantém o padrão da tela
        }
    }

    // ===================== NAVEGAÇÃO (BARRA DE ABAS) =====================

    private void configurarNavegacao() {

        // Aba INÍCIO
        navInicio.setOnClickListener(
                v -> {
                    Intent intent =
                            new Intent(
                                    TelaPerfil.this,
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
                                    TelaPerfil.this,
                                    TelaDashboard.class
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
                                    TelaPerfil.this,
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

    // ===================== SAIR DA CONTA =====================

    /**
     * Pergunta se o usuário realmente quer sair antes de encerrar.
     */
    private void confirmarSaida() {

        new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.sair_titulo)
                .setMessage(R.string.sair_mensagem)
                .setNegativeButton(
                        R.string.sair_cancelar,
                        null
                )
                .setPositiveButton(
                        R.string.sair_confirmar,
                        (dialogo, opcao) -> encerrarSessao()
                )
                .show();
    }

    /**
     * Logout de verdade: volta à tela de boas-vindas e limpa toda a
     * pilha de telas (a Splash vira a única tela ativa).
     */
    private void encerrarSessao() {

        // Apaga o histórico de consumo: o próximo usuário não deve ver
        // os cálculos de quem saiu
        RepositorioConsumo.limpar();

        Intent intent =
                new Intent(
                        TelaPerfil.this,
                        Splash.class
                );

        // Limpa toda a pilha de telas (logout de verdade)
        intent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
                        | Intent.FLAG_ACTIVITY_CLEAR_TASK
        );

        startActivity(intent);
        finish();
    }

}
