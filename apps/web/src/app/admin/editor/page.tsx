import { EditorShell } from "./EditorShell";

export const metadata = { title: "Editor live" };

// A09-ish: iframe of the live site + side panel that opens the right admin form on click.
export default function Page() {
  return <EditorShell />;
}
