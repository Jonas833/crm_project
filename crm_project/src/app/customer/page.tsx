import { apiGet } from "@/lib/api_helper";

export default async function CustomersPage() {
  let customers: any[] = [];
  let errorMessage = "";

  try {
    customers = await apiGet("/get_customers");

    // Falls dein Backend None zurückgibt
    if (!customers || customers.length === 0) {
      errorMessage = "Keine Kunden gefunden.";
    }

  } catch (e: any) {
    errorMessage = "Fehler beim Laden der Kundendaten.";
  }

  return (
    <div>
      <h1>Kunden</h1>

      {errorMessage && (
        <p style={{ color: "red", marginBottom: "20px" }}>
          {errorMessage}
        </p>
      )}

      {customers.length > 0 && (
        <ul>
          {customers.map((c: any) => (
            <li key={c.id}>
              <a href={`/customer/${c.id}`}>{c.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

