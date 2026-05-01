import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

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

  return (
    <main className="p-8">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          ← トップへ戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">通知</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">通知はありません</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`border p-4 rounded ${notification.isRead ? "bg-white" : "bg-gray-100"}`}
            >
              <p>{notification.message}</p>
              <p className="mt-2 text-xs text-gray-500">
                {notification.createdAt.toLocaleString()}
              </p>
              <p className="mt-1 text-xs">
                {notification.isRead ? "既読" : "未読"}
              </p>

              <form
                action={async () => {
                  "use server";

                  await prisma.notification.update({
                    where: { id: notification.id },
                    data: {
                      isRead: !notification.isRead,
                    },
                  });

                  revalidatePath("/");
                  revalidatePath("/notifications");
                }}
              >
                <button className="mt-2 text-sm text-blue-500">
                  {notification.isRead ? "未読に戻す" : "既読にする"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
