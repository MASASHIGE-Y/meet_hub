import Link from "next/link";

type Bookmark = {
  id: string;
  event: {
    id: string;
    title: string;
    description: string | null;
    date: Date;
  };
};

type Props = {
  bookmarks: Bookmark[];
};

export default function BookmarkList({ bookmarks }: Props) {
  if (bookmarks.length === 0) {
    return (
      <p className="text-gray-500">
        まだブックマークはありません。気になるイベントを保存してみましょう！
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {bookmarks.map((b) => (
        <li key={b.id} className="border p-4 rounded">
          <Link href={`/events/${b.event.id}`}>
            <h3 className="text-lg font-bold">{b.event.title}</h3>
          </Link>
          <p className="text-sm text-gray-600">{b.event.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(b.event.date).toDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
