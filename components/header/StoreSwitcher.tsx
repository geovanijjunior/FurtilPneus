"use client";

import { useEffect, useId, useRef, useState } from "react";
import { stores } from "@/config/lojas";
import { nearestStore } from "@/lib/geo";
import { useApp } from "@/components/Providers";

/** Loja ativa sempre visível; geolocalização opcional e troca manual sempre disponível. */
export function StoreSwitcher({
  className = "",
  inline = false,
}: {
  className?: string;
  inline?: boolean;
}) {
  const { storeSlug, storeSource, setStore } = useApp();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const panelId = useId();
  const groupName = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const store = stores.find((s) => s.slug === storeSlug) ?? stores[0];

  useEffect(() => {
    if (!open || inline) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, inline]);

  function locate() {
    if (!("geolocation" in navigator)) {
      setMsg("Seu navegador não informa localização. Escolha a loja na lista.");
      return;
    }
    setMsg("Procurando a loja mais perto…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const n = nearestStore({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStore(n.store.slug, "geo");
        setMsg(`Loja mais perto: ${n.store.label}, a ${n.km.toFixed(1).replace(".", ",")} km.`);
      },
      () => setMsg("Não foi possível usar a localização. Escolha a loja na lista."),
      { timeout: 8000, maximumAge: 600000 },
    );
  }

  const panel = (
    <>
      <button onClick={locate} className="btn-ink w-full text-sm">
        <Pin /> Usar minha localização
      </button>
      <p role="status" aria-live="polite" className="mt-2 min-h-[1rem] text-xs text-muted">
        {msg}
      </p>
      <fieldset className="mt-1">
        <legend className="eyebrow mb-1 text-muted">Ou escolha</legend>
        {stores.map((s) => (
          <label
            key={s.slug}
            className="flex min-h-tap cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-paper-2"
          >
            <input
              type="radio"
              name={groupName}
              checked={s.slug === store.slug}
              onChange={() => {
                setStore(s.slug, "manual");
                setMsg(`Loja ${s.label} selecionada.`);
              }}
              className="h-5 w-5 accent-[rgb(var(--ink))]"
            />
            <span className="text-sm">
              <span className="block font-semibold">{s.label}</span>
              <span className="block text-xs text-muted">{s.city}</span>
            </span>
          </label>
        ))}
      </fieldset>
    </>
  );

  if (inline) {
    return (
      <div className={`rounded-lg bg-paper p-3 text-ink ${className}`}>
        <p className="mb-2 text-sm">
          Sua loja: <strong>{store.label}</strong>
        </p>
        {panel}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-tap items-center gap-2 rounded-md px-3 text-sm hover:bg-ink-3"
      >
        <Pin />
        <span className="text-left leading-tight">
          <span className="block text-[0.68rem] text-muted-dark">
            {storeSource === "geo" ? "Loja mais perto" : "Sua loja"}
          </span>
          <span className="block font-semibold">{store.label}</span>
        </span>
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden fill="currentColor">
          <path d="M2 4l4 4 4-4z" />
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-line bg-paper p-3 text-ink shadow-xl"
      >
        {panel}
      </div>
    </div>
  );
}

function Pin() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" aria-hidden fill="currentColor">
      <path d="M10 1.5a6 6 0 0 0-6 6c0 4.5 6 11 6 11s6-6.5 6-11a6 6 0 0 0-6-6Zm0 8.2A2.2 2.2 0 1 1 10 5.3a2.2 2.2 0 0 1 0 4.4Z" />
    </svg>
  );
}
