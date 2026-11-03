"use client";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function Login() {

const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [mensagem, setMensagem] = useState("");
const [carregando, setCarregando] = useState(false);
const router = useRouter();



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

    router.push("/gerenciamento");

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

        <div
          style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          gridColumn: "1 / -1"
        }}
        >
          <button
            type="submit"
            disabled={carregando}
            style={{ margin: 0 }}
          >
          {carregando ? "ENTRANDO..." : "ENTRAR"}
          </button>

          <Link
            href="/recuperar-senha"
            style={{
            display: "block",
            position: "static",
            color: "#5BC0BE",
            margin: 0,
            textAlign: "center"
          }}
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {mensagem && <p role="status">{mensagem}</p>}

        


        <p className="cadastro-link">
          Ainda não possui uma conta?{" "}
          <Link href="/cadastro">Cadastre-se</Link>
        </p>
        </form>
      </div>
    </main>
  );
}