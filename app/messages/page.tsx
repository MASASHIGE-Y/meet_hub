import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import MessageForm from "./MessageForm";
import BackToTopLink from "../components/BackToTopLink";
import RoomList from "../components/RoomList";
import MessageList from "../components/MessageList";
import { authOptions } from "@/lib/auth";

type Props = {
  searchParams: Promise<{
    roomId?: string;
  }>;
};

type RoomWithUsersAndMessages = {
  id: string;
  users: {
    id: string;
    name: string | null;
  }[];
  messages: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string | null;
    };
  }[];
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
    ? rooms.find((room: RoomWithUsersAndMessages) => room.id === roomId)
    : rooms[0];

  return (
    <main className="flex h-screen">
      <BackToTopLink />

      <aside className="w-64 border-r p-4">
        <h1 className="mb-4 text-xl font-bold">メッセージ</h1>

        <RoomList
          rooms={rooms}
          currentUserId={user.id}
          selectedRoomId={selectedRoom?.id}
        />
      </aside>

      <section className="flex-1 p-4">
        {!selectedRoom ? (
          <p>ルームを選択してください</p>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-bold">メッセージ一覧</h2>

            <MessageList messages={selectedRoom.messages} />

            <MessageForm roomId={selectedRoom.id} />
          </>
        )}
      </section>
    </main>
  );
}
