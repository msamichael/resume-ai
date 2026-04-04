import type { Metadata } from "next";
import { Geist, Geist_Mono, Imperial_Script } from "next/font/google";
import LocalFont from "next/font/local";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const imperialScript = Imperial_Script({
  variable: "--font-imperial-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const aeonik = LocalFont({
  src: [{ path: "./fonts/Aeonik-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-aeonik",
  display: "swap",
});

export const newsreader = LocalFont({
  src: [{ path: "./fonts/Newsreader-italic.ttf", weight: "400", style: "italic" }],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resume AI",
  description: "Optimize your resume for any job application with AI-powered analysis and personalized suggestions.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${aeonik.variable} ${imperialScript.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <Link href="/" className="ml-[calc(50vw-48vw)] flex items-center  gap-2 text-2xl font-bold cursor-pointer">
          <Image src="/logo-mark.svg" alt="ResumeAI logo" width={26} height={26} priority />
          <span>
            Resume<span className="text-teal-700">AI</span>
          </span>
        </Link >
        {children}
      </body>
    </html>
  );
}
