"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="w-full rounded bg-black px-4 py-2 text-white transition duration-200 hover:bg-gray-800"
      >
        Sign in with GitHub
      </button>

      <button
        onClick={() => signIn("credentials", { callbackUrl: "/" })}
        className="w-full rounded border border-gray-300 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
      >
        ゲストログイン
      </button>
    </div>
  );
}
