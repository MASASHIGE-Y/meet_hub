import { EventCardType } from "@/types/event";
import Image from "next/image";
import Link from "next/link";

type Props = {
  event: EventCardType;
};

export default function EventCard({ event }: Props) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href={`/users/${event.creator.id}`}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          {event.creator.image && (
            <Image
              src={event.creator.image}
              alt={event.creator.name ?? "user avatar"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span>{event.creator.name ?? "Unknown user"}</span>
        </Link>
      </div>

      <Link href={`/events/${event.id}`} className="block">
        <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600">
          {event.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {event.description}
        </p>

        <div className="mt-4 space-y-1 text-sm text-slate-500">
          <p>
            日時：
            {event.startAt
              ? new Date(event.startAt).toLocaleString()
              : "未設定"}{" "}
            〜 {event.endAt ? new Date(event.endAt).toLocaleString() : "未設定"}
          </p>

          <p>場所：{event.location ?? "未設定"}</p>

          <p>
            参加人数：{event.participations.length} /{" "}
            {event.capacity ?? "未設定"}
          </p>
        </div>
      </Link>
    </li>
  );
}
