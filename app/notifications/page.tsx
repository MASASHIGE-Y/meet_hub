import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import BackToTopLink from "../components/BackToTopLink";
import NotificationList from "../components/NotificationList";
import { authOptions } from "@/lib/auth";

export default async function NotificationPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>Unauthorized</p>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <p>User not found</p>;
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
    <main className="p-8">
      <BackToTopLink />

      <h1 className="text-2xl font-bold mb-4">通知</h1>

      <NotificationList
        notifications={notifications}
        onToggleRead={toggleRead}
      />
    </main>
  );
}
