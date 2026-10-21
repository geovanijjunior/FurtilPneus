"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { TireCard } from "@/components/TireCard";
import { useApp } from "@/components/Providers";
import { stores } from "@/config/lojas";
import { allBrands, allSizes, parseSize, products, sizeToSlug } from "@/lib/data";
import { money } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

const PRICE_STEPS = [250, 400, 600, 900];
const RIMS = Array.from(new Set(allSizes.map((s) => parseSize(s)!.rim)));

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
  render = (v) => v,
}: {
  label: string;
  options: T[];
  value: T | "";
  onChange: (v: T | "") => void;
  render?: (v: T) => React.ReactNode;
}) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 items-center gap-2">
      <span className="hidden w-16 shrink-0 text-sm font-semibold sm:block">{label}</span>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
        <button
          type="button"
          aria-pressed={value === ""}
          onClick={() => onChange("")}
          className="chip shrink-0"
        >
          Todos
        </button>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? "" : o)}
            className="chip shrink-0"
          >
            {render(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Catalog({ fixedSize }: { fixedSize?: string }) {
  const { selection, storeSlug } = useApp();
  const [size, setSize] = useState(fixedSize ?? "");
  const [rim, setRim] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [max, setMax] = useState<string>("");
  const [store, setStore] = useState("");
  const [sort, setSort] = useState<"preco" | "marca">("preco");
  const ids = { size: useId(), store: useId(), sort: useId() };

  const list = useMemo(() => {
    const out = products.filter(
      (p) =>
        (!size || p.medida === size) &&
        (!rim || parseSize(p.medida)?.rim === rim) &&
        (!brand || p.marca === brand) &&
        (!max || p.precoVista <= Number(max)) &&
        (!store || p.lojas.includes(store)),
    );
    return out.sort((a, b) =>
      sort === "preco" ? a.precoVista - b.precoVista : a.marca.localeCompare(b.marca),
    );
  }, [size, rim, brand, max, store, sort]);

  const active = [size && !fixedSize, rim, brand, max, store].filter(Boolean).length;
  const mySize = selection?.size;

  function clear() {
    if (!fixedSize) setSize("");
    setRim("");
    setBrand("");
    setMax("");
    setStore("");
  }

  return (
    <div>
      <div className="card grid gap-4 p-4 sm:p-5">
        {!fixedSize ? (
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[12rem] flex-1 sm:flex-none">
              <label htmlFor={ids.size} className="mb-1 block text-sm font-semibold">
                Medida
              </label>
              <select
                id={ids.size}
                value={size}
                onChange={(e) => {
                  setSize(e.target.value);
                  setRim("");
                }}
                className="field font-mono"
              >
                <option value="">Todas as medidas</option>
                {allSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {mySize && mySize !== size ? (
              <button
                type="button"
                onClick={() => setSize(mySize)}
                className="btn bg-signal-soft px-4 text-sm hover:bg-signal"
              >
                Usar a medida do meu carro · <span className="font-mono">{mySize}</span>
              </button>
            ) : null}
          </div>
        ) : null}
        {!fixedSize && !size ? (
          <Chips
            label="Aro"
            options={RIMS}
            value={rim}
            onChange={setRim}
            render={(r) => `Aro ${r}`}
          />
        ) : null}
        <Chips label="Marca" options={allBrands} value={brand} onChange={setBrand} />
        <Chips
          label="Até"
          options={PRICE_STEPS.map(String)}
          value={max}
          onChange={setMax}
          render={(v) => money(Number(v)).replace(",00", "")}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm">
          <strong className="num font-display text-lg">{list.length}</strong>{" "}
          {list.length === 1 ? "pneu encontrado" : "pneus encontrados"}
          {active ? (
            <button
              type="button"
              onClick={clear}
              className="ml-3 min-h-tap font-semibold underline underline-offset-4"
            >
              Limpar filtros
            </button>
          ) : null}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={ids.store} className="sr-only">
            Disponível na loja
          </label>
          <select
            id={ids.store}
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="field min-h-[44px] w-auto text-sm"
          >
            <option value="">Todas as lojas</option>
            {stores.map((s) => (
              <option key={s.slug} value={s.slug}>
                Loja {s.label}
                {s.slug === storeSlug ? " (sua)" : ""}
              </option>
            ))}
          </select>
          <label htmlFor={ids.sort} className="sr-only">
            Ordenar por
          </label>
          <select
            id={ids.sort}
            value={sort}
            onChange={(e) => setSort(e.target.value as "preco" | "marca")}
            className="field min-h-[44px] w-auto text-sm"
          >
            <option value="preco">Menor preço</option>
            <option value="marca">Marca A–Z</option>
          </select>
        </div>
      </div>

      {list.length ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <li key={p.id} className="animate-rise">
              <TireCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-line bg-white p-8 text-center">
          <h2 className="font-display text-xl font-bold">Nenhum pneu com esses filtros.</h2>
          <p className="mx-auto mt-1 max-w-md text-muted">
            O catálogo online mostra parte do estoque. A loja costuma conseguir a medida em até 24h.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {active ? (
              <button type="button" onClick={clear} className="btn-ink">
                Limpar filtros
              </button>
            ) : null}
            <a
              href={waLink(
                `Olá! Procuro pneu${size ? ` ${size}` : ""}${brand ? ` ${brand}` : ""}. Vocês têm?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whats"
            >
              Perguntar no WhatsApp
            </a>
            {fixedSize ? (
              <Link href="/pneus" className="btn-ghost">
                Ver outras medidas
              </Link>
            ) : null}
          </div>
        </div>
      )}
      {!fixedSize && size ? (
        <p className="mt-6 text-sm">
          <Link
            href={`/pneus/${sizeToSlug(size)}`}
            className="font-semibold underline underline-offset-4"
          >
            Página da medida {size}
          </Link>{" "}
          — carros que usam e como conferir.
        </p>
      ) : null}
    </div>
  );
}
