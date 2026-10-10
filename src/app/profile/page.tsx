"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin?callbackUrl=/profile");
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে লগআউট হয়েছে");
    router.push("/");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }

    setLoading(true);

    try {
      const res = await authClient.updateUser({
        name: name.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || "তথ্য আপডেট করতে সমস্যা হয়েছে");
      } else {
        toast.success("প্রোফাইলের তথ্য সফলভাবে আপডেট হয়েছে!");
        router.refresh();
      }
    } catch {
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f0f5f0] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="h-14 w-60 bg-white/70 rounded-2xl animate-pulse" />
          <div className="h-32 bg-white rounded-3xl animate-pulse" />
          <div className="h-56 bg-white rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const userImage = user?.image;
  const firstLetter = (user?.name || "ইউজার").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f0f5f0] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 relative flex items-center justify-center shadow-inner">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#05893e] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl select-none">
                  {firstLetter}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-[#d9383a] bg-white hover:bg-red-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer self-start sm:self-center"
          >
            <span>↩</span>
            <span>সাইন আউট</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col gap-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">তথ্য</h3>

          <form onSubmit={handleUpdate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-bold text-gray-700">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#05893e] text-sm text-gray-900 bg-[#fdfefd] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#05893e] hover:bg-[#047234] text-white font-bold text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center shadow-sm disabled:opacity-70"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
