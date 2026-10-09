"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroBanner() {
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

  const handleScrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("সব-পণ্য");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", "#সব-পণ্য");
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#eef3ee] px-6 sm:px-10 md:px-12 lg:px-14 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 max-w-2xl text-left">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#ebf7ee] text-[#05893e] text-xs sm:text-sm font-semibold mb-4 sm:mb-5">
            {formattedDate}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4 sm:mb-5">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-500 font-normal leading-relaxed mb-6 sm:mb-8">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            onClick={handleScrollToProducts}
            className="inline-flex items-center justify-center px-6 sm:px-7 py-3 rounded-xl bg-[#05893e] hover:bg-[#047234] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
          <div className="relative w-64 sm:w-72 md:w-80 lg:w-96 aspect-square max-w-full">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর হিরো ব্যানার"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
