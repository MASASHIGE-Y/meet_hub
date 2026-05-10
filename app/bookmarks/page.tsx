import { getServerSession } from "next-auth";
import BackToTopLink from "../components/BackToTopLink";
import BookmarkList from "../components/BookmarkList";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";
import { getBookmarksByUserId } from "@/lib/bookmark";
import { redirect } from "next/navigation";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) return <p>User not found</p>;

  const bookmarks = await getBookmarksByUserId(user.id);

  return (
    <main className="p-8">
      <BackToTopLink />
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>

      <BookmarkList bookmarks={bookmarks} />
    </main>
  );
}
