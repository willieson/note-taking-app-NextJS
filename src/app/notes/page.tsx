"use client";

import { useEffect, useState } from "react";
import LayoutShell from "../components/LayoutShell";
import Modal from "../components/Modal";
import InfoCard from "../components/InfoCard";
import { useToast } from "../components/ToastProvider";
import Select from "react-select";

type Note = {
  id: number;
  title: string;
  content: string;
  is_public: boolean;
  shared_with_me: boolean;
};

type UserOption = {
  value: string;
  label: string;
};

export default function NotesPage() {
  const [availableUsers, setAvailableUsers] = useState<UserOption[]>([]);
  const [alreadySharedUsers, setAlreadySharedUsers] = useState<UserOption[]>(
    []
  );

  const [notes, setNotes] = useState<Note[]>([]);
  const [shared, setShared] = useState<Note[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [sharingNoteId, setSharingNoteId] = useState<number | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resNotes, resShared, resUsers] = await Promise.all([
          fetch("/api/notes/my"),
          fetch("/api/notes/shared"),
          fetch("/api/users"),
        ]);

        if (resNotes.ok) {
          const dataNotes = await resNotes.json();
          setNotes(dataNotes);
        }
        if (resShared.ok) {
          const dataShared = await resShared.json();
          setShared(dataShared);
        }

        if (resUsers.ok) {
          const userOptions = await resUsers.json();
          setAvailableUsers(userOptions);
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
      setIsPublic(note.is_public);
    } else {
      setEditingNote(null);
      setTitle("");
      setContent("");
      setIsPublic(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const endpoint = editingNote ? "/api/notes/edit" : "/api/notes/create";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingNote?.id,
          title,
          content,
          is_public: isPublic,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan catatan");

      const newNote = await res.json();

      if (editingNote) {
        setNotes((prev) =>
          prev.map((note) => (note.id === newNote.id ? newNote : note))
        );
        showToast("Catatan berhasil diupdate", "success");
      } else {
        setNotes((prev) => [newNote, ...prev]);
        showToast("Catatan berhasil ditambahkan", "success");
      }

      setIsModalOpen(false);
    } catch (err) {
      showToast("Gagal menyimpan catatan", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus catatan ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else {
        const errorData = await res.json();
        console.error("Gagal menghapus:", errorData.error);
        alert("Gagal menghapus catatan.");
      }
    } catch (err) {
      console.error("❌ Error saat delete:", err);
      alert("Terjadi kesalahan saat menghapus.");
    }
  };

  const handleShare = async (noteId: number) => {
    setSharingNoteId(noteId);
    setSelectedUsers([]);

    try {
      const res = await fetch(`/api/notes/${noteId}/shared-users`);
      if (res.ok) {
        const data = await res.json();
        const sharedOptions = data.map(
          (user: { email: string; name: string }) => ({
            value: user.email,
            label: user.name,
          })
        );
        setAlreadySharedUsers(sharedOptions);
      } else {
        setAlreadySharedUsers([]);
      }
    } catch (err) {
      console.error("Gagal fetch shared users:", err);
      setAlreadySharedUsers([]);
    }

    setIsShareModalOpen(true);
  };

  const handleSubmitShare = async () => {
    if (!sharingNoteId || selectedUsers.length === 0) return;

    const emails = selectedUsers.map((user) => user.value);

    try {
      const res = await fetch(`/api/notes/${sharingNoteId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      });

      if (res.ok) {
        showToast("Note shared successfully", "success");
        setIsShareModalOpen(false);
        setSelectedUsers([]);
      } else {
        showToast("Gagal membagikan note", "error");
      }
    } catch (err) {
      console.error("Error sharing note:", err);
      showToast("Error sharing note", "error");
    }
  };

  const handleUnshareUser = async (email: string) => {
    if (!sharingNoteId) return;

    try {
      const res = await fetch(`/api/notes/${sharingNoteId}/unshare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setAlreadySharedUsers((prev) =>
          prev.filter((user) => user.value !== email)
        );
        showToast("Berhasil membatalkan share", "success");
      } else {
        const err = await res.json();
        showToast(err.error || "Gagal membatalkan share", "error");
      }
    } catch (err) {
      console.error("❌ Gagal unshare:", err);
      showToast("Gagal membatalkan share", "error");
    }
  };

  return (
    <LayoutShell>
      <div className="p-4">
        <button
          onClick={() => handleOpenModal()}
          className="btn-erp-primary hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition"
        >
          Create Notes
        </button>

        {/* Modal Form */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingNote ? "Edit Note" : "Create Note"}
        >
          <div className="space-y-4 mt-4">
            <input
              className="px-2 border-2 border-blue-600 rounded-full w-full h-10"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="px-2 border-2 border-blue-600 w-full h-24"
              placeholder="Notes"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span>Public?</span>
            </label>
            <div className="text-right space-x-2">
              <button
                className="btn-erp-secondary hover:bg-gray-300 text-sm px-3 py-1 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="btn-erp-primary hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title="Share Note"
        >
          <div className="space-y-4 mt-4">
            <Select
              isMulti
              options={availableUsers}
              value={selectedUsers}
              onChange={(selected) =>
                setSelectedUsers(selected as UserOption[])
              }
              placeholder="Pilih user untuk share..."
              className="w-full"
              classNamePrefix="react-select"
            />
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">
                Already shared with:
              </h3>
              {alreadySharedUsers.length === 0 ? (
                <p className="text-sm text-gray-500">No users yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {alreadySharedUsers.map((user) => (
                    <div
                      key={user.value}
                      className="flex flex-col items-center bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded"
                    >
                      <button
                        onClick={() => handleUnshareUser(user.value)}
                        className="ml-2 btn-erp-danger text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                      <span>{user.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right space-x-2">
              <button
                className="btn-erp-secondary text-sm px-3 py-1 rounded-lg"
                onClick={() => setIsShareModalOpen(false)}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitShare}
                className="btn-erp-primary text-sm px-4 py-2 rounded-lg"
              >
                Share
              </button>
            </div>
          </div>
        </Modal>

        {/* My Notes */}
        <h2 className="text-xl font-bold mt-6 mb-2">My Notes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {notes.map((note) => (
            <InfoCard
              key={note.id}
              title={note.title}
              value={note.content}
              subtitle={note.is_public ? "Public" : "Private"}
              showActions
              onEdit={() => handleOpenModal(note)}
              onDelete={() => handleDelete(note.id)}
              onShare={() => handleShare(note.id)}
            />
          ))}
        </div>

        {/* Shared Notes */}
        <h2 className="text-xl font-bold mb-2">Shared with Me</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shared.map((share) => (
            <InfoCard
              key={share.id}
              title={share.title}
              value={share.content}
              subtitle={share.shared_by_name}
              showActions={false}
            />
          ))}
        </div>
      </div>
    </LayoutShell>
  );
}
