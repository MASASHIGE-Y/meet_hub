import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MessageForm from "./MessageForm";

type Props = {
  searchParams: Promise<{
    roomId?: string;
  }>;
};

export default async function MessagesPage({ searchParams }: Props) {
  const { roomId } = await searchParams;

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

  const rooms = await prisma.room.findMany({
    where: {
      users: {
        some: {
          id: user.id,
        },
      },
    },
    include: {
      users: true,
      messages: {
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const selectedRoom = roomId
    ? rooms.find((room) => room.id === roomId)
    : rooms[0];

  return (
    <main className="flex h-screen">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          ← トップへ戻る
        </Link>
      </div>

      <aside className="w-64 border-r p-4">
        <h1 className="mb-4 text-xl font-bold">メッセージ</h1>

        {rooms.length === 0 ? (
          <p>ルームはありません</p>
        ) : (
          <ul className="space-y-2">
            {rooms.map((room) => {
              const partner = room.users.find((u) => u.id !== user.id);

              return (
                <Link key={room.id} href={`/messages?roomId=${room.id}`}>
                  <li
                    className={`rounded border p-2" ${
                      selectedRoom?.id === room.id
                        ? "bg-gray-100 font-bold"
                        : ""
                    }`}
                  >
                    {partner?.name ?? "Unknown user"}
                  </li>
                </Link>
              );
            })}
          </ul>
        )}
      </aside>

      <section className="flex-1 p-4">
        {!selectedRoom ? (
          <p>ルームを選択してください</p>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-bold">メッセージ一覧</h2>

            <ul className="space-y-2">
              {selectedRoom.messages.map((message) => (
                <li key={message.id} className="rounded border p-2">
                  <p className="text-sm text-gray-500">
                    {message.sender.name ?? "Unknown user"}
                  </p>
                  <p>{message.content}</p>
                </li>
              ))}
            </ul>

            <MessageForm roomId={selectedRoom.id} />
          </>
        )}
      </section>
    </main>
  );
}
