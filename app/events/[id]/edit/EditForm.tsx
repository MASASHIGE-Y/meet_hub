"use client";

import { useState } from "react";

type Event = {
  id: string;
  title: string;
  description: string | null;
};

type EditFormProps = {
  event: Event;
};

export default function EditForm({ event }: EditFormProps) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    if (!response.ok) {
      console.error(await response.json());
      return;
    }

    location.href = `/events/${event.id}`;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
      />

      <button className="bg-black text-white px-4 py-2">更新</button>
    </form>
  );
}
