"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("The email or password is incorrect.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form
      action={submit}
      className="surface w-full max-w-md rounded-sm p-7 shadow-[0_20px_60px_rgba(36,43,39,0.08)] sm:p-9"
    >
      <div className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#174D3D]">
          Franchise
        </p>

        <p className="mt-1 font-[family-name:var(--font-allura)] text-4xl leading-none text-[#0D352B]">
          Fragrence
        </p>
      </div>

      <div>
        <p className="eyebrow">Administration</p>

        <h1 className="display mt-3 text-4xl text-[#242B27]">Welcome back</h1>

        <p className="mt-2 text-sm leading-6 text-[#6D756E]">
          Sign in to manage your fragrance catalogue.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-[#242B27]">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            className="mt-2 w-full rounded-sm border border-[#DCD2C3] bg-white px-3 py-3 text-sm text-[#242B27] placeholder:text-[#9A958B] outline-none transition focus:border-[#174D3D] focus:ring-2 focus:ring-[#174D3D]/10"
          />
        </label>

        <label className="block text-sm font-medium text-[#242B27]">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className="mt-2 w-full rounded-sm border border-[#DCD2C3] bg-white px-3 py-3 text-sm text-[#242B27] placeholder:text-[#9A958B] outline-none transition focus:border-[#174D3D] focus:ring-2 focus:ring-[#174D3D]/10"
          />
        </label>
      </div>

      {error && (
        <p
          className="mt-5 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="button button-solid mt-7 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}

        {!pending && <ArrowRight size={16} strokeWidth={1.7} />}
      </button>
    </form>
  );
}
