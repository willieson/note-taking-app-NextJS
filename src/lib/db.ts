import { extractErrorMessage } from "@/helper/error";
import { Pool, QueryResult } from "pg";
import { readFileSync } from "fs";
import { resolve } from "path";


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Please check your .env.local file.");
}

// Konfigurasi SSL berdasarkan lingkungan
const sslConfig =
  process.env.NODE_ENV === "production"
    ? {
        ca: readFileSync(resolve(__dirname, "../config/ca.pem")).toString(),
        rejectUnauthorized: true, // Memastikan koneksi aman dengan CA
      }
    : false;

const pool = new Pool({
  connectionString: connectionString,
  ssl: sslConfig,
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

console.log("PostgreSQL Pool initialized successfully.");

// Definisi tipe untuk hasil query
interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
}

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_public: string;
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

interface PublicNotes{
  id: string;
  title: string;
  content: string;
  name: string;
}

interface Comment {
  id: string;
  note_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}


export const db = {
  pool, // Ekspor pool untuk query langsung
  findUserByEmail: async (email: string): Promise<User | null> => {
    console.log("Mencoba mencari email:", email);
    try {
      const query = "SELECT id, email, password, name FROM users WHERE email = $1";
      const result: QueryResult<User> = await pool.query<User>(query, [email]);
      console.log("Hasil query:", result.rows);
      return result.rows[0] || null;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error querying user by email:", message);
      throw new Error(`Database query failed: ${message}`);
    }
  },

  createNote: async (userId: string, title: string, content: string, is_public: string): Promise<Note> => {
    try {
      const query =
        "INSERT INTO notes (user_id, title, content, is_public) VALUES ($1, $2, $3, $4) RETURNING *";
      const result: QueryResult<Note> = await pool.query<Note>(query, [userId, title, content, is_public]);
      return result.rows[0];
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error creating note:", message);
      throw new Error(`Failed to create note: ${message}`);
    }
  },

  getUserNotes: async (userId: string): Promise<Note[]> => {
    try {
      const query = "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC";
      const result: QueryResult<Note> = await pool.query<Note>(query, [userId]);
      return result.rows;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error fetching user notes:", message);
      throw new Error(`Failed to fetch notes: ${message}`);
    }
  },

  updateNote: async (noteId: string, userId: string, title: string, content: string, is_public: string): Promise<Note> => {
    try {
      const query =
        "UPDATE notes SET title = $1, content = $2, is_public = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *";
      const result: QueryResult<Note> = await pool.query<Note>(query, [title, content, is_public, noteId, userId]);
      if (result.rows.length === 0) {
        throw new Error("Note not found or unauthorized");
      }
      return result.rows[0];
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error updating note:", message);
      throw new Error(`Failed to update note: ${message}`);
    }
  },


  deleteNote: async (noteId: string, userId: string): Promise<void> => {
    try {
      const query = "DELETE FROM notes WHERE id = $1 AND user_id = $2";
      const result = await pool.query(query, [noteId, userId]);
      if (result.rowCount === 0) {
        throw new Error("Note not found or unauthorized");
      }
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error deleting note:", message);
      throw new Error(`Failed to delete note: ${message}`);
    }
  },

  shareNote: async (noteId: string, sharedToUserId: string): Promise<SharedNote> => {
    try {
      const query =
        "INSERT INTO note_shares (note_id, shared_to_id) VALUES ($1, $2) RETURNING *";
      const result: QueryResult<SharedNote> = await pool.query<SharedNote>(query, [
        noteId,
        sharedToUserId,
      ]);
      return result.rows[0];
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error sharing note:", message);
      throw new Error(`Failed to share note: ${message}`);
    }
  },

  getSharedNotes: async (userId: string): Promise<SharedNote[]> => {
    try {
      const query = "SELECT * FROM view_shared_notes WHERE shared_to_id = $1 ORDER BY shared_note_id DESC";
      const result: QueryResult<SharedNote> = await pool.query<SharedNote>(query, [userId]);
      return result.rows;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error fetching shared notes:", message);
      throw new Error(`Failed to fetch shared notes: ${message}`);
    }
  },

  getSharedNotesTo: async (userId: string, noteId: string): Promise<SharedNote[]> => {
    try {
      const query = "SELECT * FROM view_shared_notes WHERE shared_by_user_id = $1 AND note_id = $2 ORDER BY shared_note_id DESC";
      const result: QueryResult<SharedNote> = await pool.query<SharedNote>(query, [userId, noteId]);
      return result.rows;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error fetching shared notes to:", message);
      throw new Error(`Failed to fetch shared notes to: ${message}`);
    }
  },



  findUserById: async (userId: string): Promise<User | null> => {
    try {
      const query = "SELECT id, email, name FROM users WHERE id = $1";
      const result: QueryResult<User> = await pool.query<User>(query, [userId]);
      return result.rows[0] || null;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error querying user by id:", message);
      throw new Error(`Database query failed: ${message}`);
    }
  },


  deleteNoteShare: async (sharedNoteId: string): Promise<void> => {
    try {
      const query = "DELETE FROM note_shares WHERE id = $1";
      const result = await pool.query(query, [sharedNoteId]);
      if (result.rowCount === 0) {
        throw new Error("Pembagian tidak ditemukan atau tidak diizinkan");
      }
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error deleting note share:", message);
      throw new Error(`Failed to unshare note: ${message}`);
    }
  },


  getAllUsers: async (excludeUserId?: string): Promise<User[]> => {
    try {
      const query = excludeUserId
        ? "SELECT id, email, name FROM users WHERE id != $1"
        : "SELECT id, email, name FROM users";
      const result: QueryResult<User> = await pool.query<User>(query, excludeUserId ? [excludeUserId] : []);
      return result.rows;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error fetching users:", message);
      throw new Error(`Failed to fetch users: ${message}`);
    }
  },

  getPublicNotes: async (): Promise<PublicNotes[]> => {
    try {
      const query = "SELECT * FROM view_public_notes";
      const result: QueryResult<PublicNotes> = await pool.query<PublicNotes>(query);
      return result.rows;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error fetching public notes:", message);
      throw new Error(`Failed to fetch public notes: ${message}`);
    }
  },


  getNoteById: async (id: string): Promise<PublicNotes> => {
    try {
      const query = "SELECT n.id, n.title, n.content, u.name FROM notes n LEFT JOIN users u ON n.user_id = u.id WHERE n.id = $1";
      console.log("Executing query for note:", query, id);
      const result: QueryResult<PublicNotes> = await pool.query<PublicNotes>(query, [id]);
      return result.rows[0] || null;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error fetching note by ID:", message);
      throw new Error(`Failed to fetch note: ${message}`);
    }
  },

  getCommentsByNoteId: async (noteId: string): Promise<Comment[]> => {
    try {
      const query = "SELECT c.id, c.note_id, c.user_id, c.content, c.created_at, c.updated_at, u.name AS user_name FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.note_id = $1 ORDER BY c.created_at DESC";
      console.log("Executing query for comments:", query, noteId);
      const result: QueryResult<Comment> = await pool.query<Comment>(query, [noteId]);
      return result.rows;
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error fetching comments by note ID:", message);
      throw new Error(`Failed to fetch comments: ${message}`);
    }
  },

  addComment: async (noteId: string, userId: string, content: string): Promise<Comment> => {
    try {
      const query = "INSERT INTO comments (note_id, user_id, content, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *";
      console.log("Executing query to add comment:", query, noteId, userId);
      const result: QueryResult<Comment> = await pool.query<Comment>(query, [noteId, userId, content]);
      return result.rows[0];
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error adding comment:", message);
      throw new Error(`Failed to add comment: ${message}`);
    }
  },
};