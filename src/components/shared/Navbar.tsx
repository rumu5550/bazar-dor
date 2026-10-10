"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Category } from "@/types";
import { authClient } from "@/lib/auth-client";

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
  const { data: session } = authClient.useSession();
  const [formattedDate, setFormattedDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const formatted = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    setFormattedDate(formatted);

    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await authClient.signOut();
  };

  const user = session?.user;
  const displayName = user?.name || "ইউজার";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f8faf8] border-b border-gray-100 select-none backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#05893e] flex items-center justify-center p-2 shadow-sm transition-transform duration-200 group-hover:scale-105 text-xl">
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

          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#05893e] text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {firstLetter}
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-800 hidden sm:inline-block">
                  {displayName}
                </span>
                <span className="text-xs text-gray-500">▼</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-gray-100 p-4 z-50">
                  <div className="pb-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-base">👤</span>
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#d9383a] hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                    >
                      <span className="text-base">↩</span>
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
          )}
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
