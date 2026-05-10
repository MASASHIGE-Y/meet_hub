type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

type Props = {
  notifications: Notification[];
  onToggleRead: (id: string, isRead: boolean) => Promise<void>;
};

export default function NotificationList({
  notifications,
  onToggleRead,
}: Props) {
  if (notifications.length === 0) {
    return (
      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
        通知はありません。
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className={`rounded-2xl border p-5 shadow-sm transition ${
            notification.isRead
              ? "border-slate-200 bg-white"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {notification.message}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {notification.createdAt.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {notification.isRead ? "既読" : "未読"}
              </p>
            </div>

            <form
              action={onToggleRead.bind(
                null,
                notification.id,
                notification.isRead,
              )}
            >
              <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
                {notification.isRead ? "未読に戻す" : "既読にする"}
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
