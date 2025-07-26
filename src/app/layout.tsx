import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/app/components/ToastProvider";
import { Inter } from "next/font/google";
import { Providers } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taking Note Apps NextJS - ",
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
        <Providers>
          <ToastProvider>{children} </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
