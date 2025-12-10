export const API_URL = "http://127.0.0.1:8000";

/**
 * POST Request Helper — Backend gibt garantiert JSON zurück
 */
export async function apiPost(path: string, body: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Falls API Fehler meldet → Exception
  if (!res.ok) {
    const errorText = await res.text();
    console.error("API POST ERROR:", errorText);
    throw new Error(errorText);
  }

  // Body darf *nur einmal* gelesen werden!
  return res.json();
}

/**
 * GET Request Helper — Backend gibt garantiert JSON zurück
 */
export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API GET ERROR:", errorText);
    throw new Error(errorText);
  }

  return res.json();
}
