import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProfileEditForm from "./ProfileEditForm";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("api/auth/signin");
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="p-8">
      <Link
        href={`/users/${user.id}`}
        className="text-sm text-blue-500 underline"
      >
        ← プロフィールに戻る
      </Link>
      <h1 className="text-2xl font-bold">プロフィール編集</h1>

      <ProfileEditForm user={user} />
    </main>
  );
}
