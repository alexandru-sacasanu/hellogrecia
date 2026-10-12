// Run: npm run check  (plain Node, no test framework)
import assert from "node:assert/strict";
import { formatMoney, lineTotal, toRon, unitPrice } from "./price.ts";
import type { Offer, OfferDate } from "./types.ts";

const offer = { price_eur: 45, price_ron_override: null, price_per: "person" } as Offer;

assert.equal(toRon(45, 5.09), 229);
assert.deepEqual(unitPrice(offer, 5.09), { eur: 45, ron: 229 });
assert.deepEqual(unitPrice({ ...offer, price_ron_override: 225 }, 5.09), { eur: 45, ron: 225 });
// a date's own EUR price wins over the offer's RON override
assert.deepEqual(unitPrice({ ...offer, price_ron_override: 225 }, 5.09, { price_override_eur: 50 } as OfferDate), { eur: 50, ron: 255 });
assert.deepEqual(lineTotal({ eur: 45, ron: 229 }, "person", 3), { eur: 135, ron: 687 });
assert.deepEqual(lineTotal({ eur: 890, ron: 4530 }, "stay", 4), { eur: 890, ron: 4530 });
assert.equal(formatMoney(1150, "RON"), "1.150 lei");
assert.equal(formatMoney(245, "EUR"), "245 €");
assert.equal(formatMoney(45.5, "EUR"), "45,5 €");
console.log("price checks passed");
