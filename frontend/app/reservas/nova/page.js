
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";

export default function NovaReserva() {
  const [usuarios, setUsuarios] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [status, setStatus] = useState([]);

  const [usuario, setUsuario] = useState("");
  const [recurso, setRecurso] = useState("");

  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [horaInicial, setHoraInicial] = useState("");
  const [horaFinal, setHoraFinal] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [statusReserva, setStatusReserva] = useState("");
  const [agora, setAgora] = useState(null);

  // Atualiza a data e a hora a cada 30 segundos
  useEffect(() => {
    function atualizarRelogio() {
      setAgora(new Date());
    }

    atualizarRelogio();

    const intervalo = setInterval(atualizarRelogio, 30000);

    return () => clearInterval(intervalo);
  }, []);

  // Data atual no formato YYYY-MM-DD
  const hoje = agora
    ? `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`
    : "";

  // Horário atual no formato HH:MM
  const horaAtual = agora
    ? `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`
    : "";

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resUsuarios, resRecursos, resStatus] =
          await Promise.all([
            fetch("http://localhost:3001/usuarios"),
            fetch("http://localhost:3001/recursos"),
            fetch("http://localhost:3001/status")
          ]);

        if (!resUsuarios.ok || !resRecursos.ok || !resStatus.ok) {
          throw new Error("Erro ao buscar os dados.");
        }

        setUsuarios(await resUsuarios.json());
        setRecursos(await resRecursos.json());
        setStatus(await resStatus.json());

      } catch (erro) {
        setErro("Não foi possível carregar os dados do servidor.");
      }
    }

    carregarDados();
  }, []);

  async function cadastrarReserva(event) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    // Verifica se as datas e horas foram preenchidas
    const inicioReserva = new Date(`${dataInicial}T${horaInicial}`);
    const fimReserva = new Date(`${dataFinal}T${horaFinal}`);

    if (
      Number.isNaN(inicioReserva.getTime()) ||
      Number.isNaN(fimReserva.getTime())
    ) {
      setErro("Preencha corretamente as datas e os horários.");
      return;
    }

    // Impede reservar em uma data ou horário passado
    if (inicioReserva <= new Date()) {
      setErro("Não é possível reservar uma data ou horário que já passou.");
      return;
    }

    // Impede que a reserva termine antes de começar
    if (fimReserva <= inicioReserva) {
      setErro("A data e hora final devem ser posteriores ao início.");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3001/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_usuario: Number(usuario),
          id_recurso: Number(recurso),
          id_status: Number(statusReserva),
          data_inicial: dataInicial,
          data_final: dataFinal,
          hora_inicial: horaInicial,
          hora_final: horaFinal
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || "Erro ao cadastrar reserva.");
        return;
      }

      setMensagem("Reserva cadastrada com sucesso!");

      setUsuario("");
      setRecurso("");
      setStatusReserva("");
      setDataInicial("");
      setDataFinal("");
      setHoraInicial("");
      setHoraFinal("");

    } catch (erro) {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <main className="min-h-screen bg-[#171A1F] p-6 text-[#F5F7FA]">
      <div className="nova-reserva-container mx-auto w-full max-w-3xl">

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
            Nova Reserva
          </h1>

          <p className="mt-3 text-[#A0A7B1]">
            Preencha os dados para reservar um laboratório ou sala.
          </p>
        </header>

        <section className="rounded-xl border border-[#2A2F36] bg-[#20252C] p-6">

          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <CalendarPlus className="text-[#5BC0BE]" />
            Dados da Reserva
          </h2>

          <form onSubmit={cadastrarReserva} className="flex flex-col gap-5">

            <div>
              <label className="mb-2 block">Usuário responsável</label>
              <select
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="w-full rounded-lg bg-[#171A1F] p-3"
              >
                <option value="">Selecione um usuário</option>
                {usuarios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome_completo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block">Laboratório ou Sala</label>
              <select
                value={recurso}
                onChange={(e) => setRecurso(e.target.value)}
                required
                className="w-full rounded-lg bg-[#171A1F] p-3"
              >
                <option value="">Selecione um recurso</option>
                {recursos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.codigo} - {item.nome} ({item.tipo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block">Status da Reserva</label>

              <select
                value={statusReserva}
                onChange={(e) => setStatusReserva(e.target.value)}
                required
                className="w-full rounded-lg bg-[#171A1F] p-3"
              >
                <option value="">Selecione um status</option>

                {status
                  .filter((item) =>
                    ["Livre", "Ocupado", "Bloqueado", "Reservado"].includes(item.nome)
                  )
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block">Data inicial</label>
              <input
                type="date"
                value={dataInicial}
                min={hoje || undefined}
                onChange={(e) => setDataInicial(e.target.value)}
                required
                className="w-full rounded-lg border border-[#5BC0BE] bg-[#171A1F] p-3 text-[#F5F7FA] [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="mb-2 block">Data final</label>
              <input
                type="date"
                value={dataFinal}
                min={dataInicial > hoje ? dataInicial : hoje || undefined}
                onChange={(e) => setDataFinal(e.target.value)}
                required
                className="w-full rounded-lg border border-[#5BC0BE] bg-[#171A1F] p-3 text-[#F5F7FA] [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="mb-2 block">Hora inicial</label>
              <input
                type="time"
                value={horaInicial}
                min={dataInicial === hoje ? horaAtual : undefined}
                onChange={(e) => setHoraInicial(e.target.value)}
                required
                className="w-full rounded-lg border border-[#5BC0BE] bg-[#171A1F] p-3 text-[#F5F7FA] [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="mb-2 block">Hora final</label>
              <input
                type="time"
                value={horaFinal}
                min={dataFinal === dataInicial ? horaInicial : undefined}
                onChange={(e) => setHoraFinal(e.target.value)}
                required
                className="w-full rounded-lg border border-[#5BC0BE] bg-[#171A1F] p-3 text-[#F5F7FA] [color-scheme:dark]"
              />
            </div>

            {erro && <p className="text-red-400">{erro}</p>}
            {mensagem && <p className="text-[#5BC0BE]">{mensagem}</p>}

            <button
              type="submit"
              className="rounded-lg bg-[#5BC0BE] p-3 font-semibold text-[#171A1F]"
            >
              Cadastrar Reserva
            </button>

          </form>
        </section>
      </div>
    </main>
  );
}
