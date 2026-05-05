"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  roomId: string;
};

const messageSchema = z.object({
  content: z.string().min(1, "メッセージを入力してください"),
});

type MessageFormData = z.infer<typeof messageSchema>;

export default function MessageForm({ roomId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: MessageFormData) => {
    setLoading(true);

    await fetch(`/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        content: data.content,
      }),
    });

    reset();
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex gap-2">
      <input
        {...register("content")}
        className="flex-1 rounded border px-3 py-2"
        placeholder="メッセージを入力"
      />
      {errors.content && (
        <p className="text-sm text-red-500">{errors.content.message}</p>
      )}

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
