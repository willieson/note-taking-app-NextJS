"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useToast } from "../components/ToastProvider";

// Definisi tipe untuk useToast
interface ToastContextType {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast() as ToastContextType;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validasi email sederhana
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      showToast("Masukkan alamat email yang valid.", "error");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          showToast("Email atau kata sandi salah.", "error");
        } else {
          showToast(`Gagal masuk: ${result.error}`, "error");
        }
      } else if (result?.ok) {
        showToast("Berhasil masuk!", "success");
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan tak terduga.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-[var(--color-box)] text-[var(--background)] flex p-4 justify-center">
        <div className="container max-w-100">
          <div className="row">
            <div className="columns-1">
              <h2 className="text-3xl font-bold">Log In</h2>
            </div>
            <div className="columns-1">
              <p>
                {" Don't have an account? "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="columns-1 mt-4">
                <p className="text-blue-600">Mail</p>
                <input
                  className="px-2 border-2 border-solid border-blue-600 rounded-full w-full h-10"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="mail@mail.com"
                />
              </div>
              <div className="columns-1 mt-4">
                <p className="text-blue-600">Password</p>

                <div className="relative w-full">
                  <input
                    className="px-3 pr-10 border-2 border-solid border-blue-600 rounded-full w-full h-10 bg-blue-100"
                    type={show ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="●●●●●●●●●●"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((prev) => !prev)}
                    style={{
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                      padding: 0,
                      margin: 0,
                      color: "#2563eb",
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                    tabIndex={-1}
                  >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="columns-1 mt-4">
                <button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Memproses..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
