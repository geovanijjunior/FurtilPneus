export type Fitment = { medida: string; nota: string | null };

export type Vehicle = {
  id: string;
  marca: string;
  modelo: string;
  versao: string;
  anos: [number, number];
  fipe: string;
  medidas: Fitment[];
};

export type Product = {
  id: string;
  marca: string;
  linha: string;
  medida: string;
  indiceCargaVelocidade: string;
  precoVista: number;
  precoSemTroca: number | null;
  parcelas: number;
  garantiaAnos: number;
  lojas: string[];
};

export type LookupResult =
  | { status: "found"; plate: string; vehicle: Vehicle; year: number }
  | { status: "not_found"; plate: string };
