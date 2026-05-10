import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProfileEditForm from "./ProfileEditForm";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/users/${user.id}`}
          className="text-sm text-blue-500 underline"
        >
          ← プロフィールに戻る
        </Link>
        <h1 className="text-2xl font-bold">プロフィール編集</h1>

        <ProfileEditForm user={user} />
      </div>
    </main>
  );
}
