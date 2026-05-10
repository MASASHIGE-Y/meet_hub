import Link from "next/link";

type Props = {
  userId: string;
  currentTab: string;
};

export default function UserProfileTabs({ userId, currentTab }: Props) {
  const tabs = [
    { key: "created", label: "主催" },
    { key: "participated", label: "参加" },
    { key: "bookmarks", label: "Bookmark" },
    { key: "comments", label: "コメント" },
  ];

  return (
    <div className="mt-4 flex gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={`/users/${userId}?tab=${tab.key}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            currentTab === tab.key
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
