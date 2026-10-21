"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { MercosulPlate, plateTextClass } from "@/components/MercosulPlate";
import { useApp, withTransition } from "@/components/Providers";
import { SidewallGuide } from "@/components/finder/SidewallGuide";
import { ManualSearch, SizeSearch } from "@/components/finder/Fallbacks";
import { TireCard } from "@/components/TireCard";
import { productsForSize, sizeToSlug } from "@/lib/data";
import { lookupPlate } from "@/lib/lookup";
import { displayPlate, isValidPlate, maskPlate } from "@/lib/plate";
import type { Vehicle } from "@/lib/types";
import { waLink } from "@/lib/whatsapp";

type Step =
  | { kind: "plate" }
  | { kind: "loading"; plate: string }
  | { kind: "confirm"; plate: string; vehicle: Vehicle }
  | { kind: "size"; plate: string | null; vehicle: Vehicle }
  | {
      kind: "fallback";
      plate: string | null;
      reason: "not_found" | "not_mine" | "error" | "unsure";
    }
  | { kind: "offers" };

const STEPS = ["Placa", "Veículo", "Medida", "Pneus"] as const;
const EXAMPLE_PLATES = ["ABC1D23", "BRA2E19", "FUR7T11", "GOL-1234"];

function stepIndex(s: Step) {
  switch (s.kind) {
    case "plate":
    case "loading":
      return 0;
    case "confirm":
    case "fallback":
      return 1;
    case "size":
      return 2;
    case "offers":
      return 3;
  }
}

