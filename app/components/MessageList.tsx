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
    <ul className="space-y-2">
      {messages.map((message) => (
        <li key={message.id} className="rounded border p-2">
          <p className="text-sm text-gray-500">
            {message.sender.name ?? "Unknown user"}
          </p>
          <p>{message.content}</p>
        </li>
      ))}
    </ul>
  );
}
