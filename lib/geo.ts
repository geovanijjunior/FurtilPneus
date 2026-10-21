import { stores, type Store } from "@/config/lojas";

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestStore(pos: { lat: number; lng: number }): { store: Store; km: number } {
  return stores.map((store) => ({ store, km: km(pos, store.geo) })).sort((a, b) => a.km - b.km)[0];
}
