import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BackToTopLink from "../components/BackToTopLink";
import DashboardEventList from "../components/DashboardEventList";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";
import { getEventsByUserId } from "@/lib/event";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // ログインしていなければ追い出す
  if (!session) {
    redirect("/auth/signin");
  }

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await findUserByEmail(session.user.email);

  if (!user?.isOnboarded) {
    redirect("/register");
  }

  const events = await getEventsByUserId(user.id);

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
