import HeroBanner from "@/components/Home/HeroBanner";
import PriceTicker from "@/components/Home/PriceTicker";

export default function Home() {
  return (
    <main className="min-h-screen">
      <PriceTicker />
      <HeroBanner />
    </main>
  );
}
