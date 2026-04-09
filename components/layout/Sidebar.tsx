"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-green-700 text-white min-h-screen p-5">

      <h1 className="text-xl font-bold mb-6">LET’S SAVE!</h1>

      <nav className="flex flex-col gap-3">

        <Link href="/dashboard" className="hover:bg-green-600 p-2 rounded">
          Dashboard
        </Link>

        <Link href="/reports" className="hover:bg-green-600 p-2 rounded">
          Reports
        </Link>

        <Link href="/accounts" className="hover:bg-green-600 p-2 rounded">
          Accounts
        </Link>

      </nav>
    </div>
  );
}