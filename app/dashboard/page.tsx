import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // ログインしていなければ追い出す
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="mt-4">Karibu、{session.user?.email}🇰🇪</p>
    </main>
  );
}
