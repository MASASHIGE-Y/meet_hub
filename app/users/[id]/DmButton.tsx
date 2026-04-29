"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  userId: string;
};

export default function DmButton({ userId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);

    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    router.push(`/messages?roomId=${data.roomId}`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-green-500 text-white px-4 py-2 rounded mt-4"
    >
      {loading ? "遷移中..." : "メッセージ"}
    </button>
  );
}
