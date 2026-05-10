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
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <BackToTopLink />

          <p className="mt-6 text-sm font-semibold text-blue-600">Following</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">フォロー中</h1>

          <p className="mt-2 text-sm text-slate-600">
            フォローしているユーザーを確認できます。
          </p>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          {follows.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              まだ誰もフォローしていません。
            </p>
          ) : (
            <ul className="space-y-4">
              {follows.map((f: FollowWithUser) => (
                <li
                  key={f.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link href={`/users/${f.following.id}`} className="block">
                    <h2 className="text-lg font-bold text-slate-900 hover:text-blue-600">
                      {f.following.name ?? "Unknown user"}
                    </h2>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
