import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import BackToTopLink from "../components/BackToTopLink";
import NotificationList from "../components/NotificationList";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";
import { getNotificationsByUserId } from "@/lib/notification";
import { redirect } from "next/navigation";

export default async function NotificationPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    return <p>User not found</p>;
  }

  const notifications = await getNotificationsByUserId(user.id);

  async function toggleRead(id: string, isRead: boolean) {
    "use server";

    await prisma.notification.update({
      where: { id },
      data: {
        isRead: !isRead,
      },
    });

    revalidatePath("/");
    revalidatePath("/notifications");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <BackToTopLink />

          <p className="mt-6 text-sm font-semibold text-blue-600">
            Notifications
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">通知</h1>

          <p className="mt-2 text-sm text-slate-600">
            コメントや参加など、イベントに関する通知を確認できます。
          </p>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <NotificationList
            notifications={notifications}
            onToggleRead={toggleRead}
          />
        </section>
      </div>
    </main>
  );
}
