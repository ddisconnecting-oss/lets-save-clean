"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  User,
  PiggyBank,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
    {
      name: "Account",
      href: "/account",
      icon: User,
    },
  ];

  return (
    <div className="w-64 min-h-screen flex flex-col justify-between
      bg-gradient-to-b from-[#1f5f2c] to-[#2e7d32] text-white p-6 shadow-xl">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white/20 p-2 rounded-lg">
            <PiggyBank size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-wide">
            LET’S SAVE
          </h1>
        </div>

        {/* SECTION LABEL */}
        <p className="text-xs text-white/60 mb-3 uppercase tracking-wider">
          Main
        </p>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200

                  ${
                    active
                      ? "bg-white/20 backdrop-blur-md shadow-inner"
                      : "hover:bg-white/10 hover:translate-x-1"
                  }
                `}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="mt-10">

        {/* DIVIDER */}
        <div className="h-px bg-white/20 mb-4" />

        {/* FOOTER / USER FEEL */}
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm">
            N
          </div>

          <div>
            <p className="text-sm font-medium">Your Account</p>
            <p className="text-xs text-white/60">Manage profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}