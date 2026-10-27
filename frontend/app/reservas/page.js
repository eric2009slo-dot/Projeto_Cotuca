
import Link from "next/link";
import { CalendarPlus, CalendarSearch, ArrowRight } from "lucide-react";

export default function Reservas() {
  return (
    <main className="min-h-screen bg-[#171A1F] p-6 text-[#F5F7FA]">

      <div className="reservas-container">

        <h1 className="text-3xl font-bold">
          Área de Reservas
        </h1>

        <p className="mt-3 text-[#A0A7B1]">
          Escolha o que deseja fazer.
        </p>

        <section className="mt-8 grid grid-cols-2 gap-6">

          <Link
            href="/reservas/nova"
            className="rounded-xl border border-[#2A2F36] bg-[#20252C] p-8 hover:border-[#5BC0BE]"
          >
            <CalendarPlus size={36} className="text-[#5BC0BE]" />

            <h2 className="mt-5 text-2xl font-semibold">
              Nova Reserva
            </h2>

            <p className="mt-3 text-[#A0A7B1]">
              Reserve laboratórios e salas disponíveis.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[#5BC0BE]">
              Acessar <ArrowRight size={18} />
            </div>
          </Link>

          <Link
            href="/reservas/consulta"
            className="rounded-xl border border-[#2A2F36] bg-[#20252C] p-8 hover:border-[#5BC0BE]"
          >
            <CalendarSearch size={36} className="text-[#5BC0BE]" />

            <h2 className="mt-5 text-2xl font-semibold">
              Consultar Reservas
            </h2>

            <p className="mt-3 text-[#A0A7B1]">
              Consulte reservas por recurso, data, horário e usuário.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[#5BC0BE]">
              Acessar <ArrowRight size={18} />
            </div>
          </Link>

        </section>
      </div>
    </main>
  );
}
