import { notFound } from "next/navigation";
import { deleteSectionAction, updateSectionAction } from "../../actions";
import { getHomeSectionById, listDestinations } from "../../data";
import { HomeSectionForm } from "../../HomeSectionForm";

// A08 Home section editor
export default async function EditSection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [section, destinations] = await Promise.all([getHomeSectionById(id), listDestinations()]);
  if (!section) notFound();
  return (
    <>
      <div className="admin-head">
        <h1>Editează secțiunea</h1>
        <form action={deleteSectionAction.bind(null, id)}><button className="btn btn-danger" type="submit">Șterge secțiunea</button></form>
      </div>
      <HomeSectionForm section={section} destinations={destinations} action={updateSectionAction.bind(null, id, section.type)} />
    </>
  );
}
