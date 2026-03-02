export function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("shela-admin-key") ?? "";
}

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const key = getAdminKey();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": key,
      ...options.headers,
    },
  });
}
