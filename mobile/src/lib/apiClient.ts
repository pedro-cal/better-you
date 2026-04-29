import { env } from "./env";
import { tokenStorage } from "./storage";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<{ data: T }> {
  const token = await tokenStorage.get();

  const res = await fetch(`${env.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const json = (await res.json()) as { data?: T; error?: string };

  if (!res.ok) {
    throw new ApiError(res.status, json.error ?? "Request failed");
  }

  return json as { data: T };
}
