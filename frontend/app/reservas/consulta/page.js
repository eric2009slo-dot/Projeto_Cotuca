
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function ConsultaReservas() {
  const [reservas, setReservas] = useState([]);
  const [status, setStatus] = useState([]);

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [hora, setHora] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscarReservas(filtros = "") {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(
        `http://localhost:3001/reservas${filtros ? "?" + filtros : ""}`
      );

      if (!resposta.ok) {
        throw new Error("Erro ao consultar reservas.");
      }

      const dados = await resposta.json();
      setReservas(dados);

    } catch (erro) {
      setErro("Não foi possível consultar as reservas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarReservas();

    async function buscarStatus() {
      try {
        const resposta = await fetch("http://localhost:3001/status");

        if (!resposta.ok) {
          throw new Error("Erro ao carregar status.");
        }

        setStatus(await resposta.json());
      } catch (erro) {
        setErro("Não foi possível carregar os status.");
      }
    }

    buscarStatus();
  }, []);

  function pesquisar(event) {
    event.preventDefault();

    if (dataInicial && dataFinal && dataFinal < dataInicial) {
      setErro("A data final não pode ser anterior à data inicial.");
      return;
    }

    const filtros = new URLSearchParams();

    if (codigo.trim()) {
      filtros.append("codigo_recurso", codigo.trim());
    }

    if (nome.trim()) {
      filtros.append("nome_recurso", nome.trim());
    }

    if (usuario.trim()) {
      filtros.append("nome_usuario", usuario.trim());
    }

    if (dataInicial) {
      filtros.append("data_inicial", dataInicial);
    }

    if (dataFinal) {
      filtros.append("data_final", dataFinal);
    }

    if (hora) {
      filtros.append("hora", hora);
    }

    if (statusSelecionado) {
      filtros.append("id_status", statusSelecionado);
    }

    buscarReservas(filtros.toString());
  }

  function limparFiltros() {
    setCodigo("");
    setNome("");
    setUsuario("");
    setDataInicial("");
    setDataFinal("");
    setHora("");
    setStatusSelecionado("");

    buscarReservas();
  }

  return (
    <main className="min-h-screen bg-[#171A1F] p-6 text-[#F5F7FA] md:p-12">
      <div className="consulta-container mx-auto w-full max-w-5xl">

        <Link
          href="/reservas"
          className="mb-8 inline-flex items-center gap-2 text-[#5BC0BE]"
        >
          <ArrowLeft size={20} />
          Voltar às Reservas
        </Link>

        <header className="mb-8">
          <p className="text-sm font-semibold tracking-widest text-[#5BC0BE]">
            IRON BONDS
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Consulta de Reservas
          </h1>

          <p className="mt-3 text-[#A0A7B1]">
            Pesquise reservas por recurso, data, horário, usuário e status.
          </p>
        </header>

        <section className="rounded-xl border border-[#2A2F36] bg-[#20252C] p-6">

          <h2 className="mb-6 text-xl font-semibold">
            Filtros de pesquisa
          </h2>

          <form onSubmit={pesquisar} className="flex flex-col gap-4">

            <div>
              <label className="mb-2 block">Código do recurso</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex.: LAB01"
                className="w-full rounded-lg bg-[#171A1F] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block">Nome do recurso</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Laboratório de Informática"
                className="w-full rounded-lg bg-[#171A1F] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block">Usuário responsável</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite o nome do usuário"
                className="w-full rounded-lg bg-[#171A1F] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block">Data inicial</label>
              <input
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
                className="w-full rounded-lg bg-[#171A1F] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block">Data final</label>
              <input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                className="w-full rounded-lg bg-[#171A1F] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block">Horário da reserva</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full rounded-lg bg-[#171A1F] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block">Status da reserva</label>
              <select
                value={statusSelecionado}
                onChange={(e) => setStatusSelecionado(e.target.value)}
                className="w-full rounded-lg bg-[#171A1F] p-3"
              >
                <option value="">Todos os status</option>
                {status.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#5BC0BE] p-3 font-semibold text-[#171A1F]"
              >
                <Search size={18} className="mr-2 inline" />
                Pesquisar
              </button>

              <button
                type="button"
                onClick={limparFiltros}
                className="flex-1 rounded-lg border border-[#5BC0BE] p-3 text-[#5BC0BE]"
              >
                Limpar filtros
              </button>
            </div>

          </form>
        </section>

        <section className="mt-8 rounded-xl border border-[#2A2F36] bg-[#20252C] p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Reservas encontradas
          </h2>

          {carregando && (
            <p className="text-[#A0A7B1]">Carregando reservas...</p>
          )}

          {erro && <p className="text-red-400">{erro}</p>}

          {!carregando && !erro && reservas.length === 0 && (
            <p className="text-[#A0A7B1]">
              Nenhuma reserva encontrada.
            </p>
          )}

          {!carregando && reservas.length > 0 && (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#343B44] text-[#5BC0BE]">
                    <th className="p-3">Código</th>
                    <th className="p-3">Recurso</th>
                    <th className="p-3">Usuário</th>
                    <th className="p-3">Data inicial</th>
                    <th className="p-3">Data final</th>
                    <th className="p-3">Horário</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {reservas.map((reserva) => (
                    <tr
                      key={reserva.id}
                      className="border-b border-[#343B44]"
                    >
                      <td className="p-3">{reserva.codigo_recurso}</td>
                      <td className="p-3">{reserva.nome_recurso}</td>
                      <td className="p-3">{reserva.nome_usuario}</td>
                      <td className="p-3">{reserva.data_inicial}</td>
                      <td className="p-3">{reserva.data_final}</td>
                      <td className="p-3">
                        {reserva.hora_inicial} - {reserva.hora_final}
                      </td>
                      <td className="p-3">{reserva.nome_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
    