"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function Home() {
  const [mode, setMode] = useState<"login" | "signup" | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f5efe6] text-[#2f3e2c]">
      {/* HERO */}
      <h1 className="text-5xl font-bold mb-4 text-center">
        Create your own budget tracker
      </h1>
      <p className="mb-6 text-gray-600">
        Track expenses, manage income, and stay in control.
      </p>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode("login")}
          className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
        >
          Log in
        </button>

        <button
          onClick={() => setMode("signup")}
          className="border border-green-700 px-6 py-2 rounded-lg hover:bg-green-100"
        >
          Sign up
        </button>
      </div>

      {/* MODAL */}
      {mode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* MODAL CARD */}
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-xl">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setMode(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            {/* CLERK */}
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