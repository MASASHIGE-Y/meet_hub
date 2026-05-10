"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { messageSchema, type MessageFormData } from "@/schemas/message";

type Props = {
  roomId: string;
};

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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex gap-3">
      <input
        {...register("content")}
        className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
        placeholder="メッセージを入力"
      />
      {errors.content && (
        <p className="text-sm text-red-500">{errors.content.message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "送信中..." : "送信"}
      </button>
    </form>
  );
}
