import { createSectionAction } from "../../actions";
import { listDestinations } from "../../data";
import { HomeSectionForm } from "../../HomeSectionForm";

// A08 New home section
export const metadata = { title: "Secțiune nouă" };

export default async function NewSection() {
  const destinations = await listDestinations();
  return (
    <>
      <h1>Secțiune nouă</h1>
      <HomeSectionForm destinations={destinations} action={createSectionAction} allowTypeChange />
    </>
  );
}
