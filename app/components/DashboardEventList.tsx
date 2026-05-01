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

          <form action={`/api/events/${event.id}`} method="POST">
            <button formMethod="DELETE" className="text-red-500 mt-2">
              削除
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
