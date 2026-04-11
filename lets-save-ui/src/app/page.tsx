"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/login"); // 👈 FIRST SCREEN
    } else {
      router.replace("/dashboard"); // 👈 AFTER LOGIN
    }
  }, [isSignedIn, isLoaded]);

  return null;
}