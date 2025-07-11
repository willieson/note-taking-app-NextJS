"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [show, setShow] = useState(false);

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
                Don't have an account?{" "}
                <Link
                  href="/signup"
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
                type="mail"
                placeholder="mail@mail.com"
              />
            </div>
            <div className="columns-1 mt-4">
              <p className="text-blue-600">Password</p>

              <div className="relative w-full">
                <input
                  className="px-3 pr-10 border-2 border-solid border-blue-600 rounded-full w-full h-10 bg-blue-100"
                  type={show ? "text" : "password"}
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
              <button className="w-full">Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
