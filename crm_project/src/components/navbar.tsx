"use client";

import "./navbar.css"; 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/theme_provider";

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useTheme();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/customer", label: "Kunden" },
    { href: "/bill", label: "Rechnungen" },
    { href: "/kalender", label: "Kalender" },
    { href: "/settings", label: "Einstellungen" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <h2 className="nav-logo">CRM</h2>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={pathname === l.href ? "active" : ""}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
