import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export default async function Sidebar() {
  const session = await getServerSession(authOptions);

  let unreadCount = 0;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

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
    <aside className="w-48 bg-gray-100 p-4 space-y-2">
      <Link href="/dashboard">Dashboard</Link>
      <br />
      <Link href="/bookmarks">Bookmarks</Link>
      <br />
      <Link href="/following">フォロー中</Link>
      <br />
      <Link href="/messages">メッセージ</Link>
      <br />

      <Link href="/notifications">
        通知 {unreadCount > 0 && `(${unreadCount})`}
      </Link>
    </aside>
  );
}
