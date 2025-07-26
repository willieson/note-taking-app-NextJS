"use client";

import LayoutShell from "@/app/components/LayoutShell";
import InfoCard from "@/app/components/InfoCard";
import { useToast } from "@/app/components/ToastProvider";
import { useCallback, useEffect, useState } from "react";
import { extractErrorMessage } from "@/helper/error";
import Link from "next/link";

interface PublicNotes {
  id: string;
  title: string;
  content: string;
  name: string;
}

export default function DashboardPage() {
  const { showToast } = useToast();
  const [notes, setNotes] = useState<PublicNotes[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes/public");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengambil catatan publik");
      }

      if (!Array.isArray(data)) {
        throw new Error("Data dari API bukan array");
      }

      const ids = new Set(data.map((note: PublicNotes) => note.id));
      if (ids.size !== data.length) {
        console.warn("Terdapat duplikat ID dalam data:", data);
      }

      setNotes(data);
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToast(`Terjadi kesalahan: ${message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPublicNotes();
  }, [fetchPublicNotes]);

  return (
    <LayoutShell>
      {/* Info Cards */}

      <h2 className="text-xl font-semibold mb-4">Public Notes</h2>

      {loading ? (
        <p>Loading...</p>
      ) : notes.length > 0 ? (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {notes.map((note) => (
            <Link href={`/notes/${note.id}`} key={note.id}>
              <InfoCard
                title={note.title}
                value={note.content}
                subtitle={`by. ${note.name}`}
              />
            </Link>
          ))}
        </section>
      ) : (
        <p>Tidak ada notes publik yang tersedia.</p>
      )}
    </LayoutShell>
  );
}
