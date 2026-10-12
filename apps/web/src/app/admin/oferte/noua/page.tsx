import { createOfferAction } from "../../actions";
import { listAgents, listDestinations } from "../../data";
import { OfferForm } from "../OfferForm";

// A03 Offer editor, create mode
export const metadata = { title: "Ofertă nouă" };

export default function NewOffer() {
  return (
    <>
      <h1>Ofertă nouă</h1>
      <OfferForm destinations={listDestinations()} agents={listAgents()} action={createOfferAction} />
    </>
  );
}
