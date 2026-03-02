import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rahul Kolli — Portfolio",
  description: "Full Stack Developer specializing in Flutter, Next.js, FastAPI, PostgreSQL, and cloud-native systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased bg-zinc-950 text-zinc-100 min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-28">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
