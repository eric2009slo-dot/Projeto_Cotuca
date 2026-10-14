
"use client";

import Link from "next/link";
import {
  FlaskConical,
  DoorOpen,
  ClipboardList,
  ArrowRight
} from "lucide-react";

export default function Gerenciamento() {
  const opcoes = [
    {
      titulo: "Laboratórios",
      descricao: "Cadastre e organize os laboratórios disponíveis.",
      icone: FlaskConical,
      destino: "/gerenciamento/laboratorios"
    },
    {
      titulo: "Salas",
      descricao: "Cadastre e organize as salas disponíveis.",
      icone: DoorOpen,
      destino: "/gerenciamento/salas"
    },
    {
      titulo: "Status",
      descricao: "Consulte e gerencie os status das reservas.",
      icone: ClipboardList,
      destino: "/gerenciamento/status"
    }
  ];

  return (
    <main className="min-h-screen bg-[#171A1F] p-6 text-[#F5F7FA] md:p-12">
      <div className="mx-auto w-full max-w-6xl min-w-0">
        <header className="mb-10">
          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-[#5BC0BE]">
            IRON BONDS
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Área de gerenciamento
          </h1>

          <p className="mt-3 text-[#A0A7B1]">
            Selecione o que deseja cadastrar ou gerenciar.
          </p>
        </header>

        <section className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3">
          {opcoes.map((opcao) => {
            const Icone = opcao.icone;

            return (
              <Link
                key={opcao.titulo}
                href={opcao.destino}
                className="group min-w-0 overflow-hidden rounded-xl border border-[#2A2F36] bg-[#20252C] p-6 transition hover:border-[#5BC0BE]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#12343B] text-[#5BC0BE]">
                  <Icone size={26} />
                </div>

                <h2 className="text-lg font-semibold sm:text-xl">
                  {opcao.titulo}
                </h2>

                <p className="mt-3 min-h-12 break-words text-sm leading-6 text-[#A0A7B1]">
                  {opcao.descricao}
                </p>

                <div className="mt-5 flex items-center gap-2 font-medium text-[#5BC0BE]">
                  Acessar
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
