import { Metadata } from "next";
import NotesIdClient from "./NotesIdClient";

export const metadata: Metadata = {
  title: "Taking Note App - Notes",
};

export default function DashboardPage() {
  return <NotesIdClient />;
}
