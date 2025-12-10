import { apiGet } from "@/lib/api_helper";

export default async function CustomerDetail(props: any) {
  // params korrekt entpacken (Next.js 15)
  const { id } = await props.params;

  // API entsprechend deinem Backend
  const customer = await apiGet(`/customer/get${id}`);

  return (
    <div>
      <h1>Kunde: {customer.name}</h1>
      <p>Email: {customer.email}</p>
      <p>Adresse ID: {customer.address_id}</p>
      <p>Erstellt am: {customer.created_at}</p>

      <a href="/customer">← Zurück</a>
    </div>
  );
}

