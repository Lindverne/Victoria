package com.example.app_aqua;

import com.google.gson.annotations.SerializedName;

public class Resposta {
    private String status;
    private String mensagem;
    private int id;

    // Usados só pelo Perfil.php (nas outras respostas ficam null,
    // porque o Gson ignora chaves que não vêm no JSON)
    private String nome;
    private String email;

    // Fotos de perfil, em base64 (só o Perfil.php devolve)
    private String avatar;
    private String banner;

    // Metadados do perfil (bloco perfilMetaInline)
    private String cidade;
    private String profissao;
    private String website;
    private String telefone;

    @SerializedName("data_nascimento")
    private String dataNascimento;

    // Descrição (bio) do perfil
    private String bio;

    public String getStatus() { return status; }
    public String getMensagem() { return mensagem; }
    public int getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getAvatar() { return avatar; }
    public String getBanner() { return banner; }
    public String getCidade() { return cidade; }
    public String getProfissao() { return profissao; }
    public String getWebsite() { return website; }
    public String getTelefone() { return telefone; }
    public String getDataNascimento() { return dataNascimento; }
    public String getBio() { return bio; }
}
