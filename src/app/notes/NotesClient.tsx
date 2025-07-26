"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import InfoCard from "../components/InfoCard";
import { useToast } from "../components/ToastProvider";
import { extractErrorMessage } from "@/helper/error";
import Modal from "../components/Modal";
import { Edit, Trash2, Share2, X } from "lucide-react";
import Select from "react-select";

interface ToastContextType {
  showToast: (message: string, type: "success" | "error") => void;
}

// Definisikan tipe untuk opsi Select
interface SelectOption {
  value: string;
  label: string;
}

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface SharedNote {
  shared_note_id: string;
  note_id: string;
  shared_to_id: string;
  shared_to_email: string;
  shared_to_name: string;
  shared_by_user_id: string;
  shared_by_email: string;
  shared_by_name: string;
  title: string;
  content: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

const NotesClient = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast() as ToastContextType;
  const [notes, setNotes] = useState<Note[]>([]);
  const [sharedNotesToMe, setSharedNotesToMe] = useState<SharedNote[]>([]);
  const [sharedNotesTo, setSharedNotesTo] = useState<SharedNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (res.ok) {
        if (!Array.isArray(data)) {
          throw new Error("Data dari API bukan array");
        }
        // Periksa apakah ada duplikat id
        const ids = new Set(data.map((note: Note) => note.id));
        if (ids.size !== data.length) {
          console.warn("Terdapat duplikat ID dalam data:", data);
        }
        setNotes(data);
      } else {
        showToast(data.error || "Gagal mengambil catatan", "error");
      }
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToast(`Terjadi kesalahan: ${message}`, "error");
    }
  }, [showToast]);

  const fetchSharedNotesToMe = useCallback(async () => {
    try {
      const res = await fetch("/api/notes/shared");
      const data = await res.json();
      if (res.ok) {
        if (!Array.isArray(data)) {
          throw new Error("Data dari API bukan array");
        }
        setSharedNotesToMe(data);
      } else {
        showToast(
          data.error || "Gagal mengambil catatan yang dibagikan",
          "error"
        );
      }
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToast(`Terjadi kesalahan: ${message}`, "error");
    }
  }, [showToast]);

  const fetchSharedNotesTo = useCallback(
    async (noteId: string) => {
      try {
        const res = await fetch(
          `/api/notes/shared-to?noteId=${noteId}&userId=${session?.user?.id}`
        );
        const data = await res.json();
        if (res.ok) {
          if (!Array.isArray(data)) {
            throw new Error("Data dari API bukan array");
          }
          setSharedNotesTo(data);
        } else {
          showToast(
            data.error ||
              "Gagal mengambil catatan yang dibagikan oleh pengguna",
            "error"
          );
        }
      } catch (error: unknown) {
        const message = extractErrorMessage(error);
        showToast(`Terjadi kesalahan: ${message}`, "error");
      }
    },
    [session?.user?.id, showToast]
  );

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        if (!Array.isArray(data)) {
          throw new Error("Data dari API bukan array");
        }
        setUsers(data);
      } else {
        showToast(data.error || "Gagal mengambil daftar pengguna", "error");
      }
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToast(`Terjadi kesalahan: ${message}`, "error");
    }
  }, [showToast]);

  const handleCreateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, isPublic }), // Default is_public = false
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Gagal membuat catatan", "error");
        setIsLoading(false);
        return;
      }

      showToast("Catatan berhasil dibuat!", "success");
      setIsModalOpen(false);
      setTitle("");
      setContent("");
      setIsPublic(false);
      fetchNotes(); // Refresh daftar catatan
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToast(`Terjadi kesalahan: ${message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedNote) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, isPublic }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Gagal memperbarui catatan", "error");
        setIsLoading(false);
        return;
      }
      showToast("Catatan berhasil diperbarui!", "success");
      setIsEditModalOpen(false);
      setTitle("");
      setContent("");
      setIsPublic(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToast(`Terjadi kesalahan: ${message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || "Gagal menghapus catatan", "error");
          return;
        }
        showToast("Catatan berhasil dihapus!", "success");
        fetchNotes();
      } catch (error: unknown) {
        const message = extractErrorMessage(error);
        showToast(`Terjadi kesalahan: ${message}`, "error");
      }
    }
  };

  const handleShareNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedNote) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/notes/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: selectedNote.id,
          sharedToUserIds: selectedUsers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Gagal membagikan catatan", "error");
        setIsLoading(false);
        return;
      }
      showToast("Catatan berhasil dibagikan!", "success");
      setIsShareModalOpen(false);
      setSelectedUsers([]);
      fetchSharedNotesToMe();
      fetchSharedNotesTo(selectedNote.id);
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToast(`Terjadi kesalahan: ${message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnshareNote = async (sharedNoteId: string) => {
    if (confirm("Apakah Anda yakin ingin membatalkan pembagian ini?")) {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/notes/share/${sharedNoteId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken || ""}`, // Jika ada autentikasi token
          },
        });
        const text = await res.text(); // Ambil respons mentah terlebih dahulu
        console.log("Raw response text:", text);
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          showToast("Respon dari server tidak valid", "error");
          return;
        }
        if (!res.ok) {
          showToast(data.error || "Gagal membatalkan pembagian", "error");
          return;
        }
        showToast("Pembagian berhasil dibatalkan!", "success");
        if (selectedNote) {
          fetchSharedNotesTo(selectedNote.id); // Perbarui data di modal
        }
        fetchSharedNotesToMe();
      } catch (error: unknown) {
        const message = extractErrorMessage(error);
        console.error("Error unsharing note:", message);
        showToast(`Terjadi kesalahan: ${message}`, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const userOptions: SelectOption[] = users
    .filter(
      (user) =>
        !sharedNotesTo.some(
          (sn) => sn.note_id === selectedNote?.id && sn.shared_to_id === user.id
        )
    )
    .map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    }));

  const selectedOptions: SelectOption[] = selectedUsers
    .map((userId) => users.find((user) => user.id === userId))
    .filter((user): user is User => user !== undefined)
    .map((user) => ({ value: user.id, label: `${user.name} (${user.email})` }));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    } else if (status === "authenticated") {
      fetchNotes();
      fetchSharedNotesToMe();
      fetchUsers();
    }
  }, [status, router, fetchNotes, fetchSharedNotesToMe, fetchUsers]);

  useEffect(() => {
    if (isShareModalOpen && selectedNote) {
      fetchSharedNotesTo(selectedNote.id); // Fetch data saat modal dibuka
    }
  }, [isShareModalOpen, selectedNote, fetchSharedNotesTo]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          Create Notes
        </button>
      </div>

      {/* Info Cards */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Notes</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {notes.length === 0 ? (
          <p className="text-gray-500">Belum ada catatan.</p>
        ) : (
          notes.map((note) => (
            <InfoCard
              key={note.id}
              title={note.title}
              value={note.content}
              subtitle={`Status: ${note.is_public ? "Public" : "Private"}`}
              actions={
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedNote(note);
                      setTitle(note.title);
                      setContent(note.content);
                      setIsPublic(note.is_public);
                      setIsEditModalOpen(true);
                    }}
                    className="btn-erp-warning"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="btn-erp-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNote(note);
                      setSelectedUsers([]);
                      setIsShareModalOpen(true);
                    }}
                    className="btn-erp-primary"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              }
            />
          ))
        )}
      </section>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shared to Me</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {sharedNotesToMe.length === 0 ? (
          <p className="text-gray-500">Belum ada Catatan yang dibagikan.</p>
        ) : (
          sharedNotesToMe.map((sharedNote) => (
            <InfoCard
              key={sharedNote.note_id}
              title={sharedNote.title}
              value={sharedNote.content}
              subtitle={`Dibagikan oleh: ${sharedNote.shared_by_name}
              `}
            />
          ))
        )}
      </section>

      <Modal
        title="Create New Note"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTitle("");
          setContent("");
        }}
      >
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Judul
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              type="text"
              placeholder="Masukkan judul..."
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Konten
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Masukkan konten..."
              rows={4}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublic"
              className="ml-2 block text-sm text-gray-700"
            >
              Buat sebagai Publik
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Membuat..." : "Buat"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setTitle("");
                setContent("");
              }}
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Edit Note"
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTitle("");
          setContent("");
          setIsPublic(false);
          setSelectedNote(null);
        }}
      >
        <form onSubmit={handleUpdateNote} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700"
            >
              Judul
            </label>
            <input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              type="text"
              placeholder="Masukkan judul..."
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-content"
              className="block text-sm font-medium text-gray-700"
            >
              Konten
            </label>
            <textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Masukkan konten..."
              rows={4}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              id="edit-isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="edit-isPublic"
              className="ml-2 block text-sm text-gray-700"
            >
              Buat sebagai Publik
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Memperbarui..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setTitle("");
                setContent("");
                setIsPublic(false);
                setSelectedNote(null);
              }}
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Share Note"
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setSelectedUsers([]);
          setSelectedNote(null);
        }}
      >
        <form onSubmit={handleShareNote} className="space-y-4">
          <div>
            <label
              htmlFor="share-users"
              className="block text-sm font-medium text-gray-700"
            >
              Pilih Pengguna untuk Dibagikan
            </label>
            <Select
              id="share-users"
              isMulti
              options={userOptions}
              value={selectedOptions}
              onChange={(selected) => {
                setSelectedUsers(selected.map((option) => option.value));
              }}
              className="mt-1 block w-full"
              classNamePrefix="select"
              placeholder="Pilih pengguna..."
              isDisabled={isLoading}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Sudah Dibagikan Kepada:
            </p>
            {sharedNotesTo.length > 0 ? (
              sharedNotesTo.map((sn) => (
                <div
                  key={sn.shared_note_id}
                  className="flex items-center gap-2 mt-2"
                >
                  <button
                    type="button"
                    onClick={() => handleUnshareNote(sn.shared_note_id)}
                    className="btn-erp-danger"
                  >
                    <X size={16} />
                  </button>
                  <span>
                    {sn.shared_to_name} ({sn.shared_to_email})
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Belum ada pengguna yang menerima.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || selectedUsers.length === 0}
              className={`w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition ${
                isLoading || selectedUsers.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "Membagikan..." : "Bagikan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsShareModalOpen(false);
                setSelectedUsers([]);
                setSelectedNote(null);
              }}
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default NotesClient;
