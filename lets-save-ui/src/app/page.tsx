"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5efe6] flex flex-col">

      {/* NAVBAR */}
      <div className="bg-green-700 text-white p-4 flex justify-between">
        <h1 className="font-bold text-lg">LET’S SAVE!</h1>
      </div>

      {/* HERO */}
      <div className="flex flex-1 items-center justify-center text-center px-6">
        <div>
          <h1 className="text-5xl font-bold mb-4">
            Create your own budget tracker
          </h1>

          <p className="text-gray-600 mb-6">
            Track expenses, manage income, and stay in control.
          </p>

          <div className="space-x-4">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Log in
            </button>

            <button
              onClick={() => setShowSignup(true)}
              className="border border-green-700 text-green-700 px-6 py-2 rounded-lg"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl relative w-[350px]">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-red-500"
            >
              ✕
            </button>
            <SignIn />
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl relative w-[350px]">
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-2 right-2 text-red-500"
            >
              ✕
            </button>
            <SignUp />
          </div>
        </div>
      )}
    </div>
  );
}