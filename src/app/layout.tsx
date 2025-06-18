import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/app/components/ToastProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ERP System - ",
  description: "Next.JS ERP by Michael Willieson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <nav></nav>
        <ToastProvider>{children} </ToastProvider>
      </body>
    </html>
  );
}
