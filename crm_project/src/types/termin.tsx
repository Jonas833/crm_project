export interface Termin {
    customer_id: number;
    konto_id: number;
    date_start: string;  // ISO from backend
    date_end: string;
    note: string | null;
  }
  