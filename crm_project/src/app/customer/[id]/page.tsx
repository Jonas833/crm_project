"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api_helper";
import "./customer-detail.css";

interface Customer {
  id: number;
  name: string;
  email: string;
  address_id: number | null;
  created_at: string;
}

interface Termin {
  customer_id: number;
  konto_id: number;
  date_start: string;
  date_end: string;
  note: string | null;
}

interface Invoice {
  id: number;
  number: string;
  date: string;
  amount: number;
  status?: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customerError, setCustomerError] = useState("");

  const [termins, setTermins] = useState<Termin[]>([]);
  const [terminLoading, setTerminLoading] = useState(true);
  const [terminError, setTerminError] = useState("");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(true);
  const [invoiceError, setInvoiceError] = useState("");

  const [notes, setNotes] = useState("");
  const [notesSavedAt, setNotesSavedAt] = useState<Date | null>(null);

  // Notizen aus localStorage laden
  useEffect(() => {
    if (!id) return;
    const key = `customer_notes_${id}`;
    const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (saved) setNotes(saved);
  }, [id]);

  // Notizen speichern bei Änderung
  useEffect(() => {
    if (!id) return;
    const key = `customer_notes_${id}`;
    if (typeof window !== "undefined") {
      localStorage.setItem(key, notes);
      if (notes.trim().length > 0) {
        setNotesSavedAt(new Date());
      }
    }
  }, [id, notes]);

  // Kunde laden
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadCustomer() {
      setCustomerLoading(true);
      setCustomerError("");
      try {
        const data = await apiGet(`/customer/get${id}`);
        if (cancelled) return;
        setCustomer(data);
      } catch (e) {
        if (!cancelled) setCustomerError("Kunde konnte nicht geladen werden.");
      } finally {
        if (!cancelled) setCustomerLoading(false);
      }
    }

    loadCustomer();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Termine laden (aktuell: /termin/get{id} → einzelner Termin oder später Liste)
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadTermins() {
      setTerminLoading(true);
      setTerminError("");
      try {
        const data = await apiGet(`/termin/get${id}`);

        if (cancelled) return;

        // Falls API nur ein Objekt zurückgibt → in Array packen
        const list = Array.isArray(data) ? data : data ? [data] : [];
        setTermins(list);
      } catch (e) {
        if (!cancelled)
          setTerminError("Termine konnten nicht geladen werden.");
      } finally {
        if (!cancelled) setTerminLoading(false);
      }
    }

    loadTermins();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Rechnungen laden – API musst du selbst implementieren, UI ist vorbereitet
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadInvoices() {
      setInvoiceLoading(true);
      setInvoiceError("");
      try {
        // Passe diesen Endpoint an deine echte Invoice-API an
        const data = await apiGet(`/invoices/customer/${id}`);
        if (cancelled) return;

        const list = Array.isArray(data) ? data : data ? [data] : [];
        setInvoices(list);
      } catch (e) {
        if (!cancelled) {
          setInvoiceError(
            "Rechnungen konnten nicht geladen werden (API evtl. noch nicht implementiert)."
          );
        }
      } finally {
        if (!cancelled) setInvoiceLoading(false);
      }
    }

    loadInvoices();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const notesSavedLabel = useMemo(() => {
    if (!notesSavedAt) return "";
    return `Zuletzt gespeichert: ${notesSavedAt.toLocaleTimeString()}`;
  }, [notesSavedAt]);

  return (
    <div className="customer-detail-container">
      <div className="customer-detail-header">
        <h1 className="customer-detail-title">
          {customerLoading ? "Kunde laden..." : customer?.name || "Kunde"}
        </h1>
        <button
          className="back-btn"
          type="button"
          onClick={() => router.push("/customer")}
        >
          ← Zurück zur Kundenliste
        </button>
      </div>

      {/* Top: Kacheln mit Basisinfos */}
      <div className="customer-cards">
        <div className="customer-card">
          <span className="card-label">Name</span>
          <span className="card-value">
            {customerLoading ? "…" : customer?.name || "—"}
          </span>
        </div>
        <div className="customer-card">
          <span className="card-label">E-Mail</span>
          <span className="card-value">
            {customerLoading ? "…" : customer?.email || "—"}
          </span>
        </div>
        <div className="customer-card">
          <span className="card-label">Adresse-ID</span>
          <span className="card-value">
            {customerLoading ? "…" : customer?.address_id ?? "—"}
          </span>
        </div>
        <div className="customer-card">
          <span className="card-label">Erstellt am</span>
          <span className="card-value">
            {customerLoading
              ? "…"
              : customer?.created_at
              ? new Date(customer.created_at).toLocaleString()
              : "—"}
          </span>
        </div>
      </div>

      {customerError && (
        <p className="error-message">{customerError}</p>
      )}

      {/* Bottom: 2 Spalten – links Termine & Rechnungen, rechts Notizen */}
      <div className="customer-detail-grid">
        <div className="customer-detail-left">
          <section className="section-block">
            <h2>Termine</h2>
            {terminLoading ? (
              <div className="list-skeleton">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="list-item skeleton">
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                  </div>
                ))}
              </div>
            ) : terminError ? (
              <p className="error-message">{terminError}</p>
            ) : termins.length === 0 ? (
              <p className="empty-text">Keine Termine vorhanden.</p>
            ) : (
              <ul className="item-list">
                {termins.map((t, idx) => (
                  <li key={idx} className="list-item">
                    <div className="list-main">
                      <span>
                        {new Date(t.date_start).toLocaleString()} –{" "}
                        {new Date(t.date_end).toLocaleString()}
                      </span>
                    </div>
                    {t.note && (
                      <div className="list-sub">
                        Notiz: {t.note}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="section-block">
            <h2>Rechnungen</h2>
            {invoiceLoading ? (
              <div className="list-skeleton">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="list-item skeleton">
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                  </div>
                ))}
              </div>
            ) : invoiceError ? (
              <p className="error-message">{invoiceError}</p>
            ) : invoices.length === 0 ? (
              <p className="empty-text">Keine Rechnungen vorhanden.</p>
            ) : (
              <ul className="item-list">
                {invoices.map((inv) => (
                  <li key={inv.id} className="list-item">
                    <div className="list-main">
                      <span>Rechnung {inv.number}</span>
                      <span>
                        {new Date(inv.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="list-sub">
                      Betrag: {inv.amount.toFixed(2)} €
                      {inv.status ? ` • Status: ${inv.status}` : ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="customer-detail-right">
          <section className="section-block">
            <h2>Notizen</h2>
            <textarea
              className="notes-textarea"
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Hier kannst du interne Notizen zum Kunden speichern (nur lokal im Browser)."
            />
            {notesSavedLabel && (
              <p className="notes-saved">{notesSavedLabel}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
