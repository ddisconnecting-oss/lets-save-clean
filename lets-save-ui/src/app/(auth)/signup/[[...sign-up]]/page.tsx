"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">
      <SignUp
        appearance={{
          elements: {
            card: "shadow-xl rounded-2xl",
            formButtonPrimary:
              "bg-green-700 hover:bg-green-800 text-white",
          },
        }}
      />
    </div>
  );
}