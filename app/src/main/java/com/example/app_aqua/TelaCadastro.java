package com.example.app_aqua;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class TelaCadastro extends AppCompatActivity {


    private TextView btnVoltar;
    private EditText txtNome;
    private EditText txtEmail;
    private EditText txtSenha;
    private EditText txtConfirmarSenha;
    private Button btnCadastrar;



    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_cadastro);


        iniciarComponentes();
        configurarEventos();

    }



    private void iniciarComponentes(){

        txtNome = findViewById(R.id.txt_Nome);
        txtEmail = findViewById(R.id.txt_Email);
        txtSenha = findViewById(R.id.txt_senhacad);
        txtConfirmarSenha = findViewById(R.id.txt_senhaconf);
        btnCadastrar = findViewById(R.id.btn_cadastrar);
        btnVoltar = findViewById(R.id.btn_voltar);

    }



    private void configurarEventos(){


        btnVoltar.setOnClickListener(v -> {

            Intent intent =
                    new Intent(
                            TelaCadastro.this,
                            TelaLogin.class
                    );

            startActivity(intent);
            finish();

        });



        btnCadastrar.setOnClickListener(v -> cadastrar());

    }



    private void cadastrar(){


        String nome =
                txtNome.getText()
                        .toString()
                        .trim();


        String email =
                txtEmail.getText()
                        .toString()
                        .trim();


        String senha =
                txtSenha.getText()
                        .toString()
                        .trim();


        String confirmar =
                txtConfirmarSenha.getText()
                        .toString()
                        .trim();



        if(nome.isEmpty()
                || email.isEmpty()
                || senha.isEmpty()
                || confirmar.isEmpty()){


            Toast.makeText(
                    this,
                    "Preencha todos os campos!",
                    Toast.LENGTH_SHORT
            ).show();


            return;

        }



        if(!senha.equals(confirmar)){


            Toast.makeText(
                    this,
                    "As senhas não coincidem!",
                    Toast.LENGTH_SHORT
            ).show();


            return;

        }



        API api =
                ApiClient
                        .getRetrofit()
                        .create(API.class);



        api.cadastrar(nome,email,senha)
                .enqueue(new Callback<>() {



                    @Override
                    public void onResponse(
                            Call<Resposta> call,
                            Response<Resposta> response
                    ){


                        if(response.isSuccessful()
                                && response.body()!=null){


                            Resposta resposta =
                                    response.body();



                            Toast.makeText(
                                    TelaCadastro.this,
                                    resposta.getMensagem(),
                                    Toast.LENGTH_SHORT
                            ).show();



                            if("sucesso".equals(
                                    resposta.getStatus()
                            )){


                                Intent intent =
                                        new Intent(
                                                TelaCadastro.this,
                                                TelaLogin.class
                                        );


                                startActivity(intent);
                                finish();

                            }

                        }else{


                            Toast.makeText(
                                    TelaCadastro.this,
                                    "Erro ao cadastrar. Tente novamente mais tarde.",
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
                                TelaCadastro.this,
                                "Erro de conexão",
                                Toast.LENGTH_SHORT
                        ).show();
                    }
                });
    }
}