import { SimpleEvent } from "@/types/event";
import Link from "next/link";

type Props = {
  events: SimpleEvent[];
};

export default function UserEventList({ events }: Props) {
  if (events.length === 0) {
    return <p className="mt-4 text-gray-500">イベントはありません</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {events.map((event) => (
        <li
          key={event.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <Link
            href={`/events/${event.id}`}
            className="text-lg font-bold text-slate-900 hover:text-blue-600"
          >
            {event.title}
          </Link>
          <p className="text-sm leading-6 text-slate-600">
            {event.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
