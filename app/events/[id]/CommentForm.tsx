"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { commentSchema, type CommentFormData } from "@/schemas/comment";

export default function CommentForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    setLoading(true);

    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ content: data.content, eventId }),
    });

    reset();
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <textarea
        {...register("content")}
        className="w-full border p-2 rounded"
        placeholder="コメントを書く"
      />
      {errors.content && (
        <p className="text-sm text-red-500">{errors.content.message}</p>
      )}
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
