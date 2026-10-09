"use client";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function Login() {

const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [mensagem, setMensagem] = useState("");
const [carregando, setCarregando] = useState(false);



async function fazerLogin(e) {
  e.preventDefault();

  setMensagem("");
  setCarregando(true);

  try {
    const resposta = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      setMensagem(dados.erro || "Erro ao fazer login.");
      return;
    }

    setMensagem("Login realizado com sucesso!");

    console.log("Usuário autenticado:", dados.usuario);
    console.log("Token:", dados.token);

  } catch (erro) {
    setMensagem("Não foi possível conectar ao servidor.");
  } finally {
    setCarregando(false);
  }
}


  return (
    <main>
      <div className="login-card">
        <form onSubmit={fazerLogin}>
          <h1>ENTRAR</h1>

        <label>
          <Mail size={18} />
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>
          <Lock size={18} />
          Senha
        </label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" disabled={carregando}>
          {carregando ? "ENTRANDO..." : "ENTRAR"}
        </button>

          {mensagem && <p role="status">{mensagem}</p>}

        <p className="esqueci-senha">
          Esqueceu sua senha?
        </p>

        <p className="cadastro-link">
          Ainda não possui uma conta?{" "}
          <Link href="/cadastro">Cadastre-se</Link>
        </p>
        </form>
      </div>
    </main>
  );
}