import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description: string | null;
};

type Props = {
  events: Event[];
};

export default function UserEventList({ events }: Props) {
  if (events.length === 0) {
    return <p className="mt-4 text-gray-500">イベントはありません</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {events.map((event) => (
        <li key={event.id} className="rounded border p-3">
          <Link
            href={`/events/${event.id}`}
            className="font-bold hover:underline"
          >
            {event.title}
          </Link>
          <p className="text-sm text-gray-600">{event.description}</p>
        </li>
      ))}
    </ul>
  );
}
