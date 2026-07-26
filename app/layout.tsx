import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Google_Sans_Flex } from "next/font/google";
import { LenisProvider } from "@/contexts/LenisContext";
import "./globals.css";
// import { cn } from "@/lib/utils";

const googlesansflex = Google_Sans_Flex({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "FreeLynk",
  description:
    "A simple freelancing web application developed as a mini project to connect freelancers and employers for project-based work. The platform demonstrates the core workflow of freelance marketplaces like Upwork, focusing on clean UI, interactivity, and smooth user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googlesansflex.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
