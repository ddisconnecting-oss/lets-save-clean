"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">

      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">

        <h1 className="text-2xl font-bold mb-2 text-[#2f3e2c]">
          Welcome Back
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Log in to your account
        </p>

        <SignIn
          routing="hash"
          appearance={{
            elements: {
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary:
                "bg-green-700 hover:bg-green-800 text-white",
            },
          }}
        />

        {/* CUSTOM MESSAGE */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-700 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}