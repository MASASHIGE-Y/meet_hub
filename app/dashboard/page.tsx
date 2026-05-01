import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookmarkButton from "../events/[id]/BookmarkButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // ログインしていなければ追い出す
  if (!session) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const events = await prisma.event.findMany({
    where: {
      creatorId: user?.id,
    },
    include: {
      bookmark: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!user?.isOnboarded) {
    redirect("/register");
  }

  return (
    <main className="p-8">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          ← トップへ戻る
        </Link>
      </div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p>名前：{user?.name}</p>
      <p>自己紹介：{user?.bio}</p>
      <p>誕生日：{user?.birthDate?.toDateString()}</p>

      <section className="mt-8">
        <h2 className="text-xl font-bold">あなたのイベント</h2>

        {events.length === 0 ? (
          <p className="mt-4">まだイベントはありません</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {events.map((event) => (
              <li key={event.id} className="border p-4">
                <h3 className="font-bold">{event.title}</h3>
                <p>{event.description}</p>
                <p>{event.date.toDateString()}</p>

                <BookmarkButton
                  eventId={event.id}
                  isBookmarked={event.bookmark.some(
                    (bookmark) => bookmark.userId === user.id,
                  )}
                />

                <form action={`/api/events/${event.id}`} method="POST">
                  <button formMethod="DELETE" className="text-red-500 mt-2">
                    削除
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
