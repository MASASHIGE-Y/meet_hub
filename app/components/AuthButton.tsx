"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>{session.user?.email}</p>
        <button onClick={() => signOut()}>ログアウト</button>
      </>
    );
  }

  return <button onClick={() => signIn("github")}>ログイン</button>;
}
