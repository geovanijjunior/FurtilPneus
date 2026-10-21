import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-20">
      <p className="label text-muted">Erro 404</p>
      <h1 className="h-display mt-2 text-5xl">Essa página não existe</h1>
      <p className="mt-4 max-w-prose text-muted">
        O endereço pode ter mudado. Escolha por onde seguir:
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="btn-ink">
          Buscar pneu pela placa
        </Link>
        <Link href="/pneus" className="btn-ghost">
          Ver catálogo
        </Link>
        <Link href="/lojas" className="btn-ghost">
          Ver lojas
        </Link>
      </div>
    </div>
  );
}
