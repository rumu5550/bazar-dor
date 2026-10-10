import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Product } from "@/types";
import { toBengaliNumber, formatUnitBn } from "@/utils/format";
import PriceTicker from "@/components/Home/PriceTicker";

export const instant = false;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params;

  if (!session) {
    redirect(`/signin?callbackUrl=/product/${slug}`);
  }

  let product: Product | null = null;

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const products: Product[] = await res.json();
      product =
        products.find(
          (p) =>
            p.slug === slug ||
            String(p.id) === slug ||
            p.slug.toLowerCase() === slug.toLowerCase()
        ) || null;
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }

  if (!product) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">পণ্যটি খুঁজে পাওয়া যায়নি</h1>
          <p className="text-sm text-gray-500 mb-6">
            অনুরোধকৃত পণ্যের বিস্তারিত তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না।
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#05893e] text-white text-sm font-semibold hover:bg-[#046e32] transition-colors"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const unitBn = formatUnitBn(product.unit);
  const todayPriceBn = toBengaliNumber(product.today.toLocaleString("en-US"));
  const yesterdayPrice = product.yesterday ?? product.today;
  const priceDiff = product.today - yesterdayPrice;
  const absPriceDiff = Math.abs(priceDiff);
  const diffBn = toBengaliNumber(absPriceDiff);

  const isUp = product.change?.dir === "up" || priceDiff > 0;
  const isDown = product.change?.dir === "down" || priceDiff < 0;
  const pct = Math.abs(product.change?.pct ?? 0);
  const pctBn = toBengaliNumber(pct.toFixed(1));

  const markets = product.markets || [];
  const minPrices = markets.map((m) => m.min).filter((n) => typeof n === "number");
  const maxPrices = markets.map((m) => m.max).filter((n) => typeof n === "number");

  const minPrice = minPrices.length > 0 ? Math.min(...minPrices) : product.today;
  const maxPrice = maxPrices.length > 0 ? Math.max(...maxPrices) : product.today;
  const avgPrice = product.today;

  const minPriceBn = toBengaliNumber(minPrice);
  const maxPriceBn = toBengaliNumber(maxPrice);
  const avgPriceBn = toBengaliNumber(avgPrice);

  return (
    <div className="min-h-screen bg-[#f0f5f0] pb-16">
      <PriceTicker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex flex-col gap-6">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            হোম
          </Link>
          <span className="text-gray-400">›</span>
          <Link
            href={`/?category=${product.category}`}
            className="hover:text-gray-900 transition-colors"
          >
            {product.categoryNameBn || "ক্যাটাগরি"}
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-semibold">{product.nameBn}</span>
        </nav>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f5f8f5] flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0 select-none">
              {product.image || product.categoryIcon || "🍚"}
            </div>
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {product.nameBn}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
                <span>প্রতি {unitBn}</span>
                <span>•</span>
                <span>{product.categoryNameBn}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                গতকালের তুলনায় আজ দাম{" "}
                <span className="font-bold text-gray-900">
                  {priceDiff > 0 ? "বেড়েছে" : priceDiff < 0 ? "কমেছে" : "অপরিবর্তিত"}
                </span>
                {priceDiff !== 0 && ` - ${diffBn} টাকা`}
              </p>
            </div>
          </div>

          <div className="self-end sm:self-center bg-[#f8faf8] border border-gray-100 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[150px] shadow-sm">
            <span className="text-xs font-semibold text-gray-500 mb-1">আজকের দাম</span>
            <span className="text-3xl sm:text-4xl font-black text-gray-900 leading-none">
              {todayPriceBn}
            </span>
            <span className="text-xs text-gray-500 font-medium mt-1">
              টাকা / {unitBn}
            </span>
            <div
              className={`inline-flex items-center gap-1 text-xs font-bold mt-2 ${
                isUp
                  ? "text-[#d9383a]"
                  : isDown
                  ? "text-[#05893e]"
                  : "text-gray-500"
              }`}
            >
              <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
              <span>{pctBn}%</span>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-[#fcfdfc] rounded-2xl p-5 sm:p-6 border border-gray-100 flex flex-col justify-between">
                <span className="text-xs sm:text-sm font-semibold text-gray-500">সর্বনিম্ন দাম</span>
                <div className="my-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#05893e]">
                    {minPriceBn}
                  </span>{" "}
                  <span className="text-sm font-bold text-gray-700">টাকা</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">সবচেয়ে কম দামের বাজার</span>
              </div>

              <div className="bg-[#fcfdfc] rounded-2xl p-5 sm:p-6 border border-gray-100 flex flex-col justify-between">
                <span className="text-xs sm:text-sm font-semibold text-gray-500">সর্বাধিক দাম</span>
                <div className="my-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#d9383a]">
                    {maxPriceBn}
                  </span>{" "}
                  <span className="text-sm font-bold text-gray-700">টাকা</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">সবচেয়ে বেশি দামের বাজার</span>
              </div>

              <div className="bg-[#fcfdfc] rounded-2xl p-5 sm:p-6 border border-gray-100 flex flex-col justify-between">
                <span className="text-xs sm:text-sm font-semibold text-gray-500">গড় দাম</span>
                <div className="my-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#05893e]">
                    {avgPriceBn}
                  </span>{" "}
                  <span className="text-sm font-bold text-gray-700">টাকা</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">প্রতি {unitBn}-এর হিসাবে</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>

            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#fafbfa] text-xs sm:text-sm font-bold text-gray-500">
                      <th className="py-3.5 px-5 sm:px-6">বাজার</th>
                      <th className="py-3.5 px-5 sm:px-6">বিভাগ</th>
                      <th className="py-3.5 px-5 sm:px-6">সর্বনিম্ন</th>
                      <th className="py-3.5 px-5 sm:px-6">সর্বাধিক</th>
                      <th className="py-3.5 px-5 sm:px-6 text-right">গড়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {markets.map((m, idx) => {
                      const avg = (m.min + m.max) / 2;
                      const avgFormatted = Number.isInteger(avg)
                        ? toBengaliNumber(avg)
                        : toBengaliNumber(avg.toFixed(2));

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50/60 transition-colors text-gray-800"
                        >
                          <td className="py-3.5 px-5 sm:px-6 font-semibold text-gray-900">
                            {m.market}
                          </td>
                          <td className="py-3.5 px-5 sm:px-6 text-gray-600">{m.division}</td>
                          <td className="py-3.5 px-5 sm:px-6  text-gray-800">
                            {toBengaliNumber(m.min)} টাকা
                          </td>
                          <td className="py-3.5 px-5 sm:px-6  text-gray-800">
                            {toBengaliNumber(m.max)} টাকা
                          </td>
                          <td className="py-3.5 px-5 sm:px-6 text-right font-bold text-gray-900">
                            {avgFormatted} টাকা
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
