import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Management Dashboard",
  description: "Manage students: view, search, filter, add, edit and delete.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <header className="glass sticky top-0 z-50 border-b-0 border-white/20">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M12 8L6 20H18L12 8Z" fill="currentColor" />
                </svg>
                Student Management
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium text-foreground/80">
                <Link href="/" className="hover:text-primary transition-colors">
                  Students
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
