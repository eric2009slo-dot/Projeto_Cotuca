"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
  User,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  Lock
} from "lucide-react";

import Link from "next/link";

export default function Cadastro() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataAniversario, setDataAniversario] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");

  
async function cadastrar() {
  if (senha !== confirmacao) {
    alert("As senhas não são iguais!");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3001/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome_completo: nomeCompleto,
        cpf: cpf,
        data_aniversario: dataAniversario,
        celular: celular,
        email: email,
        login: login,
        senha: senha
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.mensagem || dados.erro || "Erro ao realizar cadastro.");
      return;
    }

    alert("Cadastro realizado com sucesso!");
  } catch (erro) {
    alert("Não foi possível conectar ao servidor.");
    console.error(erro);
  }
}


  return (
    <main>
      <div className="login-card">
        <h1>CADASTRO</h1>

        
      <label>
        <User size={18} /> Nome completo
      </label>
      <input
        type="text"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
      />


        <label>
          <CreditCard size={18} />
          CPF
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={11}
          value={cpf}
          onChange={(e) => {
            setCpf(e.target.value.replace(/\D/g, "").slice(0, 11));
          }}
        />


       <label>
        <Calendar size={18} />
        Data de nascimento
      </label>
      <input
        type="date"
        value={dataAniversario}
        onChange={(e) => setDataAniversario(e.target.value)}
      />

       <label>
        <Phone size={18} />
        Telefone
      </label>
      <input
        type="tel"
        maxLength={15}
        value={celular}
        onChange={(e) => {
          setCelular(e.target.value.replace(/\D/g, "").slice(0, 15));
        }}
      />

       <label>
        <Mail size={18} />
        E-mail
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />


    <label>
      <User size={18} /> Login
    </label>
    <input
      type="text"
      value={login}
      onChange={(e) => setLogin(e.target.value)}
    />




      <label>
        <Lock size={18} />
        Senha
      </label>

      <div className="senha-container">
      <input
        type={mostrarSenha ? "text" : "password"} 
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button
        type="button"
        onClick={() => setMostrarSenha(!mostrarSenha)}
      >
        {mostrarSenha ? <EyeOff /> : <Eye />}
      </button>
      </div>

        <label>
          <Lock size={18} />
          Confirmar senha
        </label>

        <div className="senha-container">
        <input
          type={mostrarConfirmacao ? "text" : "password"} 
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
        >
          {mostrarConfirmacao ? <EyeOff /> : <Eye />}
        </button>
        </div>

        <button type="button" onClick={cadastrar}>
          CADASTRAR
        </button>

        <p className="login-link">
          Já possui uma conta?{" "}
          <Link href="/login">Entrar</Link>
        </p>

       </div>
    </main>
  );
}
