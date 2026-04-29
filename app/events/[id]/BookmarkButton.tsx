"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  eventId: string;
  isBookmarked: boolean;
};

export default function BookmarkButton({ eventId, isBookmarked }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBookmark = async () => {
    setLoading(true);

    await fetch(`/api/events/${eventId}/bookmark`, {
      method: isBookmarked ? "DELETE" : "POST",
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      {loading
        ? "処理中..."
        : isBookmarked
          ? "ブックマーク解除"
          : "ブックマーク"}
    </button>
  );
}
