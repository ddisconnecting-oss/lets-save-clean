"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup" | null>(null);

  // ✅ AUTO REDIRECT AFTER LOGIN
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f5efe6] text-[#2f3e2c]">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Create your own budget tracker
      </h1>

      <p className="mb-6 text-gray-600">
        Track expenses, manage income, and stay in control.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setMode("login")}
          className="bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Log in
        </button>

        <button
          onClick={() => setMode("signup")}
          className="border border-green-700 px-6 py-2 rounded-lg"
        >
          Sign up
        </button>
      </div>

      {/* MODAL */}
      {mode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">

            <button
              onClick={() => setMode(null)}
              className="absolute top-2 right-2"
            >
              ✕
            </button>

            {mode === "login" ? (
              <SignIn routing="hash" />
            ) : (
              <SignUp routing="hash" />
            )}
          </div>
        </div>
      )}
    </main>
  );
}