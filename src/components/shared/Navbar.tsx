"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const formatted = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    setFormattedDate(formatted);
  }, []);

  return (
    <header className="w-full bg-[#f8faf8] border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="w-11 h-11 rounded-xl bg-[#05893e] flex items-center justify-center p-2 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
                width={28}
                height={28}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-tight">
                বাজার দর
              </span>
              <span className="text-xs sm:text-[13px] text-gray-500 font-medium min-h-[18px]">
                {formattedDate}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/signin"
              className="text-sm sm:text-base font-semibold text-gray-800 hover:text-[#05893e] px-3 sm:px-4 py-2 transition-colors duration-150"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center text-sm sm:text-base font-semibold text-white bg-[#05893e] hover:bg-[#047234] px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
