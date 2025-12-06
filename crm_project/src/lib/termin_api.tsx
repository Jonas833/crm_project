import { Termin } from "@/types/termin";

export async function getTermin(konto_id: number): Promise<Termin | null> {
  const res = await fetch(`http://127.0.0.1:8000/termin/get${konto_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store"
  });

  if (!res.ok) return null;

  return res.json();
}
