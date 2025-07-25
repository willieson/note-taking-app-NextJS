"use client";
import { useEffect, useState } from "react";
import LayoutShell from "@/app/components/LayoutShell";
import InfoCard from "@/app/components/InfoCard";
import Link from "next/link";

export default function DashboardPage() {
  const [publicNotes, setPublicNotes] = useState<
    { id: number; title: string; content: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes/public");
        if (res.ok) {
          const data = await res.json();
          setPublicNotes(data);
        }
      } catch (err) {
        console.error("Gagal mengambil notes publik:", err);
      }
    };

    fetchNotes();
  }, []);

  return (
    <LayoutShell>
      {/* Notes Publik */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Catatan Publik</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicNotes.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada catatan publik.</p>
          ) : (
            publicNotes.map((note) => (
              <Link href={`/notes/${note.id}`} key={note.id}>
                <InfoCard
                  title={note.title}
                  value={note.content.slice(0, 100) + "..."}
                  subtitle={`Oleh: ${note.name}`}
                />
              </Link>
            ))
          )}
        </div>
      </section>
    </LayoutShell>
  );
}
