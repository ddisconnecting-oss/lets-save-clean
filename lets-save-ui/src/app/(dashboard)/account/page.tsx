"use client";

import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";

export default function AccountPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f5efe6] to-[#e6f4ea] text-[#2f3e2c]">
      <Sidebar />

      <main className="flex-1 p-8 max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">
          Account Settings
        </h1>

        {/* CARD */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md space-y-6">

          {/* PROFILE */}
          <div className="flex items-center gap-6">

            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden shadow">
              {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {user.fullName || "User"}
              </h2>
              <p className="text-gray-500 text-sm">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="ml-auto">
              <UserButton />
            </div>
          </div>

          {/* FORM */}
          <div className="space-y-5">

            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="w-full mt-1 p-3 rounded-xl bg-white/80 border border-gray-200"
                value={user.fullName || ""}
                disabled
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                className="w-full mt-1 p-3 rounded-xl bg-white/80 border border-gray-200"
                value={user.primaryEmailAddress?.emailAddress || ""}
                disabled
              />
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex justify-between items-center pt-4">

            <SignOutButton redirectUrl="/">
              <button className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 hover:scale-105 transition shadow-md">
                Logout
              </button>
            </SignOutButton>

            <button className="bg-green-700 text-white px-5 py-2 rounded-xl hover:bg-green-800 hover:scale-105 transition shadow-md">
              Save Changes
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}