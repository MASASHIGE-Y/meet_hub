"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        date,
      }),
    });

    if (res.ok) {
      alert("イベント作成成功🔥");
      router.push("/dashboard");
    } else {
      alert("失敗😭");
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">イベント作成</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>タイトル</label>
          <input
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>説明</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>日付</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button className="bg-blue-500 text-white px-4 py-2">作成する</button>
      </form>
    </main>
  );
}
