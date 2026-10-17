import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { EditModeBridge } from "@/components/EditModeBridge";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

// latin-ext carries ă, â, î, ș, ț
const serif = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif" });
const sans = Figtree({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "HelloGrecia.ro · Vacanțe în Grecia", template: "%s · HelloGrecia.ro" },
  description: "Cazări, excursii, ture cu barca și croaziere în Grecia. Plătești în lei sau în euro.",
};

// Runs before first paint so EUR viewers never see RON prices flash (see CurrencySwitch, C03).
const CURRENCY = `try{if(localStorage.getItem("hg-cur")==="EUR")document.documentElement.dataset.cur="EUR"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <Script id="currency-flash-prevention" strategy="beforeInteractive">{CURRENCY}</Script>
        <Suspense>
          <EditModeBridge />
        </Suspense>
        <Suspense>
          <Header />
        </Suspense>
        <main>{children}</main>
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
