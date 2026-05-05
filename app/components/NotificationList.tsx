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
    return <p className="text-gray-500">通知はありません</p>;
  }

  return (
    <ul className="space-y-3">
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className={`border p-4 rounded ${notification.isRead ? "bg-white" : "bg-gray-100"}`}
        >
          <p>{notification.message}</p>
          <p className="mt-2 text-xs text-gray-500">
            {notification.createdAt.toLocaleString()}
          </p>
          <p className="mt-1 text-xs">
            {notification.isRead ? "既読" : "未読"}
          </p>

          <form
            action={onToggleRead.bind(
              null,
              notification.id,
              notification.isRead,
            )}
          >
            <button className="mt-2 text-sm text-blue-500">
              {notification.isRead ? "未読に戻す" : "既読にする"}
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
