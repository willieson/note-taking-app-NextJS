"use client";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
}

export default function Toast({ message, type }: ToastProps) {
  const background = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-yellow-500",
  }[type];

  return (
    <div
      className={`text-white px-4 py-2 rounded shadow-md transition-opacity ${background}`}
    >
      {message}
    </div>
  );
}
