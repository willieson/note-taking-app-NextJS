"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useToast } from "../components/ToastProvider";
import { useRouter } from "next/navigation";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.message || "Login failed", "error");
      } else {
        showToast("Login successful!", "success");

        await new Promise((resolve) => setTimeout(resolve, 1000)); // tunggu toast hilang
        router.push("/dashboard");
      }
    } catch (err) {
      showToast("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-box)] text-[var(--background)] flex p-4 justify-center">
      <div className="container max-w-100">
        <div className="row">
          <div className="columns-1">
            <h2 className="text-3xl font-bold">Log In</h2>
          </div>
          <div className="columns-1">
            <p>
              Don't have an account?{" "}
              <Link
                href="/Register"
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="columns-1 mt-4">
            <p className="text-blue-600">Mail</p>
            <input
              className="px-2 border-2 border-solid border-blue-600 rounded-full w-full h-10"
              type="email"
              placeholder="mail@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="columns-1 mt-4">
            <p className="text-blue-600">Password</p>
            <div className="relative w-full">
              <input
                className="px-3 pr-10 border-2 border-solid border-blue-600 rounded-full w-full h-10 bg-blue-100"
                type={show ? "text" : "password"}
                placeholder="●●●●●●●●●●"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                  margin: 0,
                }}
                tabIndex={-1}
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="columns-1 mt-4">
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-full disabled:opacity-50"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
