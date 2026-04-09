"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-green-800 text-white p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8">LET’S SAVE!</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard" className="hover:text-green-200">
          Dashboard
        </Link>

        <Link href="/reports" className="hover:text-green-200">
          Reports
        </Link>

        <Link href="/account" className="hover:text-green-200">
          Accounts
        </Link>
      </nav>
    </div>
  );
}