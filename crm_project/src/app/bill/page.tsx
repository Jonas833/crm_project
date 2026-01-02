"use client";

import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, API_URL } from "@/lib/api_helper"; 

type BillItemTemplate = {
  id: number;
  description: string;
  price: number | string;
  default_quantity: number; 
};

type CreateBillRequest = {
  customer_id: number;
  item_ids: number[];
};

type CreateBillResponse = {
  bill_id: number;
  pdf_path: string; // z.B. "pdf/bill_12.pdf"
};

function parsePrice(v: number | string): number {
  return typeof v === "number" ? v : Number(v);
}

function toPdfUrl(pdfPath: string) {
  // Backend liefert "pdf/bill_12.pdf" zurück -> wir machen daraus "<API_URL>/pdf/bill_12.pdf"
  const cleanedBase = API_URL.replace(/\/+$/, "");
  const cleanedPath = pdfPath.replace(/^\/+/, "");
  return `${cleanedBase}/${cleanedPath}`;
}

export default function CreateBillPage() {
  const [customerId, setCustomerId] = useState<string>("");

  const [templates, setTemplates] = useState<BillItemTemplate[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [createError, setCreateError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateBillResponse | null>(null);

  async function loadTemplates() {
    setLoadError(null);
    setLoading(true);
  
    try {
      const data = (await apiGet("/bill_templates/get")) as BillItemTemplate[];
  
      console.log("templates from api:", data); // Debug
  
      setTemplates(data); // ✅ DAS hat gefehlt
    } catch (e: any) {
      setLoadError(e?.message ?? "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    loadTemplates();
  }, []);

  const total = useMemo(() => {
    const chosen = templates.filter((t) => selectedIds.has(t.id));
    return chosen.reduce((sum, t) => {
      const price = parsePrice(t.price);
      const qty = t.default_quantity ?? 1;
      return sum + price * qty;
    }, 0);
  }, [templates, selectedIds]);

  function toggle(id: number) {
    setCreateError(null);
    setResult(null);

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function createBill() {
    setCreateError(null);
    setResult(null);

    const cid = Number(customerId);
    if (!Number.isFinite(cid) || cid <= 0) {
      setCreateError("Bitte eine gültige customer_id eingeben.");
      return;
    }

    const item_ids = Array.from(selectedIds);
    if (item_ids.length === 0) {
      setCreateError("Bitte mindestens ein Item auswählen.");
      return;
    }

    const payload: CreateBillRequest = { customer_id: cid, item_ids };

    setLoading(true);
    try {
      // ✅ nutzt deinen Helper
      const data = (await apiPost("/bill/create-from-items", payload)) as CreateBillResponse;
      setResult(data);
    } catch (e: any) {
      setCreateError(e?.message ?? "Failed to create bill");
    } finally {
      setLoading(false);
    }
  }

  const pdfUrl = result ? toPdfUrl(result.pdf_path) : null;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Rechnung erstellen
      </h1>

      <div style={{ display: "flex", gap: 16, alignItems: "end", marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, opacity: 0.8 }}>customer_id</label>
          <input
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="z.B. 12"
            inputMode="numeric"
            style={{
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 8,
              width: 180,
            }}
          />
        </div>

        <button
          onClick={createBill}
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #111",
            background: loading ? "#eee" : "#111",
            color: loading ? "#333" : "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "..." : "Rechnung erzeugen"}
        </button>

        <div style={{ marginLeft: "auto", fontWeight: 600 }}>
          Summe (Vorschau): {total.toFixed(2)} €
        </div>
      </div>

      {loadError && (
        <div style={{ padding: 12, borderRadius: 8, background: "#fff3cd", marginBottom: 12 }}>
          {loadError}{" "}
          <button onClick={loadTemplates} style={{ marginLeft: 8 }}>
            neu laden
          </button>
        </div>
      )}

      {createError && (
        <div style={{ padding: 12, borderRadius: 8, background: "#f8d7da", marginBottom: 12 }}>
          {createError}
        </div>
      )}

      {result && (
        <div style={{ padding: 12, borderRadius: 8, background: "#d1e7dd", marginBottom: 12 }}>
          <div>
            Bill erstellt: <b>#{result.bill_id}</b>
          </div>
          {pdfUrl && (
            <div style={{ marginTop: 6 }}>
              PDF:{" "}
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                öffnen
              </a>
            </div>
          )}
        </div>
      )}

      <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: 12, background: "#fafafa", fontWeight: 700 }}>
          Bill Item Templates
        </div>

        {loading && templates.length === 0 ? (
          <div style={{ padding: 12 }}>Lade...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: 12, width: 60 }}>Auswahl</th>
                <th style={{ padding: 12 }}>Beschreibung</th>
                <th style={{ padding: 12, width: 120 }}>Menge</th>
                <th style={{ padding: 12, width: 140 }}>Preis</th>
                <th style={{ padding: 12, width: 160 }}>Zwischensumme</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => {
                const checked = selectedIds.has(t.id);
                const price = parsePrice(t.price);
                const qty = t.default_quantity ?? 1;
                const sub = price * qty;

                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                    <td style={{ padding: 12 }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(t.id)}
                      />
                    </td>
                    <td style={{ padding: 12 }}>{t.description}</td>
                    <td style={{ padding: 12 }}>{qty}</td>
                    <td style={{ padding: 12 }}>{price.toFixed(2)} €</td>
                    <td style={{ padding: 12 }}>{sub.toFixed(2)} €</td>
                  </tr>
                );
              })}

              {templates.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ padding: 12, opacity: 0.7 }}>
                    Keine Templates gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      
    </div>
  );
}
