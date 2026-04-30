"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/" })}
      className="rounded bg-black px-4 py-2 text-white transition duration-200 hover:bg-gray-800 active:scale-95"
    >
      Sign in with GitHub
    </button>
  );
}
