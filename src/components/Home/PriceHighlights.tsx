"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { toBengaliNumber, formatUnitBn } from "@/utils/format";

export default function PriceHighlights() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/products")
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
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="h-48 rounded-2xl bg-white/60 animate-pulse" />
      </section>
    );
  }

  const priceUpProducts = products
    .filter((p) => p.change?.dir === "up" && p.change?.pct > 0)
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const priceDownProducts = products
    .filter((p) => p.change?.dir === "down" && p.change?.pct < 0)
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  const renderProductCard = (product: Product, isUp: boolean) => {
    const pct = Math.abs(product.change?.pct ?? 0);
    const pctFormatted = toBengaliNumber(pct.toFixed(1));
    const priceFormatted = toBengaliNumber(product.today.toLocaleString("en-US"));
    const unitFormatted = formatUnitBn(product.unit);

    return (
      <div
        key={product.id}
        className="bg-white rounded-2xl p-4 sm:p-5 border border-transparent hover:border-[#05893e] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f7f9f7] flex items-center justify-center text-2xl select-none shrink-0">
            {product.image || product.categoryIcon || "🛒"}
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">
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
                : "bg-[#ebf7ee] text-[#05893e]"
            }`}
          >
            <span>{isUp ? "▲" : "▼"}</span>
            <span>{pctFormatted}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-10">
      {priceUpProducts.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#d9383a]">▲</span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              আজ দাম বেড়েছে
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {priceUpProducts.map((p) => renderProductCard(p, true))}
          </div>
        </div>
      )}

      {priceDownProducts.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#05893e]">▼</span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              আজ দাম কমেছে
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {priceDownProducts.map((p) => renderProductCard(p, false))}
          </div>
        </div>
      )}
    </section>
  );
}
