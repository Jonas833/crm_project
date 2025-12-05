import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import de from 'date-fns/locale/de'; // Für deutsche Lokalisierung
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Wichtig: CSS importieren!

// --- 1. Typdefinitionen ---

// Definiert die Struktur, wie Termine von Ihrer FastAPI-API kommen
interface FastAPITermin {
    id: number;
    customer_id: number;
    note: string | null;
    date: string; // Kommt als YYYY-MM-DD String von FastAPI
    created_at: string;
}

// Erweitert den Typ der Kalender-Events, um unsere eigenen Daten aufzunehmen
interface MyCalendarEvent extends BigCalendarEvent {
    id: number;
    customer_id: number;
}

// --- 2. Lokalisierung (date-fns) ---

// Legt fest, dass die Woche am Montag beginnt (1)
const locales = { 'de': de };
const localizer = dateFnsLocalizer({
    format, 
    parse, 
    startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), 
    getDay, 
    locales,
});

// --- 3. Hauptkomponente ---

const CalendarView: React.FC = () => {
    // State für die Kalender-Events
    const [events, setEvents] = useState<MyCalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    /**
     * Ruft Termine von der FastAPI-API für den sichtbaren Zeitraum ab.
     * @param start Das Startdatum des Kalenderbereichs (z.B. erster Tag des Monats)
     * @param end Das Enddatum des Kalenderbereichs (z.B. letzter Tag des Monats)
     */
    const fetchEvents = async (start: Date, end: Date) => {
        setIsLoading(true);

        // Formatiert die Daten für den FastAPI-API-Aufruf (YYYY-MM-DD)
        const startDateString = format(start, 'yyyy-MM-dd');
        const endDateString = format(end, 'yyyy-MM-dd');
        
        try {
            // Hinweis: Im Next.js Dev-Mode müssen Sie ggf. die volle URL verwenden (z.B. http://127.0.0.1:8000/api/termine)
            const response = await fetch(`http://127.0.0.1:8000/api/termine?start_date=${startDateString}&end_date=${endDateString}`);
            
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }

            const data: FastAPITermin[] = await response.json();

            // Mappt die API-Daten in das von 'react-big-calendar' erwartete Format
            const formattedEvents: MyCalendarEvent[] = data.map(item => ({
                id: item.id,
                customer_id: item.customer_id,
                // Titel zeigt die Customer ID und die Notiz
                title: `${item.customer_id} | ${item.note || 'Termin'}`,
                // Das Datum wird geparst. Wichtig: Termine ohne Uhrzeit sind Ganztages-Events.
                start: parse(item.date, 'yyyy-MM-dd', new Date()),
                end: parse(item.date, 'yyyy-MM-dd', new Date()), 
                allDay: true,
            }));
            
            setEvents(formattedEvents);

        } catch (error) {
            console.error("Fehler beim Laden der Termine:", error);
            // Hier könnten Sie eine Benutzer-Feedback-Meldung setzen
        } finally {
            setIsLoading(false);
        }
    };

    // Handler, der ausgelöst wird, wenn der Benutzer die Kalenderansicht wechselt (Monat/Woche/Tag)
    // Die 'range' gibt das erste und letzte sichtbare Datum im Kalender zurück.
    const handleRangeChange = (range: Date[] | { start: Date; end: Date }) => {
        let start: Date, end: Date;

        if (Array.isArray(range)) {
            // Bei Monatsansicht: range ist ein Array von Daten
            start = range[0];
            end = range[range.length - 1];
        } else {
            // Bei Wochen- oder Tagesansicht: range ist ein Objekt
            start = range.start;
            end = range.end;
        }
        
        fetchEvents(start, end);
    };

    // Initialer Ladevorgang (z.B. für den aktuellen Monat)
    useEffect(() => {
        // Lädt die Termine für den aktuellen Monat/die aktuelle Standardansicht
        const today = new Date();
        // Hier können Sie eine Logik einfügen, um einen initialen Bereich zu bestimmen,
        // z.B. nur den aktuellen Monat oder eine Woche
        // Für den Einfachheit halber lassen wir die 'onRangeChange' Logik die erste Abfrage steuern.
        // Wenn Sie möchten, können Sie hier einen ersten Aufruf starten:
        // fetchEvents(startOfMonth(today), endOfMonth(today)); 
    }, []);

    return (
        <div style={{ height: 700, margin: '20px' }}>
            {isLoading && <p>Termine werden geladen...</p>}
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start" // Feld im Event-Objekt für Startzeitpunkt
                endAccessor="end"     // Feld im Event-Objekt für Endzeitpunkt
                titleAccessor="title" // Feld im Event-Objekt für den Titel
                onRangeChange={handleRangeChange}
                culture="de"          // Stellt die Sprache auf Deutsch
                defaultView="month"   // Startet mit Monatsansicht
                style={{ height: '100%' }}
            />
        </div>
    );
};

export default CalendarView;