"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  roomId: string;
};

export default function MessageForm({ roomId }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) return;

    setLoading(true);

    await fetch(`/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        content,
      }),
    });

    setContent("");
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="メッセージを入力"
        className="flex-1 rounded border px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        {loading ? "送信中..." : "送信"}
      </button>
    </form>
  );
}
