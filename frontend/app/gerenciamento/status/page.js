

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

const OPCOES_STATUS = [
  "Livre",
  "Ocupado",
  "Reservado",
  "Bloqueado"
];

export default function GerenciamentoStatus() {
  const [recursos, setRecursos] = useState([]);
  const [statusSelecionados, setStatusSelecionados] = useState({});
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarRecursos() {
      try {
        const resposta = await fetch("http://localhost:3001/recursos");

        if (!resposta.ok) {
          throw new Error("Erro ao consultar recursos.");
        }

        const dados = await resposta.json();

        setRecursos(dados);

        const selecoes = {};

        dados.forEach((recurso) => {
          selecoes[recurso.id] = recurso.status || "Livre";
        });

        setStatusSelecionados(selecoes);
      } catch (erro) {
        setErro("Não foi possível carregar os recursos.");
      } finally {
        setCarregando(false);
      }
    }

    buscarRecursos();
  }, []);

  function alterarSelecao(id, novoStatus) {
    setStatusSelecionados((anteriores) => ({
      ...anteriores,
      [id]: novoStatus
    }));
  }

  
async function salvarStatus(id) {
  const novoStatus = statusSelecionados[id];

  try {
    const resposta = await fetch(
      `http://localhost:3001/recursos/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: novoStatus
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || "Erro ao atualizar status.");
      return;
    }

    setRecursos((anteriores) =>
      anteriores.map((recurso) =>
        recurso.id === id
          ? { ...recurso, status: novoStatus }
          : recurso
      )
    );

    alert("Status atualizado com sucesso!");

  } catch (erro) {
    alert("Não foi possível conectar ao servidor.");
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
            Consulte e gerencie o status dos laboratórios e salas.
          </p>
        </header>

        <section className="rounded-xl border border-[#2A2F36] bg-[#20252C] p-6">

          <div className="mb-6 flex items-center gap-3">
            <ClipboardList size={28} className="text-[#5BC0BE]" />
            <h2 className="text-xl font-semibold">
              Status dos Recursos
            </h2>
          </div>

          {carregando && (
            <p className="text-[#A0A7B1]">
              Carregando recursos...
            </p>
          )}

          {erro && (
            <p className="text-red-400">{erro}</p>
          )}

          {!carregando && !erro && recursos.length === 0 && (
            <p className="text-[#A0A7B1]">
              Nenhum laboratório ou sala cadastrado.
            </p>
          )}

          <div className="flex flex-col gap-4">
            {recursos.map((recurso) => (
              <div
                key={recurso.id}
                className="rounded-lg border border-[#343B44] bg-[#171A1F] p-4"
              >
                <h3 className="text-lg font-semibold">
                  {recurso.nome}
                </h3>

                <p className="mt-1 text-sm text-[#A0A7B1]">
                  {recurso.codigo} — {recurso.tipo === "LABORATORIO" ? "Laboratório" : "Sala"}
                </p>

                <label
                  htmlFor={`status-${recurso.id}`}
                  className="mt-4 mb-2 block"
                >
                  Status
                </label>

                <select
                  id={`status-${recurso.id}`}
                  value={statusSelecionados[recurso.id] || "Livre"}
                  onChange={(event) =>
                    alterarSelecao(recurso.id, event.target.value)
                  }
                  className="w-full rounded-lg border border-[#343B44] bg-[#20252C] p-3 text-white"
                >
                  {OPCOES_STATUS.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => salvarStatus(recurso.id)}
                  className="mt-4 w-full rounded-lg bg-[#5BC0BE] px-4 py-3 font-semibold text-[#171A1F] transition hover:bg-[#48A9A6]"
                  >
                   Salvar Status
                </button>

                <p className="mt-2 text-xs text-[#A0A7B1]">
                  Salvamento disponível após a integração com o backend.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
