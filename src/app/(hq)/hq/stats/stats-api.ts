import type { StatDTO, StatInput } from "@/modules/landing-stats/types";

const API_URL = "/api/hq/landing-stats";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function call<T>(method: string, url: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data?.error ?? "Request failed" };
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." };
  }
}

export const statsApi = {
  create: (i: StatInput) => call<{ stat: StatDTO }>("POST", API_URL, i),
  update: (id: string, i: StatInput) => call<{ stat: StatDTO }>("PATCH", `${API_URL}/${id}`, i),
  remove: (id: string) => call<{ ok: true }>("DELETE", `${API_URL}/${id}`),
  reorder: (ids: string[]) => call<{ ok: true }>("PUT", API_URL, { ids }),
};
