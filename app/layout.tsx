import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skillora | Portfolio Module",
  description: "AI-powered Career Intelligence Platform & Developer Portfolio Studio for Students and Professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen antialiased selection:bg-blue-100 selection:text-blue-700">
        {children}
      </body>
    </html>
  );
};
