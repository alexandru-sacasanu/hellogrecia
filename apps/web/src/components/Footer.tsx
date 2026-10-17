"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// C18 Footer. ANPC and its SAL (alternative dispute resolution) link are required for Romanian online shops.
export function Footer() {
  if (usePathname().startsWith("/admin")) return null;
  return (
    <footer className="footer" id="contact" data-id="C18">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="logo" href="/" aria-label="HelloGrecia.ro">
            <Image
              src="/logo-dark.png"
              alt="HelloGrecia"
              width={140}
              height={38}
              className="logo-img logo-img-dark"
            />
            <Image
              src="/logo-white.png"
              alt="HelloGrecia"
              width={140}
              height={38}
              className="logo-img logo-img-white"
            />
          </Link>
          <p>Cazări, excursii, ture cu barca și croaziere în Grecia, pentru călătorii din România.</p>
          <p className="footer-pay">Card · Apple Pay · Google Pay · lei sau euro</p>
        </div>
        <nav aria-label="Destinații">
          <h2>Destinații</h2>
          <Link href="/destinatii/lefkada">Lefkada</Link>
          <Link href="/destinatii/thassos">Thassos</Link>
          <Link href="/destinatii/halkidiki">Halkidiki</Link>
          <Link href="/destinatii/creta">Creta</Link>
        </nav>
        <nav aria-label="Ajutor">
          <h2>Ajutor</h2>
          <Link href="/contact">Contact</Link>
          <Link href="/termeni">Termeni și condiții</Link>
          <Link href="/confidentialitate">Confidențialitate</Link>
        </nav>
        <nav aria-label="Protecția consumatorului">
          <h2>Consumatori</h2>
          <a href="https://anpc.ro" target="_blank" rel="noopener">ANPC</a>
          <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener">Soluționarea alternativă a litigiilor</a>
        </nav>
      </div>
      <p className="footer-copy">© 2026 HelloGrecia.ro</p>
    </footer>
  );
}
