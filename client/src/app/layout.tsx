import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Providers } from "./providers";
import { GraduationCapIcon, UsersIcon } from "@/components/ui/icons";
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
          <header className="glass sticky top-0 z-50">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_4px_14px_0_rgba(255,45,95,0.39)]">
                  <GraduationCapIcon className="h-5 w-5" />
                </span>
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Student Management
                  <span className="ml-2 hidden rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-foreground/50 sm:inline">
                    Admin
                  </span>
                </span>
              </Link>
              <nav aria-label="Main" className="flex items-center gap-1">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-white/10"
                >
                  <UsersIcon className="h-4 w-4" />
                  Students
                </Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className="mt-auto border-t border-white/5 py-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-foreground/45 sm:flex-row">
              <p>&copy; {new Date().getFullYear()} Student Management Dashboard</p>
              <p>Built with Next.js, Redux Toolkit &amp; Tailwind CSS</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
