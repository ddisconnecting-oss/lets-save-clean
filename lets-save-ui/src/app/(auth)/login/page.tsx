"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  const [showClerk, setShowClerk] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5efe6]">

      {/* LOGO */}
      <h1 className="text-3xl font-bold text-green-900 mb-6">
        LET’S SAVE!
      </h1>

      {/* HERO TEXT */}
      <h2 className="text-4xl font-bold text-center text-green-900 max-w-xl">
        Create your own budget tracker
      </h2>

      <p className="text-gray-600 mt-4 text-center max-w-md">
        Track your expenses, manage your income, and stay in control of your money.
      </p>

      {/* BUTTON */}
      <button
        onClick={() => setShowClerk(true)}
        className="mt-6 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
      >
        Log in
      </button>

      {/* CLERK MODAL */}
      {showClerk && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <SignIn
              afterSignInUrl="/dashboard"
              afterSignUpUrl="/dashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
}