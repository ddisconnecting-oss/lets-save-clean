"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const linkStyle = (route: string) =>
    `p-2 rounded-lg ${
      path === route
        ? "bg-green-800 text-white"
        : "hover:bg-green-600"
    }`;

  return (
    <div className="w-64 bg-green-700 text-white min-h-screen p-5">

      <h1 className="text-xl font-bold mb-6">LET’S SAVE!</h1>

      <nav className="flex flex-col gap-3">

        <Link href="/dashboard" className={linkStyle("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/reports" className={linkStyle("/reports")}>
          Reports
        </Link>

        <Link href="/accounts" className={linkStyle("/accounts")}>
          Accounts
        </Link>

      </nav>
    </div>
  );
}