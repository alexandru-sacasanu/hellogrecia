import { HomeSections } from "@/components/blocks";
import { getHomeSections } from "@/shared/queries";

// S01 Home. Its content and order come from home_sections (edited in admin, A08).
export default async function Home() {
  return <HomeSections sections={await getHomeSections()} />;
}
