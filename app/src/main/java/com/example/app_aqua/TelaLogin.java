package com.example.app_aqua;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TelaLogin extends AppCompatActivity {

    private EditText inputEmailLogin;
    private EditText inputSenhaLogin;
    private Button btnEntrarLogin;
    private TextView linkCriarConta;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        iniciarComponentes();
        configurarEventos();
    }


    private void iniciarComponentes(){

        inputEmailLogin = findViewById(R.id.inputEmailLogin);
        inputSenhaLogin = findViewById(R.id.inputSenhaLogin);
        btnEntrarLogin = findViewById(R.id.btnEntrarLogin);
        linkCriarConta = findViewById(R.id.linkCriarConta);

    }


    private void configurarEventos(){

        linkCriarConta.setOnClickListener(v -> {

            Intent intent =
                    new Intent(
                            TelaLogin.this,
                            TelaCadastro.class
                    );

            startActivity(intent);
            finish();
        });


        btnEntrarLogin.setOnClickListener(v -> validarLogin());

    }


    private void validarLogin(){

        String email = inputEmailLogin
                .getText()
                .toString()
                .trim();


        String senha = inputSenhaLogin
                .getText()
                .toString()
                .trim();



        if(email.isEmpty() || senha.isEmpty()){

            Toast.makeText(
                    this,
                    "Preencha todos os campos!",
                    Toast.LENGTH_SHORT
            ).show();

            return;

        }


        realizarLogin(email, senha);

    }



    private void realizarLogin(
            String email,
            String senha
    ){

        API api = ApiClient
                .getRetrofit()
                .create(API.class);



        api.logar(email, senha)
                .enqueue(new Callback<>() {


                    @Override
                    public void onResponse(
                            Call<Resposta> call,
                            Response<Resposta> response
                    ){


                        if(response.isSuccessful()
                                && response.body()!=null){


                            Resposta resultado =
                                    response.body();



                            Toast.makeText(
                                    TelaLogin.this,
                                    resultado.getMensagem(),
                                    Toast.LENGTH_SHORT
                            ).show();



                            if("sucesso".equals(
                                    resultado.getStatus()
                            )){


                                Intent intent =
                                        new Intent(
                                                TelaLogin.this,
                                                TelaDashboard.class
                                        );

                                intent.putExtra(
                                        "usuario_id",
                                        resultado.getId()
                                );

                                startActivity(intent);
                                finish();

                            }


                        }else{


                            Toast.makeText(
                                    TelaLogin.this,
                                    "Email ou senha inválidos",
                                    Toast.LENGTH_SHORT
                            ).show();

                        }

                    }



                    @Override
                    public void onFailure(
                            Call<Resposta> call,
                            Throwable t
                    ){

                        Toast.makeText(
                                TelaLogin.this,
                                "Falha de conexão",
                                Toast.LENGTH_SHORT
                        ).show();

                    }

                });

    }

}