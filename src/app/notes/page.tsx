import { Metadata } from "next";
import NotesClient from "./NotesClient";
import LayoutShell from "../components/LayoutShell";

export const metadata: Metadata = {
  title: "Taking Notes App - Notes",
};

export default function NotesPage() {
  return (
    <LayoutShell>
      <NotesClient />
    </LayoutShell>
  );
}
