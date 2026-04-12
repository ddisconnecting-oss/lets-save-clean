"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">

        <h1 className="text-2xl font-bold mb-2 text-[#2f3e2c]">
          Create Account
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Start tracking your budget
        </p>

        <SignUp
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

        <p className="text-xs text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-green-700 font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}