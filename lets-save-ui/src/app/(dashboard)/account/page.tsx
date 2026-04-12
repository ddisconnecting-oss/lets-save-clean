"use client";

import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";

export default function AccountPage() {
  const { user, isLoaded } = useUser();

  // ✅ WAIT until user loads
  if (!isLoaded || !user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f5efe6] text-[#2f3e2c]">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="bg-white rounded-2xl p-6 shadow-md max-w-2xl">

          {/* PROFILE */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
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
              <p className="text-gray-500">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="ml-auto">
              <UserButton />
            </div>
          </div>

          {/* FORM */}
          <div className="space-y-6">
            <div>
              <label>Name</label>
              <input
                className="w-full border p-3 rounded-lg bg-gray-100"
                value={user.fullName || ""}
                disabled
              />
            </div>

            <div>
              <label>Email</label>
              <input
                className="w-full border p-3 rounded-lg bg-gray-100"
                value={user.primaryEmailAddress?.emailAddress || ""}
                disabled
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-8">
            <SignOutButton redirectUrl="/">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Logout
              </button>
            </SignOutButton>

            <button className="bg-green-700 text-white px-4 py-2 rounded-lg">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}