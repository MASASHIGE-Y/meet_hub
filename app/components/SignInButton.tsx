"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Sign in with GitHub
      </button>

      <button
        onClick={() => signIn("credentials", { callbackUrl: "/" })}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        ゲストログインで試す
      </button>
    </div>
  );
}
