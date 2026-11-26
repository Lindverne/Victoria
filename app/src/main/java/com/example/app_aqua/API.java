package com.example.app_aqua;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public interface API {

    @FormUrlEncoded
    @POST("Cadastrar.php")
    Call<Resposta> cadastrar(
            @Field("nome") String nome,
            @Field("email") String email,
            @Field("senha") String senha
    );


    @FormUrlEncoded
    @POST("Logar.php")
    Call<Resposta> logar(
            @Field("email") String email,
            @Field("senha") String senha
    );


    @FormUrlEncoded
    @POST("Perfil.php")
    Call<Resposta> perfil(
            @Field("id") int id
    );


    @FormUrlEncoded
    @POST("AtualizarImagem.php")
    Call<Resposta> atualizarImagem(
            @Field("id") int id,
            @Field("tipo") String tipo,
            @Field("imagem") String imagem
    );


    @FormUrlEncoded
    @POST("AtualizarPerfil.php")
    Call<Resposta> atualizarPerfil(
            @Field("id") int id,
            @Field("cidade") String cidade,
            @Field("profissao") String profissao,
            @Field("website") String website,
            @Field("telefone") String telefone,
            @Field("data_nascimento") String dataNascimento,
            @Field("bio") String bio
    );

}
