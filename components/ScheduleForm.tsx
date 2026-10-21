"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { useApp } from "@/components/Providers";
import { stores } from "@/config/lojas";
import { services } from "@/config/servicos";
import { products } from "@/lib/data";
import { money } from "@/lib/format";
import { displayPlate } from "@/lib/plate";
import { waLink } from "@/lib/whatsapp";

/**
 * Agendamento sem backend: monta a mensagem e abre o WhatsApp da loja.
 * Nada é enviado a servidor nosso; o cliente revisa o texto antes de mandar.
 */
export function ScheduleForm() {
  const params = useSearchParams();
  const { selection, storeSlug } = useApp();
  const product = products.find((p) => p.id === params.get("produto"));
  const [lojaChoice, setLoja] = useState<string | null>(params.get("loja"));
  // Sem escolha explícita, segue a loja ativa do header.
  const loja = lojaChoice ?? storeSlug;
  const [servico, setServico] = useState(
    params.get("servico") ?? (product ? "troca-de-pneus" : ""),
  );
  const [qtd, setQtd] = useState("4");
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [periodo, setPeriodo] = useState("manha");
  const [obs, setObs] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ready, setReady] = useState<string | null>(null);
  const id = useId();

  const store = stores.find((s) => s.slug === loja) ?? stores[0];
  const today = new Date().toISOString().slice(0, 10);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!nome.trim()) errs.nome = "Informe seu nome.";
    if (!servico) errs.servico = "Escolha o serviço.";
    if (!data) errs.data = "Escolha um dia.";
    else if (data < today) errs.data = "Escolha uma data de hoje em diante.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    const svc = services.find((s) => s.slug === servico);
    const lines = [
      `Olá, Furtil ${store.label}! Quero agendar.`,
      `Nome: ${nome.trim()}`,
      `Serviço: ${svc?.name}`,
      product
        ? `Pneu: ${qtd}x ${product.marca} ${product.linha} ${product.medida} (${money(product.precoVista)} à vista cada)`
        : null,
      selection?.vehicle
        ? `Carro: ${selection.vehicle.marca} ${selection.vehicle.modelo} ${selection.vehicle.versao}`
        : null,
      selection?.plate ? `Placa: ${displayPlate(selection.plate)}` : null,
      !product && selection?.size ? `Medida: ${selection.size}` : null,
      `Dia: ${data.split("-").reverse().join("/")} — ${periodo === "manha" ? "manhã" : "tarde"}`,
      obs.trim() ? `Obs.: ${obs.trim()}` : null,
    ].filter(Boolean);
    const href = waLink(lines.join("\n"), store.whatsapp);
    setReady(href);
    // Pop-up pode ser bloqueado; o link abaixo do botão fica como garantia.
    window.open(href, "_blank", "noopener,noreferrer");
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1 text-sm font-semibold text-danger">
        {errors[k]}
      </p>
    ) : null;
  const described = (k: string) => (errors[k] ? `${id}-${k}-err` : undefined);

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <p role="alert" className="sr-only">
        {Object.keys(errors).length
          ? `${Object.keys(errors).length} campo(s) precisam de atenção.`
          : ""}
      </p>
      {product ? (
        <div className="rounded-lg border-l-4 border-signal bg-white p-4">
          <p className="eyebrow text-muted">Pneu escolhido</p>
          <p className="mt-1 font-semibold">
            {product.marca} {product.linha} <span className="num font-mono">{product.medida}</span>
          </p>
          <p className="num text-sm text-muted">
            {money(product.precoVista)} à vista, por pneu
            {product.precoSemTroca ? " — na troca do usado" : ""}
          </p>
          <label htmlFor={`${id}-qtd`} className="mt-3 block text-sm font-semibold">
            Quantidade
          </label>
          <select
            id={`${id}-qtd`}
            value={qtd}
            onChange={(e) => setQtd(e.target.value)}
            className="field mt-1 w-28"
          >
            {["1", "2", "3", "4"].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nome`} className="mb-1 block text-sm font-semibold">
            Seu nome
          </label>
          <input
            id={`${id}-nome`}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="given-name"
            aria-invalid={!!errors.nome}
            aria-describedby={described("nome")}
            className="field"
          />
          {err("nome")}
        </div>
        <div>
          <label htmlFor={`${id}-loja`} className="mb-1 block text-sm font-semibold">
            Loja
          </label>
          <select
            id={`${id}-loja`}
            value={loja}
            onChange={(e) => setLoja(e.target.value)}
            className="field"
          >
            {stores.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-servico`} className="mb-1 block text-sm font-semibold">
            Serviço
          </label>
          <select
            id={`${id}-servico`}
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            aria-invalid={!!errors.servico}
            aria-describedby={described("servico")}
            className="field"
          >
            <option value="">Selecione</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          {err("servico")}
        </div>
        <div>
          <label htmlFor={`${id}-data`} className="mb-1 block text-sm font-semibold">
            Dia preferido
          </label>
          <input
            id={`${id}-data`}
            type="date"
            min={today}
            value={data}
            onChange={(e) => setData(e.target.value)}
            aria-invalid={!!errors.data}
            aria-describedby={described("data")}
            className="field"
          />
          {err("data")}
        </div>
      </div>
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">Período</legend>
        <div className="flex gap-2">
          {[
            ["manha", "Manhã"],
            ["tarde", "Tarde"],
          ].map(([v, l]) => (
            <label
              key={v}
              className={`flex min-h-tap flex-1 cursor-pointer items-center justify-center rounded-md border-2 font-semibold ${periodo === v ? "border-ink bg-ink text-paper" : "border-line bg-white"}`}
            >
              <input
                type="radio"
                name={`${id}-periodo`}
                value={v}
                checked={periodo === v}
                onChange={() => setPeriodo(v)}
                className="sr-only"
              />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={`${id}-obs`} className="mb-1 block text-sm font-semibold">
          Observações <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id={`${id}-obs`}
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          rows={3}
          className="field py-2"
        />
      </div>
      <div>
        <button type="submit" className="btn-whats w-full text-base sm:w-auto">
          Enviar pelo WhatsApp
        </button>
        <p className="mt-2 text-sm text-muted">
          Abre o WhatsApp com a mensagem pronta. Você revisa antes de enviar; a loja confirma o
          horário.
        </p>
        <p role="status" className="mt-2">
          {ready ? (
            <a
              href={ready}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
            >
              O WhatsApp não abriu? Toque aqui para abrir a conversa.
            </a>
          ) : null}
        </p>
      </div>
    </form>
  );
}
