"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  userId?: string;
};

export default function AuthButton({ userId }: Props) {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {userId ? (
          <Link
            href={`/users/${userId}`}
            className="flex items-center gap-2 hover:underline"
          >
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "user avatar"}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <span>{session.user?.name}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "user avatar"}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <span>{session.user?.name}</span>
          </div>
        )}

        <Link
          href="/events/new"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          イベント作成
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="rounded bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return <button onClick={() => signIn("github")}>ログイン</button>;
}
