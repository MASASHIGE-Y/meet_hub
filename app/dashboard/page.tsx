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
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <BackToTopLink />

          <p className="mt-6 text-sm font-semibold text-blue-600">Dashboard</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">マイページ</h1>

          <p className="mt-2 text-sm text-slate-600">
            プロフィール情報と作成したイベントを確認できます。
          </p>
        </div>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">プロフィール</h2>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>名前：{user.name ?? "未設定"}</p>
            <p>自己紹介：{user.bio ?? "未設定"}</p>
            <p>
              誕生日：
              {user.birthDate ? user.birthDate.toDateString() : "未設定"}
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">あなたのイベント</h2>

          <div className="mt-5">
            <DashboardEventList events={events} userId={user.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
