"use client";

import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { getTermin } from "@/lib/termin_api";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  de: require("date-fns/locale/de"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function KalenderPage() {
  const [kontoIdInput, setKontoIdInput] = useState<string>("1");
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string>("");

  async function loadTermin() {
    setError("");
    const konto_id = Number(kontoIdInput);

    if (isNaN(konto_id)) {
      setError("Bitte eine gültige Zahl eingeben.");
      return;
    }

    const termin = await getTermin(konto_id);

    if (!termin) {
      setEvents([]);
      setError("Kein Termin gefunden.");
      return;
    }

    setEvents([
      {
        title: termin.note || "Termin",
        start: new Date(termin.date_start),
        end: new Date(termin.date_end),
      },
    ]);
  }

  // Direkt beim Laden initial Konto-ID laden
  useEffect(() => {
    loadTermin();
  }, []);

  return (
    <div style={{ height: "90vh", padding: 20 }}>
      <h1 style={{ color: "white", marginBottom: 20 }}>Kalender</h1>

      {/* Eingabezeile */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          type="text"
          value={kontoIdInput}
          onChange={(e) => setKontoIdInput(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "150px",
          }}
          placeholder="Konto-ID"
        />

        <button
          onClick={loadTermin}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Laden
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
      )}

      {/* Kalender */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: "100%",
          background: "white",
          borderRadius: 10,
          padding: 10,
        }}
      />
    </div>
  );
}
