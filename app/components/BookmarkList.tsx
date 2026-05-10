import { BookmarkWithEvent } from "@/types/event";
import Link from "next/link";

type Props = {
  bookmarks: BookmarkWithEvent[];
};

export default function BookmarkList({ bookmarks }: Props) {
  if (bookmarks.length === 0) {
    return (
      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
        まだブックマークはありません。気になるイベントを保存してみましょう！
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <Link href={`/events/${b.event.id}`} className="block">
            <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600">
              {b.event.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600">{b.event.description}</p>

            <p className="mt-3 text-sm text-slate-500">
              {new Date(b.event.date).toDateString()}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
