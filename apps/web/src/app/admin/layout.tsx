import Link from "next/link";
import "./admin.css";

// Admin reads are uncached and always fresh (see admin/data.ts), so this whole tree renders
// on request instead of being prerendered as a static shell.
export const instant = false;

// A01-ish shell. No auth yet (local dev only) — see the note on /admin itself.
const NAV = [
  { href: "/admin", label: "Tablou de bord" },
  { href: "/admin/oferte", label: "Oferte" },
  { href: "/admin/home", label: "Pagina principală" },
];

export const metadata = { title: { template: "%s · Admin HelloGrecia", default: "Admin" }, robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link className="admin-logo" href="/admin">HelloGrecia <span>Admin</span></Link>
        <nav>
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
        <Link className="admin-back" href="/">← Vezi site-ul</Link>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
