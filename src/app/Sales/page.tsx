import LayoutShell from "@/app/components/LayoutShell";
import { type Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ERP System - Sales", // bisa juga ambil dari params jika dynamic route
  };
}

export default function SalesPage() {
  return (
    <LayoutShell>
      <h1 className="text-2xl font-bold mb-4">Sales Page!</h1>
      <p>Ini adalah halaman Sales ERP.</p>
    </LayoutShell>
  );
}
