import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর - নিত্যপণ্যের সঠিক দাম জানুন",
  description: "বাজার দর - প্রতিদিনের কাঁচাবাজার ও নিত্যপণ্যের হালনাগাদ দরদাম",
};

import Navbar from "@/components/shared/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#fbfcfb] text-[#1a1a1a]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
