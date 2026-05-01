import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>Unauthorized</p>;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) return <p>User not found</p>;

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: user.id,
    },
    include: {
      event: true,
    },
  });

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
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500">
          まだブックマークはありません。気になるイベントを保存してみましょう！
        </p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((b) => (
            <li key={b.id} className="border p-4 rounded">
              <Link href={`/events/${b.event.id}`}>
                <h3 className="text-lg font-bold">{b.event.title}</h3>
              </Link>
              <p className="text-sm text-gray-600">{b.event.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(b.event.date).toDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
