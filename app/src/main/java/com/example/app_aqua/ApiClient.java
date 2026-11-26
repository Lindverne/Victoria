package com.example.app_aqua;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {

    private static Retrofit retrofit;

    // Servidor LOCAL (WAMP, no seu PC).
    // Requisitos: WAMP aberto (ícone verde) e celular + PC na MESMA rede Wi-Fi.
    // Se parar de conectar, rode "ipconfig" no PC, veja o Endereço IPv4
    // e atualize aqui. Para voltar ao servidor remoto (Railway), use:
    // https://julio-s-repository-production.up.railway.app/
    private static final String BASE_URL =
            "http://192.168.0.42/app_aqua/";

    public static Retrofit getRetrofit(){

        if(retrofit == null){

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(
                            GsonConverterFactory.create()
                    )
                    .build();
        }

        return retrofit;
    }
}