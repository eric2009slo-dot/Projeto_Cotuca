
"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  function enviarEmail() {
    if (email.trim() === "") {
      setMensagem("Digite seu e-mail.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMensagem("Digite um e-mail válido.");
      return;
    }

   setMensagem(
    "Para recuperar o acesso à sua conta, entre em contato com o administrador do Iron Bonds."
);
  }

  return (
    <main>
      <div className="login-card">
        <h1>RECUPERAR SENHA</h1>

        <p>
          Digite seu e-mail para recuperar sua senha.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
        />

        <button type="button" onClick={enviarEmail}>
          ENVIAR
        </button>

        {mensagem && (
          <p role="status" style={{ color: "#5BC0BE" }}>
            {mensagem}
          </p>
        )}

        <Link
          href="/login"
          style={{
            color: "#5BC0BE",
            textDecoration: "none"
          }}
        >
          Voltar ao Login
        </Link>
      </div>
    </main>
  );
}
