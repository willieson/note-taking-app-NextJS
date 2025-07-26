import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Taking Note App - Dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
