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

  function cadastrar() {
  if (senha !== confirmacao) {
    alert("As senhas não são iguais!");
    return;
  }

  alert("Cadastro realizado com sucesso!");
}

  return (
    <main>
      <div className="login-card">
        <h1>CADASTRO</h1>

        <label>
          <User size={18} />
          Nome completo
        </label>

<input type="text" />

        <label>
          <CreditCard size={18} />
          CPF
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength="11"
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, "");
          }}
        />


       <label>
        <Calendar size={18} />
        Data de nascimento
      </label>
       <input type="date" /> 

       <label>
        <Phone size={18} />
        Telefone
      </label>
       <input
        type="tel"
        maxLength="11"
        onChange={(e) => {
          e.target.value = e.target.value.replace(/\D/g, "");
        }}
       />

       <label>
        <Mail size={18} />
        E-mail
      </label>
       <input type="email" />


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