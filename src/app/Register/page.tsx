"use client";
import { useState, useEffect, useCallback, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../components/ToastProvider";
import { extractErrorMessage } from "@/helper/error";

interface ToastContextType {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfPass, setShowConfPass] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Error states
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const router = useRouter();
  const { showToast } = useToast() as ToastContextType;

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateName = () => {
    if (name.trim() === "") {
      setNameError("Nama diperlukan");
    } else {
      setNameError("");
    }
  };

  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("Email diperlukan");
    } else if (!isEmailValid(email)) {
      setEmailError("Format email tidak valid");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (password.trim() === "") {
      setPasswordError("Kata sandi diperlukan");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = useCallback(() => {
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Konfirmasi kata sandi diperlukan");
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Kata sandi tidak cocok");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (confirmPassword) {
      validateConfirmPassword();
    }
  }, [password, confirmPassword, validateConfirmPassword]);

  const isFormValid =
    nameError === "" &&
    emailError === "" &&
    passwordError === "" &&
    confirmPasswordError === "" &&
    name.trim() !== "" &&
    email.trim() !== "" &&
    password !== "" &&
    confirmPassword !== "" &&
    agree;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Gagal melakukan registrasi", "error");
        setIsLoading(false);
        return;
      }

      showToast("Registrasi berhasil! Silakan masuk.", "success");
      router.push("/Login");
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      console.error("Error during registration:", message);
      showToast(`Terjadi kesalahan: ${message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-box)] text-[var(--background)] flex p-4 justify-center">
      <div className="container max-w-100">
        <div className="row">
          <div className="columns-1">
            <h2 className="text-3xl font-bold">Register</h2>
          </div>
          <div className="columns-1">
            <p>
              Already have an account?{" "}
              <Link
                href="/Login"
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="columns-1 mt-4">
              <p className="text-blue-600">Name</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName}
                className={`px-2 border-2 rounded-full w-full h-10 ${
                  nameError ? "border-red-500" : "border-blue-600"
                }`}
                type="text"
                placeholder="Full Name..."
              />
              {nameError && (
                <p className="text-sm text-red-500 mt-1">{nameError}</p>
              )}
            </div>

            {/* Email */}
            <div className="columns-1 mt-4">
              <p className="text-blue-600">Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                className={`px-2 border-2 rounded-full w-full h-10 ${
                  emailError ? "border-red-500" : "border-blue-600"
                }`}
                type="email"
                placeholder="mail@mail.com"
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="columns-1 mt-4">
              <p className="text-blue-600">Password</p>
              <div className="relative w-full">
                <input
                  className={`px-3 pr-10 border-2 rounded-full w-full h-10 bg-blue-100 ${
                    passwordError ? "border-red-500" : "border-blue-600"
                  }`}
                  type={showPass ? "text" : "password"}
                  placeholder="●●●●●●●●●●"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                />
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                    margin: 0,
                    color: "#2563eb",
                  }}
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="columns-1 mt-4">
              <p className="text-blue-600">Confirm Password</p>
              <div className="relative w-full">
                <input
                  className={`px-3 pr-10 border-2 rounded-full w-full h-10 bg-blue-100 ${
                    confirmPasswordError ? "border-red-500" : "border-blue-600"
                  }`}
                  type={showConfPass ? "text" : "password"}
                  placeholder="●●●●●●●●●●"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={validateConfirmPassword}
                />
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                    margin: 0,
                    color: "#2563eb",
                  }}
                  type="button"
                  onClick={() => setShowConfPass((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                  tabIndex={-1}
                >
                  {showConfPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-sm text-red-500 mt-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Checkbox */}
            <div className="columns-1 mt-4">
              <div className="relative w-full">
                <input
                  className="scale-125 accent-blue-600"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />{" "}
                <span className="ml-3">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </div>
            </div>

            {/* Button */}
            <div className="columns-1 mt-4">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full rounded-full h-10 ${
                  isFormValid && !isLoading
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                } transition-colors`}
              >
                {isLoading ? "Memproses..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
