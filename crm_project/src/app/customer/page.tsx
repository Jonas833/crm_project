"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api_helper";
import "./customer_design.css";
interface Customer {
  id: number;
  name: string;
  is_company?: boolean;
  type?: "company" | "private";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  // Kunden laden
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiGet("/get_customers");

        if (cancelled) return;

        if (!data || data.length === 0) {
          setErrorMessage("Keine Kunden gefunden.");
          setCustomers([]);
        } else {
          const mapped: Customer[] = data.map((c: any) => {
            const name: string = c.name || "";
            const looksLikeCompany =
              c.is_company === true ||
              /(gmbh|ag|kg|ohg|ug|gbr|ltd|inc|sarl|s\.?l\.?|firma)/i.test(
                name
              );

            return {
              id: c.id,
              name,
              is_company: looksLikeCompany,
              type: looksLikeCompany ? "company" : "private",
            };
          });

          setCustomers(mapped);
        }
      } catch (e) {
        if (!cancelled) {
          setErrorMessage("Fehler beim Laden der Kundendaten.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter + "Pagination" (sichtbare Elemente)
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = customers;

    const list = term
      ? base.filter((c) => c.name.toLowerCase().includes(term))
      : base;

    return list.slice(0, visibleCount);
  }, [customers, search, visibleCount]);

  // bei neuem Suchbegriff wieder bei 20 starten
  useEffect(() => {
    setVisibleCount(20);
  }, [search]);

  // Infinite Scroll
  useEffect(() => {
    function onScroll() {
      if (loading) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 200;

      if (scrollPosition >= threshold) {
        setVisibleCount((prev) =>
          prev < customers.length ? prev + 20 : prev
        );
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [customers.length, loading]);

  const showLoadMore =
    !loading &&
    filtered.length < customers.length &&
    search.trim() === "";

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h1 className="customers-title">Kunden</h1>
        <button
          className="add-customer-btn"
          onClick={() => (window.location.href = "/customer/new")}
        >
          + Neuer Kunde
        </button>
      </div>

      <div className="customers-toolbar">
        <input
          className="customers-search"
          type="text"
          placeholder="Kunden suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="customers-count">
          {loading ? "Lade Kunden..." : `${customers.length} Kunden`}
        </span>
      </div>

      {errorMessage && !loading && (
        <p className="error-message">{errorMessage}</p>
      )}

      <div className="customer-list">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="customer-item skeleton">
                <div className="skeleton-icon" />
                <div className="skeleton-text" />
              </div>
            ))
          : filtered.map((c) => (
              <a
                key={c.id}
                href={`/customer/${c.id}`}
                className="customer-item"
              >
                <span className="customer-icon">
                  {c.type === "company" ? "🏢" : "👤"}
                </span>
                <span className="customer-name">{c.name}</span>
              </a>
            ))}
      </div>

      {showLoadMore && (
        <button
          className="load-more-btn"
          onClick={() =>
            setVisibleCount((prev) =>
              prev + 20 > customers.length ? customers.length : prev + 20
            )
          }
        >
          Mehr laden
        </button>
      )}
    </div>
  );
}
