const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function money(v: number) {
  return brl.format(v);
}

export function installment(total: number, n: number) {
  return brl.format(Math.ceil((total / n) * 100) / 100);
}
