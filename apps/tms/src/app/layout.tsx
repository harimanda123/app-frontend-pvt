import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qubere TMS",
  description: "Transportation Management System skeleton -- shared auth and DB connection scaffold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
