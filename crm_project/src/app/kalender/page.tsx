"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Event as RBCEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { de } from "date-fns/locale";
import { apiGet } from "@/lib/api_helper";
import "./kalender_design.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

type CalendarEvent = {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
};

const locales = {
  de: de,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarPage() {
  const [kontoIdInput, setKontoIdInput] = useState<string>("");
  const [kontoId, setKontoId] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setError] = useState("");

  async function handleLoad(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEvents([]);

    if (!kontoIdInput.trim()) {
      setError("Bitte eine Konto-ID eingeben.");
      return;
    }

    setKontoId(kontoIdInput.trim());
  }

  useEffect(() => {
    if (!kontoId) return;

    let cancelled = false;

    async function loadTermine() {
      setLoading(true);
      setError("");
      try {
        // Dein Backend-Endpunkt: z.B. /termin/get1
        const data = await apiGet(`/termin/get${kontoId}`);

        if (cancelled) return;

        // Falls nur ein Termin-Objekt zurückkommt → in Array packen
        const list = Array.isArray(data) ? data : data ? [data] : [];

        const mapped: CalendarEvent[] = list.map((t: any, index: number) => {
          const start = new Date(t.date_start);
          const end = new Date(t.date_end);

          return {
            id: t.id ?? index,
            title: t.note || `Termin (Kunde ${t.customer_id})`,
            start,
            end,
          };
        });

        setEvents(mapped);
        if (mapped.length === 0) {
          setError("Keine Termine für dieses Konto gefunden.");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Fehler beim Laden der Termine.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTermine();

    return () => {
      cancelled = true;
    };
  }, [kontoId]);

  return (
    <div className="calendar-page-container">
      <div className="calendar-header">
        <h1 className="calendar-title">Kalender</h1>

        <form className="calendar-toolbar" onSubmit={handleLoad}>
          <div className="konto-input-group">
            <label htmlFor="kontoId">Konto-ID</label>
            <input
              id="kontoId"
              type="number"
              value={kontoIdInput}
              onChange={(e) => setKontoIdInput(e.target.value)}
              placeholder="z.B. 1"
            />
          </div>
          <button type="submit" className="load-btn">
            Termine laden
          </button>
        </form>
      </div>

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
        
        />
      </div>

      {loading && (
        <div className="calendar-loading-overlay">
          <div className="spinner" />
          <span>Termine werden geladen...</span>
        </div>
      )}
    </div>
  );
}


