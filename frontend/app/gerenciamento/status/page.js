
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

export default function Status() {
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState([]);
  const [idEditando, setIdEditando] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function listarStatus() {
    try {
      const resposta = await fetch("http://localhost:3001/status");

      if (!resposta.ok) {
        throw new Error("Erro ao consultar os status.");
      }

      const dados = await resposta.json();
      setStatus(dados);
    } catch (erro) {
      setErro("Não foi possível carregar os status.");
    }
  }

  useEffect(() => {
    listarStatus();
  }, []);

  async function salvarStatus(event) {
    event.preventDefault();
    setMensagem("");
    setErro("");

    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
      setErro("Informe o nome do status.");
      return;
    }

    const editando = idEditando !== null;

    const duplicado = status.some(
      (item) =>
        item.nome.toLowerCase() === nomeLimpo.toLowerCase() &&
        item.id !== idEditando
    );

    if (duplicado) {
      setErro("Já existe um status com esse nome.");
      return;
    }

    try {
      const url = editando
        ? `http://localhost:3001/status/${idEditando}`
        : "http://localhost:3001/status";

      const resposta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome: nomeLimpo })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || "Erro ao salvar status.");
        return;
      }

      setMensagem(
        editando
          ? "Status atualizado com sucesso!"
          : "Status cadastrado com sucesso!"
      );

      setNome("");
      setIdEditando(null);
      await listarStatus();
    } catch (erro) {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  function editarStatus(item) {
    setIdEditando(item.id);
    setNome(item.nome);
    setMensagem("");
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirStatus(id) {
    if (!window.confirm("Tem certeza que deseja excluir este status?")) {
      return;
    }

    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(
        `http://localhost:3001/status/${id}`,
        { method: "DELETE" }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || "Erro ao excluir status.");
        return;
      }

      if (idEditando === id) {
        setIdEditando(null);
        setNome("");
      }

      setMensagem("Status excluído com sucesso!");
      await listarStatus();
    } catch (erro) {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <main className="min-h-screen bg-[#171A1F] p-6 text-[#F5F7FA] md:p-12">
      <div className="status-container mx-auto w-full max-w-3xl">

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
            Gerenciamento de Status
          </h1>
          <p className="mt-3 text-[#A0A7B1]">
            Consulte e gerencie os status das reservas.
          </p>
        </header>

        <section className="rounded-xl border border-[#2A2F36] bg-[#20252C] p-6">
          <div className="mb-6 flex items-center gap-3">
            <ClipboardList size={28} className="text-[#5BC0BE]" />
            <h2 className="text-xl font-semibold">
              {idEditando !== null ? "Editar Status" : "Cadastrar Status"}
            </h2>
          </div>

          <form onSubmit={salvarStatus} className="flex flex-col gap-5">
            <div>
              <label htmlFor="nome-status" className="mb-2 block">
                Nome do Status
              </label>
              <input
                id="nome-status"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
                className="w-full rounded-lg border border-[#343B44] bg-[#171A1F] p-3 text-white"
                placeholder="Ex.: Livre"
              />
            </div>

            {erro && <p className="text-red-400">{erro}</p>}
            {mensagem && <p className="text-[#5BC0BE]">{mensagem}</p>}

            <button
              type="submit"
              className="rounded-lg bg-[#5BC0BE] px-6 py-3 font-semibold text-[#171A1F]"
            >
              {idEditando !== null ? "Salvar Alterações" : "Cadastrar Status"}
            </button>

            {idEditando !== null && (
              <button
                type="button"
                onClick={() => {
                  setIdEditando(null);
                  setNome("");
                }}
                className="rounded-lg border border-[#343B44] p-3"
              >
                Cancelar Edição
              </button>
            )}
          </form>
        </section>

        <section className="mt-8 rounded-xl border border-[#2A2F36] bg-[#20252C] p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Status cadastrados
          </h2>

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#343B44] text-[#5BC0BE]">
                  <th className="p-3">ID</th>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>

              <tbody>
                {status.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#343B44]"
                  >
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.nome}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => editarStatus(item)}
                          className="rounded-lg bg-[#5BC0BE] px-4 py-2 text-[#171A1F]"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => excluirStatus(item.id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white"
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

          {status.length === 0 && (
            <p className="mt-4 text-[#A0A7B1]">
              Nenhum status cadastrado.
            </p>
          )}
        </section>

      </div>
    </main>
  );
}
