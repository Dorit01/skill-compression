import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "./AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skill Compression | Become functional in any skill instantly",
  description: "AI-generated micro-learning to help you master any skill in the shortest time possible.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <AuthProvider>
          <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SkillCompression
              </Link>
              <nav className="flex items-center gap-6">
                {session ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600 transition-colors">
                      Dashboard
                    </Link>
                    <form action="/api/auth/signout" method="POST">
                      <button type="submit" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
                        Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                      Login
                    </Link>
                    <Link href="/register" className="h-9 px-4 rounded-full bg-blue-600 text-white text-sm font-medium inline-flex items-center justify-center hover:bg-blue-700 transition-colors">
                      Get Started
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t bg-white py-8">
            <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
              © {new Date().getFullYear()} SkillCompression AI. All rights reserved.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
