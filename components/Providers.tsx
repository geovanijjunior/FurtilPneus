"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { stores } from "@/config/lojas";
import type { Vehicle } from "@/lib/types";

export type Selection = {
  plate: string | null; // null quando o veículo veio da busca manual
  vehicle: Vehicle | null; // null quando o cliente buscou só pela medida
  size: string | null;
};

type Ctx = {
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;
  storeSlug: string;
  storeSource: "default" | "geo" | "manual";
  setStore: (slug: string, source: "geo" | "manual") => void;
};

const AppContext = createContext<Ctx | null>(null);

const SEL_KEY = "furtil.selection";
const STORE_KEY = "furtil.store";

// Acesso a storage pode falhar (aba privada, bloqueio de cookies): o site
// funciona sem ele, só não lembra a escolha.
function read<T>(storage: () => Storage, key: string): T | null {
  try {
    const v = storage().getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
function write(storage: () => Storage, key: string, value: unknown) {
  try {
    if (value === null) storage().removeItem(key);
    else storage().setItem(key, JSON.stringify(value));
  } catch {}
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [selection, setSelectionState] = useState<Selection | null>(null);
  const [storeSlug, setStoreSlug] = useState(stores[0].slug);
  const [storeSource, setStoreSource] = useState<Ctx["storeSource"]>("default");

  useEffect(() => {
    // Hidratação a partir do storage só depois do mount, para não divergir do HTML do servidor.
    /* eslint-disable react-hooks/set-state-in-effect */
    const sel = read<Selection>(() => sessionStorage, SEL_KEY);
    if (sel) setSelectionState(sel);
    const st = read<{ slug: string; source: "geo" | "manual" }>(() => localStorage, STORE_KEY);
    if (st && stores.some((s) => s.slug === st.slug)) {
      setStoreSlug(st.slug);
      setStoreSource(st.source);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setSelection = useCallback((s: Selection | null) => {
    setSelectionState(s);
    write(() => sessionStorage, SEL_KEY, s);
  }, []);

  const setStore = useCallback((slug: string, source: "geo" | "manual") => {
    setStoreSlug(slug);
    setStoreSource(source);
    write(() => localStorage, STORE_KEY, { slug, source });
  }, []);

  const value = useMemo(
    () => ({ selection, setSelection, storeSlug, storeSource, setStore }),
    [selection, setSelection, storeSlug, storeSource, setStore],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp fora de <Providers>");
  return ctx;
}

/** Envolve uma mudança de estado em View Transition quando o navegador suporta. */
export function withTransition(fn: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (doc.startViewTransition && !reduce) doc.startViewTransition(fn);
  else fn();
}
