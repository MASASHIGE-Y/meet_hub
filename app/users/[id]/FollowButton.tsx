"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  userId: string;
  isFollowing: boolean;
};

export default function FollowButton({ userId, isFollowing }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFollow = async () => {
    setLoading(true);

    await fetch(`/api/users/${userId}/follow`, {
      method: isFollowing ? "DELETE" : "POST",
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      {loading ? "処理中..." : isFollowing ? "フォロー解除" : "フォロー"}
    </button>
  );
}
