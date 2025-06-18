import LayoutShell from "@/app/components/LayoutShell";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ERP System - Human Resources", // bisa juga ambil dari params jika dynamic route
  };
}

export default function HrPage() {
  return (
    <LayoutShell>
      <h1 className="text-2xl font-bold mb-4">HR Page!</h1>
      <p>Ini adalah halaman HR ERP.</p>
    </LayoutShell>
  );
}
