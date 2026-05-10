import { getServerSession } from "next-auth";
import MessageForm from "./MessageForm";
import BackToTopLink from "../components/BackToTopLink";
import RoomList from "../components/RoomList";
import MessageList from "../components/MessageList";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";
import { getRoomsByUserId } from "@/lib/room";
import { redirect } from "next/navigation";

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
    redirect("/auth/signin");
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    return <p>User not found</p>;
  }

  const rooms = await getRoomsByUserId(user.id);

  const selectedRoom = roomId
    ? rooms.find((room: RoomWithUsersAndMessages) => room.id === roomId)
    : rooms[0];

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <BackToTopLink />

          <p className="mt-6 text-sm font-semibold text-blue-600">Messages</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">メッセージ</h1>

          <p className="mt-2 text-sm text-slate-600">
            ユーザーとのやり取りを確認できます。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              ルーム一覧
            </h2>

            <RoomList
              rooms={rooms}
              currentUserId={user.id}
              selectedRoomId={selectedRoom?.id}
            />
          </aside>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            {!selectedRoom ? (
              <p className="text-sm text-slate-500">ルームを選択してください</p>
            ) : (
              <>
                <h2 className="mb-6 text-xl font-bold text-slate-900">
                  メッセージ一覧
                </h2>

                <MessageList messages={selectedRoom.messages} />

                <MessageForm roomId={selectedRoom.id} />
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
