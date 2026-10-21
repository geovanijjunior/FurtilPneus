"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { TireCard } from "@/components/TireCard";
import { useApp } from "@/components/Providers";
import { stores } from "@/config/lojas";
import { allBrands, allSizes, products, sizeToSlug } from "@/lib/data";
import { money } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

const PRICE_STEPS = [250, 400, 600, 900];

export function Catalog({ fixedSize }: { fixedSize?: string }) {
  const { selection, storeSlug } = useApp();
  const [size, setSize] = useState(fixedSize ?? "");
  const [brand, setBrand] = useState("");
  const [max, setMax] = useState("");
  const [store, setStore] = useState("");
  const [sort, setSort] = useState<"preco" | "marca">("preco");
  const ids = { size: useId(), brand: useId(), max: useId(), store: useId(), sort: useId() };

  const list = useMemo(() => {
    const out = products.filter(
      (p) =>
        (!size || p.medida === size) &&
        (!brand || p.marca === brand) &&
        (!max || p.precoVista <= Number(max)) &&
        (!store || p.lojas.includes(store)),
    );
    return out.sort((a, b) =>
      sort === "preco" ? a.precoVista - b.precoVista : a.marca.localeCompare(b.marca),
    );
  }, [size, brand, max, store, sort]);

  const active = [size && !fixedSize, brand, max, store].filter(Boolean).length;
  const mySize = selection?.size;

  function clear() {
    if (!fixedSize) setSize("");
    setBrand("");
    setMax("");
    setStore("");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <form
        aria-label="Filtros"
        className="grid content-start gap-4 lg:sticky lg:top-28"
        onSubmit={(e) => e.preventDefault()}
      >
        {!fixedSize ? (
          <div>
            <label htmlFor={ids.size} className="mb-1 block text-sm font-semibold">
              Medida
            </label>
            <select
              id={ids.size}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="field font-mono"
            >
              <option value="">Todas</option>
              {allSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {mySize && mySize !== size ? (
              <button
                type="button"
                onClick={() => setSize(mySize)}
                className="mt-2 min-h-tap text-sm font-semibold underline underline-offset-4"
              >
                Usar a medida do meu carro ({mySize})
              </button>
            ) : null}
          </div>
        ) : null}
        <div>
          <label htmlFor={ids.brand} className="mb-1 block text-sm font-semibold">
            Marca
          </label>
          <select
            id={ids.brand}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="field"
          >
            <option value="">Todas</option>
            {allBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={ids.max} className="mb-1 block text-sm font-semibold">
            Preço à vista até
          </label>
          <select
            id={ids.max}
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="field"
          >
            <option value="">Qualquer valor</option>
            {PRICE_STEPS.map((v) => (
              <option key={v} value={v}>
                {money(v)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={ids.store} className="mb-1 block text-sm font-semibold">
            Disponível na loja
          </label>
          <select
            id={ids.store}
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="field"
          >
            <option value="">Qualquer loja</option>
            {stores.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
                {s.slug === storeSlug ? " (sua loja)" : ""}
              </option>
            ))}
          </select>
        </div>
        {active ? (
          <button type="button" onClick={clear} className="btn-ghost text-sm">
            Limpar filtros ({active})
          </button>
        ) : null}
      </form>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <p role="status" aria-live="polite" className="text-sm">
            <strong className="num">{list.length}</strong>{" "}
            {list.length === 1 ? "pneu encontrado" : "pneus encontrados"}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor={ids.sort} className="text-sm text-muted">
              Ordenar por
            </label>
            <select
              id={ids.sort}
              value={sort}
              onChange={(e) => setSort(e.target.value as "preco" | "marca")}
              className="field w-auto"
            >
              <option value="preco">Menor preço</option>
              <option value="marca">Marca</option>
            </select>
          </div>
        </div>
        {list.length ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <li key={p.id} className="flex [&>article]:w-full">
                <TireCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-lg border-2 border-dashed border-line p-6">
            <h2 className="text-lg font-semibold">Nenhum pneu com esses filtros.</h2>
            <p className="mt-1 text-muted">
              O catálogo online mostra parte do estoque. A loja costuma conseguir a medida em até
              24h.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
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
    </div>
  );
}
