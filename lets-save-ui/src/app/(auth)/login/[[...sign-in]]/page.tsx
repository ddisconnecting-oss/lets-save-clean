"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[360px]">

        <h1 className="text-2xl font-bold mb-4 text-[#2f3e2c]">
          Welcome Back
        </h1>

        <SignIn
          appearance={{
            elements: {
              card: "shadow-none",
              footer: "hidden",
              formButtonPrimary:
                "bg-green-700 hover:bg-green-800 text-white",
            },
          }}
        />

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-700 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}