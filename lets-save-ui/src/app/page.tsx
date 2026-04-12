"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  // 🔥 auto redirect if already logged in
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, isLoaded]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5efe6] text-[#2f3e2c]">

      <h1 className="text-4xl font-bold mb-4 text-center">
        Create your own budget tracker
      </h1>

      <p className="mb-6 text-gray-600">
        Track expenses, manage income, and stay in control
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
        >
          Log in
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="border border-green-700 px-6 py-2 rounded-lg hover:bg-green-100 transition"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}