import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">プロフィール編集</h1>
      <p>現在の自己紹介：{user.bio}</p>
      <p>現在の誕生日：{user.birthDate?.toDateString()}</p>
      <form action="/api/profile" method="POST" className="space-y-4 mt-6">
        <div>
          <label>自己紹介</label>
          <textarea
            name="bio"
            defaultValue={user.bio ?? ""}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>誕生日</label>
          <input
            type="date"
            name="birthDate"
            defaultValue={
              user?.birthDate
                ? user?.birthDate?.toISOString().split("T")[0]
                : ""
            }
            className="border p-2 w-full"
          />
        </div>

        <button className="bg-blue-500 text-white px-4 py-2">更新する</button>
      </form>
    </main>
  );
}
