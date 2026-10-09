import { Suspense } from "react";
import HeroBanner from "@/components/Home/HeroBanner";
import PriceHighlights from "@/components/Home/PriceHighlights";
import AllProducts from "@/components/Home/AllProducts";
import PriceTicker from "@/components/Home/PriceTicker";

export default function Home() {
  return (
    <main className="min-h-screen pb-16">
      <PriceTicker />
      <HeroBanner />
      <PriceHighlights />
      <Suspense fallback={<div className="h-40 w-full" />}>
        <AllProducts />
      </Suspense>
    </main>
  );
}
