
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";

export default function Laboratorios() {
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const [laboratorios, setLaboratorios] = useState([]);
  const [idEditando, setIdEditando] = useState(null);

    async function listarLaboratorios() {
        try {
        const resposta = await fetch("http://localhost:3001/laboratorios");

        if (!resposta.ok) {
        throw new Error("Erro ao buscar laboratórios.");
        }

        const dados = await resposta.json();
            setLaboratorios(dados);
            } catch (erro) {
                setErro("Não foi possível carregar os laboratórios.");
            }
        }

        useEffect(() => {
        listarLaboratorios();
        }, []);
    
    function editarLaboratorio(laboratorio) {
        setIdEditando(laboratorio.id);

        setCodigo(laboratorio.codigo);
        setNome(laboratorio.nome);
        setCapacidade(String(laboratorio.capacidade));
        setLocalizacao(laboratorio.localizacao);

        setMensagem("");
        setErro("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

  
async function cadastrarLaboratorio(event) {
  event.preventDefault();

  setMensagem("");
  setErro("");

  try {
    const editando = idEditando !== null;

    const url = editando
      ? `http://localhost:3001/laboratorios/${idEditando}`
      : "http://localhost:3001/laboratorios";

    const resposta = await fetch(url, {
      method: editando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codigo,
        nome,
        capacidade: Number(capacidade),
        localizacao
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      setErro(dados.erro || "Erro ao salvar laboratório.");
      return;
    }

    setMensagem(
      editando
        ? "Laboratório atualizado com sucesso!"
        : "Laboratório cadastrado com sucesso!"
    );

    setCodigo("");
    setNome("");
    setCapacidade("");
    setLocalizacao("");
    setIdEditando(null);

    await listarLaboratorios();

  } catch (erro) {
    setErro("Não foi possível conectar ao servidor.");
  }
}


  async function excluirLaboratorio(id) {
  const confirmar = window.confirm(
    "Tem certeza que deseja excluir este laboratório?"
  );

  if (!confirmar) return;

  try {
    const resposta = await fetch(
      `http://localhost:3001/laboratorios/${id}`,
      {
        method: "DELETE"
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      setErro(dados.erro || "Erro ao excluir laboratório.");
      return;
    }

    setErro("");
    setMensagem("Laboratório excluído com sucesso!");
    await listarLaboratorios();

  } catch (erro) {
    setErro("Não foi possível conectar ao servidor.");
  }
}

  return (
    <main className="min-h-screen bg-[#171A1F] p-6 text-[#F5F7FA] md:p-12">
      <div className="mx-auto w-full max-w-3xl laboratorio-container">

        <Link
          href="/gerenciamento"
          className="mb-8 inline-flex items-center gap-2 text-[#5BC0BE]"
        >
          <ArrowLeft size={20} />
          Voltar ao gerenciamento
        </Link>

        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-[#5BC0BE]">
            IRON BONDS
          </p>

          <h1 className="text-3xl font-bold">
            Gerenciamento de Laboratórios
          </h1>

          <p className="mt-3 text-[#A0A7B1]">
            Cadastre os laboratórios disponíveis para reserva.
          </p>
        </header>

        <section className="rounded-xl border border-[#2A2F36] bg-[#20252C] p-6">

          <div className="mb-6 flex items-center gap-3">
            <FlaskConical size={28} className="text-[#5BC0BE]" />
            <h2 className="text-xl font-semibold">
              
            </h2>
          </div>

          <form onSubmit={cadastrarLaboratorio} className="flex flex-col gap-5">

            <div>
              <label htmlFor="codigo" className="mb-2 block">
                Código
              </label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                maxLength={20}
                required
                className="w-full rounded-lg border border-[#343B44] bg-[#171A1F] p-3 text-white"
              />
            </div>

            <div>
              <label htmlFor="nome" className="mb-2 block">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={100}
                required
                className="w-full rounded-lg border border-[#343B44] bg-[#171A1F] p-3 text-white"
              />
            </div>

            <div>
              <label htmlFor="capacidade" className="mb-2 block">
                Capacidade
              </label>
              <input
                id="capacidade"
                type="number"
                min="1"
                step="1"
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                required
                className="w-full rounded-lg border border-[#343B44] bg-[#171A1F] p-3 text-white"
              />
            </div>

            <div>
              <label htmlFor="localizacao" className="mb-2 block">
                Localização
              </label>
              <input
                id="localizacao"
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                maxLength={100}
                required
                className="w-full rounded-lg border border-[#343B44] bg-[#171A1F] p-3 text-white"
              />
            </div>

            {erro && (
              <p className="text-red-400">{erro}</p>
            )}

            {mensagem && (
              <p className="text-[#5BC0BE]">{mensagem}</p>
            )}

            <button
                type="submit"
                className="rounded-lg bg-[#5BC0BE] px-6 py-3 font-semibold text-[#171A1F] transition hover:bg-[#48A9A6]"
            >
                {idEditando !== null ? "Salvar Alterações" : "Cadastrar Laboratório"}
            </button>

          </form>
        </section>

        <section className="mt-8 rounded-xl border border-[#2A2F36] bg-[#20252C] p-6">

            <h2 className="mb-6 text-xl font-semibold">
                Laboratórios cadastrados
            </h2>

            <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
            <thead>
                <tr className="border-b border-[#343B44] text-[#5BC0BE]">
                <th className="p-3">Código</th>
                <th className="p-3">Nome</th>
                <th className="p-3">Capacidade</th>
                <th className="p-3">Localização</th>
                <th className="p-3">Ações</th>
                </tr>
            </thead>

            
        
<tbody>
  {laboratorios.map((laboratorio) => (
    <tr
      key={laboratorio.id}
      className="border-b border-[#343B44]"
    >
      <td className="p-3">{laboratorio.codigo}</td>
      <td className="p-3">{laboratorio.nome}</td>
      <td className="p-3">{laboratorio.capacidade}</td>
      <td className="p-3">{laboratorio.localizacao}</td>

      <td className="p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => editarLaboratorio(laboratorio)}
            className="rounded-lg bg-[#5BC0BE] px-4 py-2 text-[#171A1F] hover:bg-[#48A9A6]"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => excluirLaboratorio(laboratorio.id)}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>
        </div>

        {laboratorios.length === 0 && (
            <p className="mt-4 text-[#A0A7B1]">
            Nenhum laboratório cadastrado.
            </p>
        )}

        </section>
      </div>
    </main>
  );
}