export function PlateFinder() {
  const { selection, setSelection } = useApp();
  const [step, setStep] = useState<Step>({ kind: "plate" });
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  const inputId = useId();
  const placeholder = useTypewriter(EXAMPLE_PLATES, !value && step.kind === "plate");
  const errId = useId();

  // Se o cliente volta à home com uma medida já escolhida, abre direto nas ofertas.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (selection?.size) setStep({ kind: "offers" });
  }, [selection?.size]);

  // Leva o foco ao título de cada novo passo — leitores de tela anunciam onde o usuário está.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (step.kind === "plate") inputRef.current?.focus();
    else if (step.kind !== "loading") headingRef.current?.focus();
  }, [step.kind]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step.kind !== "plate") return;
    if (!value) {
      setError("Digite a placa do carro.");
      return;
    }
    if (!isValidPlate(value)) {
      setError(
        value.length < 7
          ? `Faltam ${7 - value.length} caractere${7 - value.length > 1 ? "s" : ""}. A placa tem 7: ABC1D23 ou ABC1234.`
          : "Essa placa não está num formato válido. Use ABC1D23 (Mercosul) ou ABC1234 (antiga).",
      );
      return;
    }
    setError(null);
    setStep({ kind: "loading", plate: value });
    setStatus(`Consultando a placa ${displayPlate(value)}…`);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await lookupPlate(value, ctrl.signal);
      if (res.status === "found") {
        setStatus(`Encontramos: ${res.vehicle.marca} ${res.vehicle.modelo} ${res.vehicle.versao}.`);
        setStep({ kind: "confirm", plate: res.plate, vehicle: res.vehicle });
      } else {
        setStatus("Não encontramos essa placa. Veja outras formas de achar sua medida.");
        setStep({ kind: "fallback", plate: res.plate, reason: "not_found" });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setStatus("A consulta falhou. Veja outras formas de achar sua medida.");
      setStep({ kind: "fallback", plate: value, reason: "error" });
    }
  }

  function cancel() {
    abortRef.current?.abort();
    setStatus("Consulta cancelada.");
    setStep({ kind: "plate" });
  }

  function chooseVehicle(plate: string | null, vehicle: Vehicle) {
    // Só pula a escolha quando existe exatamente uma medida de fábrica.
    if (vehicle.medidas.length === 1) commit(plate, vehicle, vehicle.medidas[0].medida);
    else setStep({ kind: "size", plate, vehicle });
  }

  function commit(plate: string | null, vehicle: Vehicle | null, size: string) {
    setStatus(`Medida ${size} selecionada.`);
    withTransition(() => {
      setSelection({ plate, vehicle, size });
      setStep({ kind: "offers" });
    });
  }

  function restart() {
    withTransition(() => {
      setSelection(null);
      setValue("");
      setError(null);
      setStep({ kind: "plate" });
    });
  }

  const current = stepIndex(step);
  const showPlate = step.kind === "plate" || step.kind === "loading";

  return (
    <section aria-labelledby="finder-title" className="relative">
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <ol className="mb-5 flex gap-1.5" aria-label="Etapas">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === current ? "step" : undefined}
            className={`flex-1 border-t-[5px] pt-2 text-[0.72rem] font-semibold transition-colors duration-500 ${
              i <= current ? "border-signal text-ink" : "border-paper-2 text-muted"
            }`}
          >
            <span className="sr-only">Etapa {i + 1}: </span>
            {label}
          </li>
        ))}
      </ol>

      {showPlate ? (
        <form onSubmit={submit} noValidate>
          <h2 id="finder-title" className="mb-3 font-display text-xl font-bold tracking-tight">
            Qual a placa do seu carro?
          </h2>
          <label htmlFor={inputId} className="sr-only">
            Placa do carro, 7 caracteres
          </label>
          <MercosulPlate transitionName="plate">
            <input
              ref={inputRef}
              id={inputId}
              value={displayPlate(value)}
              onChange={(e) => {
                setValue(maskPlate(e.target.value));
                if (error) setError(null);
              }}
              disabled={step.kind === "loading"}
              inputMode="text"
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              placeholder={placeholder}
              maxLength={8}
              aria-invalid={!!error}
              aria-describedby={`${errId} ${inputId}-hint`}
              className={`${plateTextClass} block w-full bg-transparent px-3 py-2 text-center text-[clamp(2.6rem,13vw,4.4rem)] leading-none text-ink placeholder:text-line focus:outline-none disabled:opacity-60`}
            />
          </MercosulPlate>
          <p id={`${inputId}-hint`} className="mt-2 text-sm text-muted">
            Vale placa Mercosul ou antiga. Usamos só para achar a medida do pneu.
          </p>
          <p
            id={errId}
            role="alert"
            className="mt-2 min-h-[1.5rem] text-sm font-semibold text-danger"
          >
            {error}
          </p>

          {step.kind === "loading" ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-paper-2" aria-hidden>
                <div className="tread h-full w-full animate-tread bg-signal" />
              </div>
              <button type="button" onClick={cancel} className="btn-ghost">
                Cancelar
              </button>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-3">
              <button type="submit" className="btn-signal flex-1 text-base sm:flex-none">
                Achar meu pneu
                <Arrow />
              </button>
              <button
                type="button"
                className="btn px-3 text-ink underline decoration-signal decoration-2 underline-offset-4"
                onClick={() => setStep({ kind: "fallback", plate: null, reason: "unsure" })}
              >
                Prefiro buscar sem placa
              </button>
            </div>
          )}
        </form>
      ) : null}

      {step.kind === "confirm" ? (
        <Panel>
          <h2
            id="finder-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-xl font-bold tracking-tight"
          >
            É este o seu carro?
          </h2>
          <PlateLine plate={step.plate} />
          <VehicleLine vehicle={step.vehicle} />
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn-signal" onClick={() => chooseVehicle(step.plate, step.vehicle)}>
              Sim, é esse
            </button>
            <button
              className="btn-ghost"
              onClick={() => setStep({ kind: "fallback", plate: step.plate, reason: "not_mine" })}
            >
              Não é o meu
            </button>
          </div>
        </Panel>
      ) : null}

      {step.kind === "size" ? (
        <SizeChoice
          vehicle={step.vehicle}
          plate={step.plate}
          headingRef={headingRef}
          onChoose={(size) => commit(step.plate, step.vehicle, size)}
          onUnsure={() => setStep({ kind: "fallback", plate: step.plate, reason: "unsure" })}
        />
      ) : null}

      {step.kind === "fallback" ? (
        <Panel>
          <h2
            id="finder-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-xl font-bold tracking-tight"
          >
            {step.reason === "not_found"
              ? "Não encontramos essa placa — dá para achar a medida de outro jeito."
              : step.reason === "error"
                ? "A consulta da placa não respondeu. Escolha outro caminho:"
                : step.reason === "not_mine"
                  ? "Tudo bem. Vamos achar o carro certo:"
                  : "Escolha como prefere achar a medida:"}
          </h2>
          <FallbackTabs
            plate={step.plate}
            onVehicle={(v) => chooseVehicle(step.plate, v)}
            onSize={(size) => commit(step.plate, null, size)}
          />
          <button
            className="btn mt-4 px-0 text-muted underline underline-offset-4"
            onClick={restart}
          >
            Tentar outra placa
          </button>
        </Panel>
      ) : null}

      {step.kind === "offers" && selection?.size ? (
        <Offers
          size={selection.size}
          vehicle={selection.vehicle}
          headingRef={headingRef}
          onRestart={restart}
        />
      ) : null}
    </section>
  );
}

