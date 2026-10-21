// Placa antiga: ABC1234 · Mercosul: ABC1D23
const OLD = /^[A-Z]{3}[0-9]{4}$/;
const MERCOSUL = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

export function normalizePlate(raw: string) {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
}

/**
 * Máscara posicional: 3 letras, 1 dígito, letra-ou-dígito, 2 dígitos.
 * Caracteres fora da posição são descartados enquanto o usuário digita.
 */
export function maskPlate(raw: string) {
  const chars = normalizePlate(raw).split("");
  let out = "";
  for (const c of chars) {
    const i = out.length;
    const isL = /[A-Z]/.test(c);
    const isD = /[0-9]/.test(c);
    if (i < 3 && isL) out += c;
    else if (i === 3 && isD) out += c;
    else if (i === 4 && (isL || isD)) out += c;
    else if (i > 4 && i < 7 && isD) out += c;
    if (out.length === 7) break;
  }
  return out;
}

export function isValidPlate(plate: string) {
  return OLD.test(plate) || MERCOSUL.test(plate);
}

export function plateKind(plate: string): "mercosul" | "antiga" | null {
  if (MERCOSUL.test(plate)) return "mercosul";
  if (OLD.test(plate)) return "antiga";
  return null;
}

/** Converte placa antiga na equivalente Mercosul (2º dígito vira letra A–J). */
export function toMercosul(plate: string) {
  if (!OLD.test(plate)) return plate;
  return plate.slice(0, 4) + String.fromCharCode(65 + Number(plate[4])) + plate.slice(5);
}

export function displayPlate(plate: string) {
  return plateKind(plate) === "antiga" ? `${plate.slice(0, 3)}-${plate.slice(3)}` : plate;
}
