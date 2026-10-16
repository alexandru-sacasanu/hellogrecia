import { notFound } from "next/navigation";
import { updateCampaignAction } from "../../actions";
import { getCampaignById } from "../../data";
import { CampaignForm } from "../../CampaignForm";

// A07 Campaign editor
export default async function EditCampaign({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();
  return (
    <>
      <h1>{campaign.title}</h1>
      <CampaignForm campaign={campaign} action={updateCampaignAction.bind(null, id)} />
    </>
  );
}
