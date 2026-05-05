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
    return <p className="mt-4">まだイベントはありません</p>;
  }

  return (
    <ul className="mt-4 space-y-3">
      {events.map((event) => (
        <li key={event.id} className="border p-4">
          <h3 className="font-bold">{event.title}</h3>
          <p>{event.description}</p>
          <p>{event.date.toDateString()}</p>

          <BookmarkButton
            eventId={event.id}
            isBookmarked={event.bookmark.some(
              (bookmark) => bookmark.userId === userId,
            )}
          />

          <button
            onClick={async () => {
              if (!confirm("本当に削除しますか？")) return;

              await fetch(`/api/events/${event.id}`, {
                method: "DELETE",
              });
              location.reload();
            }}
            className="text-red-500 mt-2"
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  );
}
