"use client";

import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5efe6]">
      <div className="bg-white p-8 rounded-xl shadow-md w-87.5">
        <h1 className="text-xl font-bold mb-4">Create Account</h1>

        <button
          onClick={() => router.push("/signup/sign-up")}
          className="w-full bg-green-700 text-white py-2 rounded-lg"
        >
          Continue to Sign Up
        </button>
      </div>
    </div>
  );
}