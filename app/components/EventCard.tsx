import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description: string | null;
  startAt: Date | null;
  endAt: Date | null;
  location: string | null;
  capacity: number | null;
  creator: {
    id: string;
    name: string | null;
    image: string | null;
  };
  participations: {
    id: string;
  }[];
};

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  return (
    <li key={event.id} className="rounded border p-4">
      <div className="mb-2 flex items-center gap-2">
        <Link
          href={`/users/${event.creator.id}`}
          className="mb-2 flex items-center gap-2 hover:underline"
        >
          {event.creator.image && (
            <img
              src={event.creator.image}
              alt={event.creator.name ?? "user avatar"}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span>{event.creator.name ?? "Unknown user"}</span>
        </Link>
      </div>

      <Link href={`/events/${event.id}`}>
        <h3 className="text-lg font-bold hover:underline cursor-pointer">
          {event.title}
        </h3>
      </Link>

      <p className="mt-1 text-sm">{event.description}</p>

      <p className="mt-2 text-sm text-gray-600">
        日時:{" "}
        {event.startAt ? new Date(event.startAt).toLocaleString() : "未設定"} ~{" "}
        {event.endAt ? new Date(event.endAt).toLocaleString() : "未設定"}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        場所: {event.location ?? "未設定"}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        参加人数: {event.participations.length} / {event.capacity ?? "未設定"}
      </p>
    </li>
  );
}
