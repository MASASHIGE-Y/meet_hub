"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentForm({ eventId }: { eventId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setLoading(true);

    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ content, eventId }),
    });

    setContent("");
    setLoading(false);
    router.refresh(); // シンプルに再取得
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="コメントを書く"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-4 py-2 bg-black text-white rounded"
      >
        投稿
      </button>
    </form>
  );
}
