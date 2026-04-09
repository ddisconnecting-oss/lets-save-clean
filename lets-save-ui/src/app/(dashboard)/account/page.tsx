"use client";

import Sidebar from "@/app/components/Sidebar"
import { UserButton } from "@clerk/nextjs";

export default function Account() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-xl font-bold">Account Settings</h1>

        <UserButton />

        <input placeholder="Name" className="w-full p-2 rounded bg-slate-700" />
        <input placeholder="Email" className="w-full p-2 rounded bg-slate-700" />

        <button className="bg-green-500 px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
}