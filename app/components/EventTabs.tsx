import Link from "next/link";

type Props = {
  tab?: string;
};

export default function EventTabs({ tab }: Props) {
  return (
    <div className="mb-4 flex gap-2">
      <Link
        href="/"
        className={`rounded px-4 py-2 ${
          tab !== "following"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        おすすめ
      </Link>

      <Link
        href="/?tab=following"
        className={`rounded px-4 py-2 ${
          tab === "following"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        フォロー中
      </Link>
    </div>
  );
}
