"use client";

import { Suspense, useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { Product, Category } from "@/types";
import { toBengaliNumber, formatUnitBn } from "@/utils/format";
import PriceTicker from "@/components/Home/PriceTicker";

type SortOption = "default" | "price-asc" | "price-desc";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function CategoryContent({ params }: CategoryPageProps) {
  const { slug } = use(params);

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch("https://openapi.programming-hero.com/api/bazardor/categories").then((r) =>
        r.ok ? r.json() : []
      ),
      fetch(
        `https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`
      ).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([cats, prods]: [Category[], Product[]]) => {
        if (Array.isArray(cats)) {
          const matched = cats.find((c) => c.slug === slug || c.id === slug) || null;
          setCategory(matched);
        }
        if (Array.isArray(prods)) {
          setProducts(prods);
        } else {
          setProducts([]);
        }
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

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

  const titleBn = category?.nameBn || products[0]?.categoryNameBn || slug;
  const icon = category?.icon || products[0]?.categoryIcon || "🛒";

  return (
    <div className="min-h-screen bg-[#f0f5f0] pb-16">
      <PriceTicker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col gap-6">
            <div className="w-full h-32 rounded-3xl bg-white border border-gray-100 shadow-sm animate-pulse p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0" />
              <div className="flex flex-col gap-2.5 w-48">
                <div className="h-6 bg-gray-100 rounded-md w-3/4" />
                <div className="h-4 bg-gray-100 rounded-md w-1/2" />
              </div>
            </div>

            <div className="w-full h-14 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse flex items-center justify-between px-6">
              <div className="h-4 bg-gray-100 rounded w-28" />
              <div className="h-8 bg-gray-100 rounded-lg w-24" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-40 animate-pulse flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                    <div className="flex flex-col gap-2 w-32">
                      <div className="h-4 bg-gray-100 rounded" />
                      <div className="h-3 bg-gray-100 rounded w-20" />
                    </div>
                  </div>
                  <div className="h-6 bg-gray-100 rounded w-24" />
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm text-center max-w-md w-full flex flex-col items-center">
              <div className="text-5xl mb-4 select-none">🛒</div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                কোনো পণ্য খুঁজে পাওয়া যায়নি
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                এই ক্যাটাগরিতে এই মুহূর্তে কোনো পণ্য তালিকাভুক্ত নেই।
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#05893e] text-white text-sm font-semibold hover:bg-[#047234] transition-colors shadow-sm"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex items-center gap-5 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f5f8f5] flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0 select-none">
                {icon}
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {titleBn}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {toBengaliNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
              </span>

              <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                <span className="text-xs sm:text-sm font-semibold text-gray-600">সাজান</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center gap-2 bg-[#fcfdfc] px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm hover:border-gray-300 focus:outline-none transition-colors cursor-pointer"
                >
                  <span>{sortLabelMap[sortBy]}</span>
                  <span className="text-xs text-gray-500">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30">
                    {(Object.keys(sortLabelMap) as SortOption[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSortBy(option);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                          sortBy === option
                            ? "bg-[#05893e]/10 text-[#05893e] font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {sortLabelMap[option]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => {
                const isUp = product.change?.dir === "up";
                const isDown = product.change?.dir === "down";
                const pct = Math.abs(product.change?.pct ?? 0);
                const pctFormatted = toBengaliNumber(pct.toFixed(1));
                const priceFormatted = toBengaliNumber(
                  product.today.toLocaleString("en-US")
                );
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
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="min-h-screen bg-[#f0f5f0] pb-16">
      <div className="w-full bg-white border-b border-gray-100 py-3 text-center text-xs text-gray-400">
        দরদাম লোড হচ্ছে...
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex flex-col gap-6">
        <div className="w-full h-32 rounded-3xl bg-white border border-gray-100 shadow-sm animate-pulse p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0" />
          <div className="flex flex-col gap-2.5 w-48">
            <div className="h-6 bg-gray-100 rounded-md w-3/4" />
            <div className="h-4 bg-gray-100 rounded-md w-1/2" />
          </div>
        </div>
        <div className="w-full h-14 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse flex items-center justify-between px-6">
          <div className="h-4 bg-gray-100 rounded w-28" />
          <div className="h-8 bg-gray-100 rounded-lg w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-40 animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                <div className="flex flex-col gap-2 w-32">
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded w-20" />
                </div>
              </div>
              <div className="h-6 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
