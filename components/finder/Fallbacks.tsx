"use client";

import { useId, useMemo, useState } from "react";
import { allSizes, parseSize, vehicles } from "@/lib/data";
import type { Vehicle } from "@/lib/types";

function Select({
  label,
  value,
  onChange,
  options,
  disabled,
  dark,
  placeholder = "Selecione",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  dark?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className={`mb-1 block text-sm font-semibold ${dark ? "text-paper" : "text-ink"}`}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="field disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const uniq = (a: string[]) => Array.from(new Set(a)).sort((x, y) => x.localeCompare(y, "pt-BR"));
const opts = (a: string[]) => a.map((v) => ({ value: v, label: v }));

/** Busca encadeada: marca → modelo → versão → ano. */
export function ManualSearch({
  onVehicle,
  dark,
}: {
  onVehicle: (v: Vehicle) => void;
  dark?: boolean;
}) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [versao, setVersao] = useState("");
  const [ano, setAno] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const marcas = uniq(vehicles.map((v) => v.marca));
  const modelos = uniq(vehicles.filter((v) => v.marca === marca).map((v) => v.modelo));
  const versoes = vehicles.filter((v) => v.marca === marca && v.modelo === modelo);
  const vehicle = versoes.find((v) => v.id === versao);
  const anos = vehicle
    ? Array.from({ length: vehicle.anos[1] - vehicle.anos[0] + 1 }, (_, i) =>
        String(vehicle.anos[1] - i),
      )
    : [];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (vehicle && ano) onVehicle(vehicle);
        else setErr("Preencha marca, modelo, versão e ano.");
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          dark={dark}
          label="Marca"
          value={marca}
          options={opts(marcas)}
          onChange={(v) => {
            setMarca(v);
            setModelo("");
            setVersao("");
            setAno("");
            setErr(null);
          }}
        />
        <Select
          dark={dark}
          label="Modelo"
          value={modelo}
          disabled={!marca}
          options={opts(modelos)}
          onChange={(v) => {
            setModelo(v);
            setVersao("");
            setAno("");
          }}
        />
        <Select
          dark={dark}
          label="Versão"
          value={versao}
          disabled={!modelo}
          options={versoes.map((v) => ({ value: v.id, label: v.versao }))}
          onChange={(v) => {
            setVersao(v);
            setAno("");
          }}
        />
        <Select
          dark={dark}
          label="Ano"
          value={ano}
          disabled={!vehicle}
          options={opts(anos)}
          onChange={setAno}
        />
      </div>
      <p
        role="alert"
        className={`mt-2 min-h-[1.25rem] text-sm font-semibold ${dark ? "text-signal" : "text-danger"}`}
      >
        {err}
      </p>
      <p className={`text-sm ${dark ? "text-muted-dark" : "text-muted"}`}>
        Não achou seu carro na lista? Use a aba “Falar com a loja”.
      </p>
      <button type="submit" className={`mt-3 ${dark ? "btn-signal" : "btn-ink"}`}>
        Continuar
      </button>
    </form>
  );
}

/** Busca pela medida lida no flanco: largura / perfil / aro. */
export function SizeSearch({ onSize, dark }: { onSize: (size: string) => void; dark?: boolean }) {
  const parsed = useMemo(() => allSizes.map((s) => ({ s, ...parseSize(s)! })), []);
  const [w, setW] = useState("");
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const widths = uniq(parsed.map((x) => x.width));
  const profiles = uniq(parsed.filter((x) => x.width === w).map((x) => x.profile));
  const rims = uniq(parsed.filter((x) => x.width === w && x.profile === p).map((x) => x.rim));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (w && p && r) onSize(`${w}/${p} R${r}`);
        else setErr("Preencha largura, perfil e aro.");
      }}
    >
      <p className={`mb-3 text-sm ${dark ? "text-muted-dark" : "text-muted"}`}>
        Está escrito no flanco do pneu, por exemplo <span className="font-mono">205/55 R16</span>.
      </p>
      <div className="grid grid-cols-3 gap-2">
        <Select
          dark={dark}
          label="Largura"
          placeholder="—"
          value={w}
          options={opts(widths)}
          onChange={(v) => {
            setW(v);
            setP("");
            setR("");
            setErr(null);
          }}
        />
        <Select
          dark={dark}
          label="Perfil"
          placeholder="—"
          value={p}
          disabled={!w}
          options={opts(profiles)}
          onChange={(v) => {
            setP(v);
            setR("");
          }}
        />
        <Select
          dark={dark}
          label="Aro"
          placeholder="—"
          value={r}
          disabled={!p}
          options={rims.map((x) => ({ value: x, label: `R${x}` }))}
          onChange={setR}
        />
      </div>
      <p
        role="alert"
        className={`mt-2 min-h-[1.25rem] text-sm font-semibold ${dark ? "text-signal" : "text-danger"}`}
      >
        {err}
      </p>
      <button type="submit" className={`mt-1 ${dark ? "btn-signal" : "btn-ink"}`}>
        Ver pneus
      </button>
    </form>
  );
}
