import Link from "next/link";

type User = {
  id: string;
  name: string | null;
};

type Room = {
  id: string;
  users: User[];
};

type Props = {
  rooms: Room[];
  currentUserId: string;
  selectedRoomId?: string;
};

export default function RoomList({
  rooms,
  currentUserId,
  selectedRoomId,
}: Props) {
  if (rooms.length === 0) {
    return <p>ルームはありません</p>;
  }

  return (
    <ul className="space-y-2">
      {rooms.map((room) => {
        const partner = room.users.find((u) => u.id !== currentUserId);

        return (
          <Link key={room.id} href={`/messages?roomId=${room.id}`}>
            <li
              className={`rounded border p-2" ${
                selectedRoomId === room.id ? "bg-gray-100 font-bold" : ""
              }`}
            >
              {partner?.name ?? "Unknown user"}
            </li>
          </Link>
        );
      })}
    </ul>
  );
}
