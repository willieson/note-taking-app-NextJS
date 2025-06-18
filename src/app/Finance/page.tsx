import { type Metadata } from "next";
import LayoutShell from "@/app/components/LayoutShell";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ERP System - Finance", // bisa juga ambil dari params jika dynamic route
  };
}

export default function FinancePage() {
  return (
    <LayoutShell>
      <h1 className="text-2xl font-bold mb-4">Finance Page!</h1>
      <p>Ini adalah halaman Finance ERP.</p>
    </LayoutShell>
  );
}
