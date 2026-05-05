import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import BackToTopLink from "../components/BackToTopLink";
import BookmarkList from "../components/BookmarkList";
import { authOptions } from "@/lib/auth";

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
      <BackToTopLink />
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>

      <BookmarkList bookmarks={bookmarks} />
    </main>
  );
}
