"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LayoutShell from "@/app/components/LayoutShell";
import { useToast } from "@/app/components/ToastProvider";

interface PublicNotes {
  id: string;
  title: string;
  content?: string;
  name: string;
}

interface Comment {
  id: string;
  note_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string; // Opsional, untuk join dengan users
}

export default function NotesIdClient() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [note, setNote] = useState<PublicNotes>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const resNote = await fetch(`/api/notes/public/${id}`);
        if (!resNote.ok) throw new Error("Gagal ambil note");
        const noteData = await resNote.json();

        const resComments = await fetch(`/api/comments/${id}`);
        const commentData = resComments.ok ? await resComments.json() : [];

        setNote(noteData);
        setComments(commentData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: commentText }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
        showToast("Komentar berhasil ditambahkan", "success");
      } else {
        showToast("Gagal menambahkan komentar", "error");
      }
    } catch {
      showToast("Terjadi kesalahan server", "error");
    }
  };

  if (loading)
    return (
      <LayoutShell>
        <p>Memuat catatan...</p>
      </LayoutShell>
    );
  if (!note)
    return (
      <LayoutShell>
        <p>Catatan tidak ditemukan</p>
      </LayoutShell>
    );

  return (
    <LayoutShell>
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
        <p className="text-gray-600 mb-4">Oleh: {note.name}</p>
        <p className="text-base mb-6 whitespace-pre-wrap">{note.content}</p>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Komentar</h3>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tulis komentar..."
            className="w-full bg-white p-2 border border-gray-300 rounded-md mb-2"
            rows={3}
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Kirim
          </button>
        </div>

        <div className="space-y-2">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada komentar.</p>
          ) : (
            comments.map((cmt) => (
              <div key={cmt.id} className="p-3 border rounded-md bg-gray-50">
                <p className="text-sm font-semibold">{cmt.user_name}</p>
                <p className="text-sm">{cmt.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
