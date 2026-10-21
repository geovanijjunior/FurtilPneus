import "server-only";

export type Review = { author: string; rating: number; date: string; text: string; url: string };
export type PlaceReviews = { rating: number; count: number; reviews: Review[]; mapsUrl: string };

/** Mínimo de reviews reais para a seção aparecer. Abaixo disso, não renderiza. */
export const MIN_REVIEWS = 5;

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating: number;
    publishTime: string;
    googleMapsUri: string;
    text?: { text: string };
    originalText?: { text: string };
    authorAttribution?: { displayName: string };
  }[];
};

/**
 * Avaliações reais via Google Places API (New). Sem chave ou sem placeId
 * configurado, retorna null — e a página simplesmente não mostra a seção.
 * Nunca há fallback com texto fixo.
 */
export async function getPlaceReviews(placeId: string | null): Promise<PlaceReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !placeId) return null;
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 60 * 60 * 24 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as PlacesResponse;
    const reviews = (data.reviews ?? []).map((r) => ({
      author: r.authorAttribution?.displayName ?? "Cliente Google",
      rating: r.rating,
      date: r.publishTime,
      text: r.originalText?.text ?? r.text?.text ?? "",
      url: r.googleMapsUri,
    }));
    if (reviews.length < MIN_REVIEWS || !data.rating || !data.userRatingCount) return null;
    return {
      rating: data.rating,
      count: data.userRatingCount,
      reviews,
      mapsUrl: data.googleMapsUri ?? "",
    };
  } catch {
    return null;
  }
}