/**
 * Placeholder que "digita" placas de exemplo enquanto o campo está vazio.
 * Parado em ABC1D23 com prefers-reduced-motion.
 */
function useTypewriter(words: string[], active: boolean) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0;
    let i = words[0].length;
    let dir = -1;
    let hold = 18;
    const t = setInterval(() => {
      if (hold > 0) {
        hold--;
        return;
      }
      i += dir;
      if (i <= 0) {
        dir = 1;
        w = (w + 1) % words.length;
      }
      if (i >= words[w].length) {
        i = words[w].length;
        dir = -1;
        hold = 22;
      }
      setText(words[w].slice(0, Math.max(i, 0)) || "\u00a0");
    }, 90);
    return () => clearInterval(t);
  }, [active, words]);
  return active ? text : words[0];
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="animate-rise">{children}</div>;
}

function PlateLine({ plate }: { plate: string | null }) {
  if (!plate) return null;
  return (
    <MercosulPlate size="sm" className="mt-3 inline-block" transitionName="plate">
      <span className={`${plateTextClass} block px-2 py-0.5 text-xl`}>{displayPlate(plate)}</span>
    </MercosulPlate>
  );
}

function VehicleLine({ vehicle }: { vehicle: Vehicle }) {
  return (
    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-2xl bg-paper p-4">
      <dt className="label self-center text-muted">Marca</dt>
      <dd className="font-semibold">{vehicle.marca}</dd>
      <dt className="label self-center text-muted">Modelo</dt>
      <dd className="font-semibold">
        {vehicle.modelo} {vehicle.versao}
      </dd>
      <dt className="label self-center text-muted">Anos</dt>
      <dd className="num font-semibold">
        {vehicle.anos[0]}–{vehicle.anos[1]}
      </dd>
    </dl>
  );
}

