import SignInButton from "@/app/components/SignInButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold text-blue-600">meet_hub</p>
          <h1 className="text-2xl font-bold text-slate-900">
            イベントで人とつながる
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            勉強会・交流会・プロジェクトなどのイベントを作成し、参加・ブックマーク・コメントでつながれるアプリです。
          </p>
        </div>

        <SignInButton />

        <p className="mt-6 text-center text-xs text-slate-500">
          採用担当者の方は、ゲストログインからすぐにお試しいただけます。
        </p>
      </section>
    </main>
  );
}
