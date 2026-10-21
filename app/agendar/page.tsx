import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHead } from "@/components/PageHead";
import { ScheduleForm } from "@/components/ScheduleForm";

export const metadata: Metadata = {
  title: "Agendar horário",
  description:
    "Agende troca de pneus, alinhamento, freios ou revisão na loja Furtil mais perto. A confirmação chega pelo WhatsApp.",
  alternates: { canonical: "/agendar" },
};

export default function AgendarPage() {
  return (
    <>
      <PageHead eyebrow="Agendamento" title="Marque um horário">
        Preencha em um minuto. A loja confirma pelo WhatsApp.
      </PageHead>
      <div className="wrap max-w-3xl py-10">
        <Suspense fallback={<p role="status">Carregando formulário…</p>}>
          <ScheduleForm />
        </Suspense>
      </div>
    </>
  );
}
