"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { toBengaliNumber, formatUnitBn } from "@/utils/format";

type SortOption = "default" | "price-asc" | "price-desc";

export default function AllProducts() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const url = categoryParam
      ? `https://openapi.programming-hero.com/api/bazardor/products?category=${categoryParam}`
      : "https://openapi.programming-hero.com/api/bazardor/products";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [categoryParam]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.today - b.today;
    if (sortBy === "price-desc") return b.today - a.today;
    return 0;
  });

  const sortLabelMap: Record<SortOption, string> = {
    default: "ডিফল্ট",
    "price-asc": "দাম: কম থেকে বেশি",
    "price-desc": "দাম: বেশি থেকে কম",
  };

  const renderProductCard = (product: Product) => {
    const isUp = product.change?.dir === "up";
    const isDown = product.change?.dir === "down";
    const pct = Math.abs(product.change?.pct ?? 0);
    const pctFormatted = toBengaliNumber(pct.toFixed(1));
    const priceFormatted = toBengaliNumber(product.today.toLocaleString("en-US"));
    const unitFormatted = formatUnitBn(product.unit);

    return (
      <Link
        key={product.id}
        href={`/product/${product.slug}`}
        className="bg-white rounded-2xl p-4 sm:p-5 border border-transparent hover:border-[#05893e] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f7f9f7] flex items-center justify-center text-2xl select-none shrink-0 group-hover:scale-105 transition-transform">
            {product.image || product.categoryIcon || "🛒"}
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate group-hover:text-[#05893e] transition-colors">
              {product.nameBn}
            </h4>
            <span className="text-xs sm:text-[13px] text-gray-500 font-medium">
              প্রতি {unitFormatted}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs text-gray-600 font-bold mb-0.5">
              আজকের দাম
            </span>
            <span className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
              {priceFormatted} টাকা
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
              isUp
                ? "bg-[#fff1f1] text-[#d9383a]"
                : isDown
                ? "bg-[#ebf7ee] text-[#05893e]"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
            <span>{pctFormatted}%</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section id="সব-পণ্য" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 scroll-mt-28">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          <span className="text-sm font-semibold text-gray-600">সাজান</span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-800 shadow-sm hover:border-gray-300 focus:outline-none"
          >
            <span>{sortLabelMap[sortBy]}</span>
            <span className="text-xs text-gray-500">{isOpen ? "▲" : "▼"}</span>
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30">
              <button
                onClick={() => {
                  setSortBy("default");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  sortBy === "default" ? "font-bold text-[#05893e]" : "text-gray-700"
                }`}
              >
                {sortBy === "default" && <span>✓</span>}
                <span>ডিফল্ট</span>
              </button>

              <button
                onClick={() => {
                  setSortBy("price-asc");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  sortBy === "price-asc" ? "font-bold text-[#05893e]" : "text-gray-700"
                }`}
              >
                {sortBy === "price-asc" && <span>✓</span>}
                <span>দাম: কম থেকে বেশি</span>
              </button>

              <button
                onClick={() => {
                  setSortBy("price-desc");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  sortBy === "price-desc" ? "font-bold text-[#05893e]" : "text-gray-700"
                }`}
              >
                {sortBy === "price-desc" && <span>✓</span>}
                <span>দাম: বেশি থেকে কম</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-white/60 animate-pulse" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
          কোনো পণ্য পাওয়া যায়নি
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sortedProducts.map((p) => renderProductCard(p))}
        </div>
      )}
    </section>
  );
}
