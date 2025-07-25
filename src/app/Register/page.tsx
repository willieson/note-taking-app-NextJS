"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useToast } from "../components/ToastProvider";
import { useRouter } from "next/navigation";

export default function Register() {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const router = useRouter();

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (confirmPassword) {
      validateConfirmPassword();
    }
  }, [password, confirmPassword]);

  const validateName = () => {
    setNameError(name.trim() === "" ? "Name is required" : "");
  };

  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("Email is required");
    } else if (!isEmailValid(email)) {
      setEmailError("Email format is invalid");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    setPasswordError(password.trim() === "" ? "Password is required" : "");
  };

  const validateConfirmPassword = () => {
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Please confirm your password");
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

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

  const handleSubmit = async () => {
    validateName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Registration successful!", "success");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAgree(false);
        // Tunggu 4 detik (durasi toast), baru redirect
        await new Promise((resolve) => setTimeout(resolve, 4000));
        router.push("/Login");
      } else {
        showToast(data.message || "Registration failed.", "error");
      }
    } catch (err) {
      showToast("Server error occurred.", "error");
    } finally {
      setLoading(false);
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
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
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
                type="button"
                onClick={() => setShowConfPass((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
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

          {/* Submit Button */}
          <div className="columns-1 mt-4">
            <button
              disabled={!isFormValid || loading}
              onClick={handleSubmit}
              className={`w-full rounded-full h-10 ${
                isFormValid && !loading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
