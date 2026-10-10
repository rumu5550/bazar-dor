"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const msg = "সোশ্যাল লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
      setError(msg);
      toast.error(msg);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      const msg = "দয়া করে ইমেইল ও পাসওয়ার্ড পূরণ করুন";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 8) {
      const msg = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        const msg = res.error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে";
        setError(msg);
        toast.error(msg);
      } else {
        toast.success("সফলভাবে লগইন হয়েছে!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      const msg = "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("just_logged_in", "google");
      }
      toast.info("Google-এ রিডাইরেক্ট করা হচ্ছে...");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("just_logged_in");
      }
      const msg = "Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে।";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("just_logged_in", "github");
      }
      toast.info("GitHub-এ রিডাইরেক্ট করা হচ্ছে...");
      await authClient.signIn.social({
        provider: "github",
        callbackURL: callbackUrl,
      });
    } catch {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("just_logged_in");
      }
      const msg = "GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে।";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
          সাইন ইন
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-medium">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="w-full max-w-[460px] bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs sm:text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">ইমেইল</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#05893e] text-sm text-gray-800 placeholder:text-gray-400 bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">পাসওয়ার্ড</label>
            <Input
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#05893e] text-sm text-gray-800 placeholder:text-gray-400 bg-white transition-colors"
            />
          </div>

          <Button
            type="submit"
            isDisabled={loading}
            className="w-full h-12 mt-1 bg-[#05893e] hover:bg-[#047234] text-white font-bold text-base rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center"
          >
            {loading ? "লোড হচ্ছে..." : "সাইন ইন"}
          </Button>
        </form>

        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-500 font-medium">অথবা</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 h-11 px-3 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 rounded-xl text-xs sm:text-[13px] font-semibold text-gray-800 transition-colors shadow-none cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            type="button"
            onClick={handleGitHubSignIn}
            className="flex items-center justify-center gap-2 h-11 px-3 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 rounded-xl text-xs sm:text-[13px] font-semibold text-gray-800 transition-colors shadow-none cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2Z"
              />
            </svg>
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-700 font-medium mt-6">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="text-[#05893e] hover:underline font-bold"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0f5f0]" />}>
      <SignInForm />
    </Suspense>
  );
}
