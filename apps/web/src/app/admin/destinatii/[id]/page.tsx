import { notFound } from "next/navigation";
import { updateDestinationAction } from "../../actions";
import { getDestinationById } from "../../data";
import { DestinationForm } from "../../DestinationForm";

// A09 Destination editor
export default async function EditDestination({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await getDestinationById(id);
  if (!destination) notFound();
  return (
    <>
      <h1>{destination.name}</h1>
      <DestinationForm destination={destination} action={updateDestinationAction.bind(null, id)} />
    </>
  );
}
