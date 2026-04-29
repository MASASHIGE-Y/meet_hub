"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  eventId: string;
  isParticipating: boolean;
};

export default function ParticipationButton({
  eventId,
  isParticipating,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);

    await fetch(`/api/events/${eventId}/participation`, {
      method: isParticipating ? "DELETE" : "POST",
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      {loading ? "処理中..." : isParticipating ? "参加取消" : "参加する"}
    </button>
  );
}
