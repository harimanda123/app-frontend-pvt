import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qubere TMS — AI Freight Execution Engine",
  description: "Autonomous end-to-end freight execution, rate shopping, tendering, tracking, and 3-way invoice matching.",
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Y29udGVudC1ibHVlZ2lsbC02OC5jbGVyay5hY2NvdW50cy5kZXYk";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <body className="min-h-screen bg-surface-muted text-ink selection:bg-brand/20 selection:text-brand antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
