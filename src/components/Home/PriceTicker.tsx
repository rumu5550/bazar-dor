"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Product } from "@/types";
import { toBengaliNumber, formatUnitBn } from "@/utils/format";

export default function PriceTicker() {
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

  if (loading || products.length === 0) {
    return (
      <div className="w-full bg-white border-b border-gray-100 py-3 text-center text-xs text-gray-400">
        দরদাম লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-b border-gray-100 py-2 sm:py-2.5 select-none overflow-x-hidden overflow-y-hidden">
      <Marquee
        speed={100}
        pauseOnHover={true}
        gradient={false}
        autoFill={true}
        className="flex items-center overflow-y-hidden overflow-x-hidden"
      >
        {products.map((product, idx) => {
          const isUp = product.change?.dir === "up";
          const isDown = product.change?.dir === "down";
          const pct = Math.abs(product.change?.pct ?? 0);
          const pctFormatted = toBengaliNumber(pct.toFixed(1));
          const priceFormatted = toBengaliNumber(product.today);
          const unitFormatted = formatUnitBn(product.unit);

          return (
            <div
              key={`${product.id}-${idx}`}
              className="flex items-center gap-2 px-4 sm:px-6 border-r border-gray-100 whitespace-nowrap text-xs sm:text-sm font-medium shrink-0 leading-normal"
            >
              <span className="text-base sm:text-lg select-none leading-none">
                {product.image || product.categoryIcon || "🛒"}
              </span>
              <span className="text-gray-800">{product.nameBn}</span>
              <span className="text-gray-900 font-semibold">
                {priceFormatted} টাকা/{unitFormatted}
              </span>
              {isUp && (
                <span className="inline-flex items-center gap-0.5 text-[#d9383a] font-semibold leading-none">
                  <span>▲</span>
                  <span>{pctFormatted}%</span>
                </span>
              )}
              {isDown && (
                <span className="inline-flex items-center gap-0.5 text-[#05893e] font-semibold leading-none">
                  <span>▼</span>
                  <span>{pctFormatted}%</span>
                </span>
              )}
              {!isUp && !isDown && (
                <span className="inline-flex items-center gap-0.5 text-gray-400 font-medium leading-none">
                  <span>—</span>
                  <span>০%</span>
                </span>
              )}
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
