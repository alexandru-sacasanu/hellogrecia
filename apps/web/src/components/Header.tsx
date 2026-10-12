"use client";
import Link from "next/link";
import type { MouseEvent } from "react";
import { CurrencySwitch } from "./CurrencySwitch";
import { Icon } from "./Icon";

// C01 Header. Solid by default; over a hero (B01) CSS turns it into the glass pill.
const LINKS = [
  { href: "/#destinatii", label: "Destinații" },
  { href: "/cauta?tip=stay", label: "Cazări" },
  { href: "/cauta?tip=boat", label: "Ture cu barca" },
  { href: "/cauta?tip=cruise", label: "Croaziere" },
];

const closeMenu = (e: MouseEvent<HTMLElement>) => {
  const d = e.currentTarget.closest("details");
  if (d) d.open = false;
};

export function Header() {
  return (
    <header className="topbar" data-id="C01">
      <div className="topbar-inner">
        <Link className="logo" href="/" aria-label="HelloGrecia.ro, pagina principală">
          <span className="logo-mark">H</span>
          <span>HelloGrecia<small>.ro</small></span>
        </Link>
        <nav className="topnav" aria-label="Principal">
          {LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>
        <div className="tools">
          <Link className="icon-btn hide-sm" href="/cauta" aria-label="Caută oferte"><Icon name="search" /></Link>
          <CurrencySwitch />
          <details className="menu">
            <summary className="icon-btn" aria-label="Meniu"><Icon name="menu" /></summary>
            <nav aria-label="Meniu">
              {LINKS.map((l) => <Link key={l.href} href={l.href} onClick={closeMenu}>{l.label}</Link>)}
              <Link href="/cauta" onClick={closeMenu}>Toate ofertele</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
