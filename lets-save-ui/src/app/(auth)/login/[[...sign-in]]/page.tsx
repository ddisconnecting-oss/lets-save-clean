"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const params = useSearchParams();
  const error = params.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">

        <h1 className="text-2xl font-bold mb-4 text-[#2f3e2c]">
          Welcome Back
        </h1>

        {/* 🔥 CUSTOM ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error === "notfound"
              ? "Account not found. Please sign up first."
              : "Something went wrong. Try again."}
          </div>
        )}

        <SignIn
          routing="hash"
          appearance={{
            elements: {
              card: "shadow-none",
              formButtonPrimary:
                "bg-green-700 hover:bg-green-800 text-white",
            },
          }}
        />

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-700">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}