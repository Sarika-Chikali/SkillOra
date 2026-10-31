import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AppFooter } from "@/components/AppFooter";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://skillora-app-lemon.vercel.app"),
  title: "SkillOra — your career growth companion",
  description: "Build your resume, portfolio and career profile in one place with SkillOra.",
  applicationName: "SkillOra",
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  openGraph: {
    type: "website",
    siteName: "SkillOra",
    title: "SkillOra — your career growth companion",
    description: "Build your resume, portfolio and career profile in one place with SkillOra.",
  },
  twitter: { card: "summary_large_image", title: "SkillOra", description: "Your career growth companion." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <AppFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
