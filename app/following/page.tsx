import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BackToTopLink from "../components/BackToTopLink";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function FollowingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    return <p>User not found</p>;
  }

  const follows = await prisma.follow.findMany({
    where: {
      followerId: user.id,
    },
    include: {
      following: true,
    },
  });

  type FollowWithUser = {
    id: string;
    following: {
      id: string;
      name: string | null;
    };
  };

  return (
    <main className="p-8">
      <BackToTopLink />

      <h1 className="text-2xl font-bold mb-4">フォロー中</h1>

      {follows.length === 0 ? (
        <p>まだ誰もフォローしていません</p>
      ) : (
        <ul className="space-y-4">
          {follows.map((f: FollowWithUser) => (
            <li key={f.id} className="border p-4 rounded">
              <Link href={`/users/${f.following.id}`}>
                <h2 className="font-bold hover:underline">
                  {f.following.name}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
