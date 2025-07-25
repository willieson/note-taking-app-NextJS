import { Metadata } from "next";
import LayPage from "./layutils";

export const metadata: Metadata = {
  title: "ERP System - Dashboard",
};

export default function DashboardPage() {
  return <LayPage />;
}
