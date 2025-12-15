"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api_helper";
import "./new-customer.css";

interface NewCustomerForm {
  name: string;
  email: string;
  street: string;
  house_number: string;
  zip: string;
  city: string;
  tel: string;
}

export default function NewCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState<NewCustomerForm>({
    name: "",
    email: "",
    street: "",
    house_number: "",
    zip: "",
    city: "",
    tel: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setError] = useState("");
  const [successMessage, setSuccess] = useState("");

  function updateField<K extends keyof NewCustomerForm>(key: K, value: NewCustomerForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name und E-Mail sind Pflichtfelder.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        address: {
          street: form.street,
          house_number: form.house_number,
          zip: form.zip,
          city: form.city,
          tel: form.tel,
        },
      };

      await apiPost("/customer/post", payload);

      setSuccess("Kunde wurde erfolgreich angelegt.");
      // Optional: Formular leeren
      setForm({
        name: "",
        email: "",
        street: "",
        house_number: "",
        zip: "",
        city: "",
        tel: "",
      });

      // Nach kurzer Zeit zur Kundenliste
      setTimeout(() => {
        router.push("/customer");
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Fehler beim Anlegen des Kunden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="new-customer-container">
      <div className="new-customer-header">
        <h1 className="new-customer-title">Neuer Kunde</h1>
        <button
          type="button"
          className="back-btn"
          onClick={() => router.push("/customer")}
        >
          ← Zurück zur Kundenliste
        </button>
      </div>

      <form className="new-customer-form" onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="form-section">
          <h2>Stammdaten</h2>
          <div className="form-row">
            <label>
              Name *
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Max Mustermann / Musterfirma GmbH"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              E-Mail *
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="kunde@example.com"
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Adresse</h2>
          <div className="form-row form-row-two">
            <label>
              Straße
              <input
                type="text"
                value={form.street}
                onChange={(e) => updateField("street", e.target.value)}
                placeholder="Musterstraße"
              />
            </label>
            <label>
              Nr.
              <input
                type="text"
                value={form.house_number}
                onChange={(e) => updateField("house_number", e.target.value)}
                placeholder="12a"
              />
            </label>
          </div>

          <div className="form-row form-row-two">
            <label>
              PLZ
              <input
                type="text"
                value={form.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                placeholder="12345"
              />
            </label>
            <label>
              Stadt
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Musterstadt"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Telefon
              <input
                type="tel"
                value={form.tel}
                onChange={(e) => updateField("tel", e.target.value)}
                placeholder="+49 123 456789"
              />
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Speichern..." : "Kunden anlegen"}
          </button>
        </div>
      </form>
    </div>
  );
}
