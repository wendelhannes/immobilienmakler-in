"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/staedte", label: "Städte" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/seo-fuer-immobilienmakler", label: "Für Makler" },
  { href: "/ueber-uns", label: "Über uns" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="topnav">
      <Link href="/" className="logo" onClick={close}>
        immobilienmakler<span>-in</span>
      </Link>

      {/* Desktop-Links */}
      <div className="nav-links nav-desktop">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
        <Link href="/sichtbarkeits-check" className="nav-cta">
          Sichtbarkeits-Check →
        </Link>
      </div>

      {/* Mobile: Burger */}
      <button
        className="nav-burger"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={`nb-bar${open ? " nb-x1" : ""}`} />
        <span className={`nb-bar${open ? " nb-hide" : ""}`} />
        <span className={`nb-bar${open ? " nb-x2" : ""}`} />
      </button>

      {open && (
        <div className="nav-mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
            </Link>
          ))}
          <Link href="/sichtbarkeits-check" className="nav-cta" onClick={close}>
            Sichtbarkeits-Check →
          </Link>
        </div>
      )}
    </nav>
  );
}
