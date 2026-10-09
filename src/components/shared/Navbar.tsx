"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Category } from "@/types";

function CategoryNavList({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <nav className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-2.5 sm:py-3 no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              isActive
                ? "bg-[#05893e] text-white shadow-sm font-semibold"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-200/90"
            }`}
          >
            <span className="text-sm sm:text-base leading-none">{cat.icon}</span>
            <span>{cat.nameBn}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function Navbar() {
  const [formattedDate, setFormattedDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const formatted = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    setFormattedDate(formatted);

    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data: Category[]) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f8faf8] border-b border-gray-100 select-none backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#05893e] flex items-center justify-center p-2 shadow-sm transition-transform duration-200 group-hover:scale-105">
              {/* <Image
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
                width={28}
                height={28}
                className="object-contain w-full h-full"
                priority
              /> */}
              🛒
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-tight">
                বাজার দর
              </span>
              <span className="text-xs sm:text-[13px] text-gray-500 font-black min-h-[18px]">
                {formattedDate}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/signin"
              className="text-sm sm:text-base font-semibold text-gray-800 hover:bg-gray-200/90 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors duration-150"
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

      {categories.length > 0 && (
        <div className="border-t border-gray-100/80 bg-[#fbfdfb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense
              fallback={
                <nav className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-2.5 sm:py-3 no-scrollbar">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.nameBn}</span>
                    </span>
                  ))}
                </nav>
              }
            >
              <CategoryNavList categories={categories} />
            </Suspense>
          </div>
        </div>
      )}
    </header>
  );
}