function SizeChoice({
  vehicle,
  plate,
  headingRef,
  onChoose,
  onUnsure,
}: {
  vehicle: Vehicle;
  plate: string | null;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onChoose: (size: string) => void;
  onUnsure: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const name = useId();

  return (
    <Panel>
      <PlateLine plate={plate} />
      <h2
        id="finder-title"
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 font-display text-xl font-bold tracking-tight"
      >
        O {vehicle.modelo} {vehicle.versao} saiu de fábrica com {vehicle.medidas.length} medidas.
        Qual é a do seu?
      </h2>
      <p className="mt-1 text-sm text-muted">
        Depende da roda que veio no carro. Não dá para saber pela placa — e não vamos chutar.
      </p>
      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (picked) onChoose(picked);
          else setErr("Escolha uma das medidas, ou use “Não sei qual é”.");
        }}
      >
        <fieldset>
          <legend className="sr-only">Medida do pneu</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {vehicle.medidas.map((m) => (
              <label
                key={m.medida}
                className={`flex min-h-tap cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-colors ${
                  picked === m.medida
                    ? "border-ink bg-signal-soft"
                    : "border-line bg-white hover:border-ink/40"
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={m.medida}
                  checked={picked === m.medida}
                  onChange={() => {
                    setPicked(m.medida);
                    setErr(null);
                  }}
                  className="h-5 w-5 accent-[rgb(var(--ink))]"
                />
                <span>
                  <span className="num block font-mono text-xl font-semibold">{m.medida}</span>
                  {m.nota ? <span className="block text-sm text-muted">{m.nota}</span> : null}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <p role="alert" className="mt-2 min-h-[1.25rem] text-sm font-semibold text-danger">
          {err}
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <button type="submit" className="btn-signal">
            Ver pneus nessa medida
          </button>
          <button type="button" className="btn-ghost" onClick={() => setGuideOpen(true)}>
            Como confiro no pneu?
          </button>
          <button
            type="button"
            className="btn px-2 text-ink underline underline-offset-4"
            onClick={onUnsure}
          >
            Não sei qual é
          </button>
        </div>
      </form>
      <SidewallGuide
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        sizes={vehicle.medidas.map((m) => m.medida)}
      />
    </Panel>
  );
}

function FallbackTabs({
  plate,
  onVehicle,
  onSize,
}: {
  plate: string | null;
  onVehicle: (v: Vehicle) => void;
  onSize: (size: string) => void;
}) {
  const tabs = [
    { id: "manual", label: "Pelo modelo" },
    { id: "medida", label: "Pela medida" },
    { id: "ajuda", label: "Falar com a loja" },
  ] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("manual");
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: React.KeyboardEvent, i: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + tabs.length) % tabs.length;
    setTab(tabs[next].id);
    refs.current[next]?.focus();
  }

  const msg = plate
    ? `Olá! Quero ajuda para achar o pneu certo. Placa: ${displayPlate(plate)}.`
    : "Olá! Quero ajuda para achar o pneu certo para o meu carro.";

  return (
    <div className="mt-4">
      <div
        role="tablist"
        aria-label="Formas de achar a medida"
        className="flex gap-1 rounded-full bg-paper-2 p-1"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${base}-${t.id}-tab`}
            aria-controls={`${base}-${t.id}`}
            aria-selected={tab === t.id}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-[40px] flex-1 rounded-full px-2 text-sm font-semibold transition-colors sm:px-4 ${
              tab === t.id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${base}-${tab}`}
        aria-labelledby={`${base}-${tab}-tab`}
        className="pt-4"
      >
        {tab === "manual" ? <ManualSearch onVehicle={onVehicle} /> : null}
        {tab === "medida" ? <SizeSearch onSize={onSize} /> : null}
        {tab === "ajuda" ? (
          <div>
            <p className="text-muted">
              Um atendente confere a medida com você — pela placa, por foto do pneu ou pelo
              documento. Sem compromisso.
            </p>
            <a
              href={waLink(msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whats mt-4"
            >
              <WhatsIcon /> Pedir ajuda no WhatsApp
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Offers({
  size,
  vehicle,
  headingRef,
  onRestart,
}: {
  size: string;
  vehicle: Vehicle | null;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
}) {
  const list = productsForSize(size).slice(0, 3);
  return (
    <Panel>
      <p className="eyebrow">{vehicle ? "Medida de fábrica" : "Medida escolhida"}</p>
      <h2 id="finder-title" ref={headingRef} tabIndex={-1} className="mt-1">
        <span className="num block font-mono text-4xl font-semibold sm:text-5xl">{size}</span>
        {vehicle ? (
          <span className="mt-1 block text-base font-normal text-muted">
            para {vehicle.marca} {vehicle.modelo} {vehicle.versao}
          </span>
        ) : null}
      </h2>
      {list.length ? (
        <ul className="mt-5 grid gap-3">
          {list.map((p) => (
            <li key={p.id}>
              <TireCard product={p} compact />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl border border-line p-4">
          <p>Não temos essa medida no catálogo online agora. A loja consegue em geral em 24h.</p>
          <a
            href={waLink(`Olá! Procuro pneu ${size}. Vocês têm?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whats mt-3"
          >
            <WhatsIcon /> Consultar disponibilidade
          </a>
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/pneus/${sizeToSlug(size)}`} className="btn-signal">
          Ver todas as opções em {size}
        </Link>
        <button className="btn-ghost" onClick={onRestart}>
          Trocar carro
        </button>
      </div>
    </Panel>
  );
}

export function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-5 w-5"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

export function WhatsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}
