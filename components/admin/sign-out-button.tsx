"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  async function handleSignOut() {
    await signOut({
      callbackUrl: "/admin/login",
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-[#6D756E] transition hover:bg-[#EAE1D2] hover:text-[#174D3D]"
    >
      <LogOut size={17} strokeWidth={1.5} />

      <span>Sign out</span>
    </button>
  );
}
