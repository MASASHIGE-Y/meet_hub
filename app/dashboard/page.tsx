import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BackToTopLink from "../components/BackToTopLink";
import DashboardEventList from "../components/DashboardEventList";

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
      <BackToTopLink />
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p>名前：{user?.name}</p>
      <p>自己紹介：{user?.bio}</p>
      <p>誕生日：{user?.birthDate?.toDateString()}</p>

      <section className="mt-8">
        <h2 className="text-xl font-bold">あなたのイベント</h2>

        <DashboardEventList events={events} userId={user.id} />
      </section>
    </main>
  );
}
