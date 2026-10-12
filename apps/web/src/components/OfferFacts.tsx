import type { Offer } from "@/shared/types";
import { Icon } from "./Icon";

// C19 OfferFacts
export function OfferFacts({ offer }: { offer: Offer }) {
  return (
    <dl className="facts" data-id="C19">
      <div><dt><Icon name="clock" />Durată</dt><dd>{offer.duration}</dd></div>
      <div><dt><Icon name="pin" />Punct de întâlnire</dt><dd>{offer.meeting_point}</dd></div>
      <div className="facts-wide">
        <dt><Icon name="check" />Ce include</dt>
        <dd><ul>{offer.included.map((x) => <li key={x}>{x}</li>)}</ul></dd>
      </div>
      <div className="facts-wide"><dt><Icon name="shield" />Anulare</dt><dd>{offer.cancellation_policy}</dd></div>
    </dl>
  );
}
