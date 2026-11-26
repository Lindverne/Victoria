package com.example.app_aqua;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;

public class Splash extends AppCompatActivity {

    private Button btnCadastrar, btnLogar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_splash);

        Componentes();
        Funcoes();
    }

    protected void Componentes() {
        btnCadastrar = findViewById(R.id.btnSplashCadastrar);

        btnLogar = findViewById(R.id.btnSplashLogar);
    }

    protected void Funcoes() {
        btnCadastrar.setOnClickListener(view -> {
            Intent p = new Intent(Splash.this, TelaCadastro.class);
            startActivity(p);
            finish();
        });
        btnLogar.setOnClickListener(view -> {
            Intent q = new Intent(Splash.this, TelaLogin.class);
            startActivity(q);
            finish();
        });
    }
}