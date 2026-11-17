"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Unable to sign in");
      const next = new URLSearchParams(window.location.search).get("next") || "/admin";
      router.replace(next);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#2A2825] px-6 py-16 text-[#F8F5F0]">
      <div className="mx-auto max-w-md border border-[#8B6914]/50 bg-[#F8F5F0] p-8 text-[#1A1A1A] shadow-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B6914]">
          Candela Staff Access
        </p>
        <h1 className="mt-3 font-heading text-4xl">Admin Console</h1>
        <p className="mt-2 text-sm text-[#5C5A55]">
          Sign in with your staff account to manage the catalogue, enquiries, inventory and CMS.
        </p>

        {error && (
          <p className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-xs font-mono uppercase tracking-wider">
            Username
            <input
              required
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full border border-[#D4D0C8] bg-white px-4 py-3 text-sm outline-none focus:border-[#8B6914]"
            />
          </label>
          <label className="block text-xs font-mono uppercase tracking-wider">
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full border border-[#D4D0C8] bg-white px-4 py-3 text-sm outline-none focus:border-[#8B6914]"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8B6914] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#2A2825] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link href="/" className="mt-6 inline-block text-xs text-[#8B6914] hover:underline">
          Return to storefront
        </Link>
      </div>
    </main>
  );
}
