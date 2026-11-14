import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Serif_Bengali } from "next/font/google";

import { Toaster } from "react-hot-toast";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "./globals.css";

const NotoserifBengali = Noto_Serif_Bengali({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর, দৈনিক মূল্য পরিবর্তন এবং বাজারভিত্তিক দাম এক নজরে দেখুন।",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="bn-BD"
      data-theme="light"
      className={`${NotoserifBengali.className}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <Header />

        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1">
          {children}
        </main>

        <Footer />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
          }}
        />
      </body>
    </html>
  );
}
