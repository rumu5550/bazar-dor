# বাজার দর (BazarDor) 🛒

প্রতিদিনের কাঁচাবাজার ও নিত্যপ্রয়োজনীয় পণ্যের বাজারভিত্তিক হালনাগাদ দরদাম জানার একটি আধুনিক ওয়েব প্ল্যাটফর্ম।

---

## 📌 প্রকল্পের পরিচিতি (About the Project)

**বাজার দর (BazarDor)** বাংলাদেশের বিভিন্ন বিভাগ ও প্রধান প্রধান কাঁচাবাজারের নিত্যপণ্যের সঠিক দাম সাধারণ মানুষের কাছে স্বচ্ছভাবে পৌঁছে দেওয়ার জন্য তৈরি করা হয়েছে। ক্রেতারা সহজেই চাল, ডাল, তেল, সবজি, মাছ, মাংসসহ সব নিত্যপ্রয়োজনীয় দ্রব্যের বর্তমান বাজারদর, গতকালের তুলনায় দামের পরিবর্তন এবং বিভিন্ন বাজারের গড়, সর্বনিম্ন ও সর্বোচ্চ মূল্যের বিস্তারিত তুলনামূলক তথ্য দেখতে পারেন।

---

## 🛠️ ব্যবহৃত প্রযুক্তিসমূহ (Technologies Used)

- **Frontend Framework:** Next.js 16 (App Router with Turbopack)
- **Library:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, HeroUI
- **Database & ODM:** MongoDB (Atlas Replica Set), MongoDB Driver
- **Authentication:** Better Auth (Email & Password, Google OAuth, GitHub OAuth)
- **Notifications:** Sonner Toast Notifications
- **Animation & Marquee:** React Fast Marquee, Framer Motion
- **Font:** Google Font (Hind Siliguri)

---

## ✨ প্রধান ৫টি বৈশিষ্ট্য (5 Key Features)

1. **রিয়েল-টাইম লাইভ প্রাইস টিকার ও দামের উত্থান-পতন (Live Price Ticker & Market Highlights):**
   - স্ক্রিনের শীর্ষে চলমান লাইভ মারকুই টিকারে প্রতিটি পণ্যের আজকের দাম এবং শতকরা পরিবর্তন রিয়েল-টাইমে প্রদর্শিত হয়।
   - দাম বাড়া এবং কমার ওপর ভিত্তি করে আলাদা প্রাইজ হাইলাইটস সেকশন।

2. **বাজারভিত্তিক বিস্তারিত তথ্য ও তুলনামূলক বিশ্লেষণ (Protected Product Details & Market Breakdown):**
   - পণ্যের বিস্তারিত পেজে ঢাকা, চট্টগ্রাম, রাজশাহী, সিলেটসহ বিভিন্ন প্রধান বাজারের সর্বনিম্ন, সর্বাধিক ও গড় মূল্যের সুস্পষ্ট টেবিল।
   - রাউট প্রটেকশন সুবিধা—লগইন ছাড়া বিস্তারিত পেজে ঢুকতে গেলে স্বয়ংক্রিয়ভাবে নোটিফিকেশনসহ সাইন-ইন পেজে রিডাইরেক্ট করা হয়।

3. **ক্যাটাগরি ফিল্টারিং ও ডায়নামিক সর্টিং (Category Filtering & Dynamic Sorting):**
   - চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ এবং মসলার জন্য ক্যাটাগরিভিত্তিক আলাদা পেজ।
   - ডিফল্ট, দাম: কম থেকে বেশি এবং দাম: বেশি থেকে কম অনুযায়ী পণ্য দ্রুত সাজানোর সুবিধা।

4. **শক্তিশালী প্রমাণীকরণ ও সোশ্যাল লগইন (Better Auth with Social Providers):**
   - ইমেইল-পাসওয়ার্ড এবং ওয়ান-ক্লিক গুগল ও গিটহাব সোশ্যাল লগইন সুবিধা।
   - স্বয়ংক্রিয় একাউন্ট লিঙ্কিং এবং সাইন ইন, সাইন আপ ও লগআউটে সুন্দর টোস্ট নোটিফিকেশন।

5. **ব্যবহারকারী প্রোফাইল ও তথ্য আপডেট (User Profile & Live Update):**
   - ব্যবহারকারীর ছবি ও তথ্যাবলি দেখার আধুনিক প্রোফাইল পেজ।
   - সরাসরি Better Auth ক্লায়েন্ট ব্যবহার করে নাম আপডেট এবং সাথে সাথে পরিবর্তন দেখার ব্যবস্থা।

---

## 🚀 লোকাল সেটআপ নির্দেশিকা (Getting Started)

### ১. রিপোজিটরি ক্লোন করুন:
```bash
git clone https://github.com/rumu5550/bazar-dor.git
cd bazar-dor
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন:
```bash
npm install
```

### ৩. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ:
প্রজেক্টের রুট ডিরেক্টরিতে `.env` ফাইল তৈরি করুন এবং নিচের মানগুলো বসান:
```env
MONGO_URI="your-mongodb-connection-string"
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### ৪. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```
ব্রাউজারে [http://localhost:3000](http://localhost:3000) ওপেন করে প্রজেক্টটি ব্রাউজ করুন।

---

## 📱 রেসপনসিভনেস (Responsiveness)
ওয়েবসাইটটি মোবাইল, ট্যাবলেট ও ডেস্কটপ—যেকোনো স্ক্রিন সাইজে ব্যবহারবান্ধব ও ফ্লুইড অভিজ্ঞতা নিশ্চিত করে।
