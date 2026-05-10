type User = {
  id: string;
  name: string | null;
};

type Message = {
  id: string;
  content: string;
  sender: User;
};

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
  return (
    <ul className="space-y-4">
      {messages.map((message) => (
        <li key={message.id} className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            {message.sender.name ?? "Unknown user"}
          </p>

          <p className="mt-2 text-slate-800">{message.content}</p>
        </li>
      ))}
    </ul>
  );
}
