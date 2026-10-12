"use client";
import { useState } from "react";
import { useCurrency } from "@/components/CurrencySwitch";
import { formatMoney } from "@/shared/price";
import type { Currency, Money } from "@/shared/types";

// S05 contact details + currency choice. The payment area becomes PaymentForm (C14) when Stripe is connected.
export function CheckoutForm({ total }: { total: Money }) {
  const shown = useCurrency();
  const [picked, setPicked] = useState<Currency | null>(null);
  const [sent, setSent] = useState(false);
  const cur = picked ?? shown;
  const amount = formatMoney(cur === "RON" ? total.ron : total.eur, cur);

  return (
    <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <fieldset>
        <legend>Datele tale</legend>
        <label className="input"><span>Nume și prenume</span><input id="c-name" name="name" autoComplete="name" required /></label>
        <label className="input"><span>Email</span><input id="c-email" name="email" type="email" autoComplete="email" required /></label>
        <label className="input"><span>Telefon</span><input id="c-phone" name="phone" type="tel" autoComplete="tel" placeholder="07xx xxx xxx" required /></label>
      </fieldset>

      <fieldset>
        <legend>Plătești în</legend>
        <div className="cur-choice">
          {(["RON", "EUR"] as const).map((c) => (
            <label key={c} className="cur-option">
              <input type="radio" name="currency" value={c} checked={cur === c} onChange={() => setPicked(c)} />
              <span>{c === "RON" ? "Lei" : "Euro"}</span>
              <b>{formatMoney(c === "RON" ? total.ron : total.eur, c)}</b>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Plata</legend>
        <div className="pay-placeholder" data-id="C14">
          <p><b>Card, Apple Pay sau Google Pay</b></p>
          <p>Plata online se conectează în etapa următoare (Stripe). Până atunci, formularul nu încasează nimic.</p>
        </div>
      </fieldset>

      <label className="terms">
        <input id="c-terms" type="checkbox" required />
        <span>Am citit și accept <a href="/termeni" target="_blank">termenii și condițiile</a> și politica de anulare.</span>
      </label>

      <button className="btn btn-primary btn-block" type="submit">Plătește {amount}</button>
      {sent && <p className="form-note" role="status">Datele sunt valide. Plata nu este încă activă, deci nu s-a încasat nimic.</p>}
    </form>
  );
}
