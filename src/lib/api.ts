// Backend API client for Kisan.AI
// Tries the FastAPI backend at API_BASE; throws on failure so callers can fallback.

export const API_BASE = "http://localhost:8000";

export interface RecommendRequest {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface RecommendResponse {
  crops: string[];
  message: string;
}

export interface YieldRequest {
  crop: string;
  area_ha: number;
  temperature: number;
  method?: "iqr" | string;
  narrow_pct?: number;
}

export interface YieldResponse {
  crop: string;
  area_ha: number;
  temperature_c_used: number;
  fertilizer_per_ha_range: [number | null, number | null];
  pesticide_per_ha_range: [number | null, number | null];
  yield_per_ha_range: [number | null, number | null];
  total_fertilizer_range: [number | null, number | null];
  total_pesticide_range: [number | null, number | null];
  total_yield_range: [number | null, number | null];
  message: string;
}

async function postJSON<T>(path: string, body: unknown, timeoutMs = 8000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Backend ${res.status}: ${text || res.statusText}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const apiRecommend = (body: RecommendRequest) =>
  postJSON<RecommendResponse>("/recomend", body);

export const apiYield = (body: YieldRequest) =>
  postJSON<YieldResponse>("/yield", body);
