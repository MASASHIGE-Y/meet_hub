"use client";

import BookmarkButton from "../events/[id]/BookmarkButton";

type DashboardEvent = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  bookmark: {
    userId: string;
  }[];
};

type Props = {
  events: DashboardEvent[];
  userId: string;
};

export default function DashboardEventList({ events, userId }: Props) {
  if (events.length === 0) {
    return (
      <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
        まだイベントはありません
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <li
          key={event.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {event.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {event.description ?? "説明は未設定です"}
              </p>

              <p className="mt-3 text-sm text-slate-500">
                開催日：{event.date.toDateString()}
              </p>
            </div>

            <BookmarkButton
              eventId={event.id}
              isBookmarked={event.bookmark.some(
                (bookmark) => bookmark.userId === userId,
              )}
            />
          </div>

          <button
            onClick={async () => {
              if (!confirm("本当に削除しますか？")) return;

              await fetch(`/api/events/${event.id}`, {
                method: "DELETE",
              });

              location.reload();
            }}
            className="mt-4 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  );
}
