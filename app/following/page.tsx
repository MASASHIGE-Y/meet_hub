import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FollowingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>Unauthorized</p>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

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

  return (
    <main className="p-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ←
        </Link>
        <span className="text-sm text-gray-400">トップ</span>
      </div>

      <h1 className="text-2xl font-bold mb-4">フォロー中</h1>

      {follows.length === 0 ? (
        <p>まだ誰もフォローしていません</p>
      ) : (
        <ul className="space-y-4">
          {follows.map((f) => (
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
