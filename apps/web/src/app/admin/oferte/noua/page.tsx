import { createOfferAction } from "../../actions";
import { listAgents, listDestinations } from "../../data";
import { OfferForm } from "../OfferForm";

// A03 Offer editor, create mode
export const metadata = { title: "Ofertă nouă" };

export default async function NewOffer() {
  const [destinations, agents] = await Promise.all([listDestinations(), listAgents()]);
  return (
    <>
      <h1>Ofertă nouă</h1>
      <OfferForm destinations={destinations} agents={agents} action={createOfferAction} />
    </>
  );
}
