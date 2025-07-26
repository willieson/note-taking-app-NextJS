// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // Tambahkan ID pengguna
      email: string; // Tambahkan email pengguna
      // ... bisa tambahkan properti lain yang Anda inginkan
    } & DefaultSession['user'];
  }

  /**
   * The user object type returned by the `authorize` callback.
   */
  interface User {
    id: string; // Sesuaikan jika ID di DB bukan string
    email: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string; // Tambahkan ID pengguna
    email: string; // Tambahkan email pengguna
  }
}