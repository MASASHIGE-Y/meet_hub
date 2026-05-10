import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";

export default async function Sidebar() {
  const session = await getServerSession(authOptions);

  let unreadCount = 0;

  if (session?.user?.email) {
    const user = await findUserByEmail(session.user.email);

    if (user) {
      unreadCount = await prisma.notification.count({
        where: {
          userId: user.id,
          isRead: false,
        },
      });
    }
  }

  return (
    <aside className="min-h-screen w-56 border-r border-slate-200 bg-white px-6 py-8">
      <Link href="/" className="mb-8 block text-2xl font-bold text-slate-900">
        meet_hub
      </Link>

      <nav className="space-y-2 text-sm">
        <Link
          href="/dashboard"
          className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100"
        >
          Dashboard
        </Link>

        <Link
          href="/bookmarks"
          className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100"
        >
          Bookmarks
        </Link>

        <Link
          href="/following"
          className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100"
        >
          フォロー中
        </Link>

        <Link
          href="/messages"
          className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100"
        >
          メッセージ
        </Link>

        <Link
          href="/notifications"
          className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100"
        >
          通知
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </nav>
    </aside>
  );
}
