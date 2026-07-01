import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="topnav">
      <Link href="/" className="logo">
        immobilienmakler<span>-in</span>
      </Link>
      <div className="nav-links">
        <Link href="/#staedte" className="nav-hide-sm">
          Städte
        </Link>
        <Link href="/#ratgeber" className="nav-hide-sm">
          Ratgeber
        </Link>
        <Link href="/sichtbarkeits-check" className="nav-cta">
          Sichtbarkeits-Check →
        </Link>
      </div>
    </nav>
  );
}
