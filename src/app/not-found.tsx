import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 py-16 bg-[#f0f5f0]">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-center max-w-lg w-full flex flex-col items-center">
        <span className="text-6xl sm:text-7xl mb-4 select-none">🛒</span>
        <span className="text-4xl sm:text-5xl font-black text-[#05893e] mb-2 tracking-tight">
          ৪০৪
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
          আপনি যে পাতাটি খুঁজছেন তা হয়তো সরানো হয়েছে বা ঠিকানাটি সঠিক নয়।
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#05893e] hover:bg-[#047234] text-white font-bold text-sm sm:text-base transition-colors shadow-sm"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
