"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  eventSchema,
  type EventFormData,
  type EventFormInput,
} from "@/schemas/event";

export default function EventCreateForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormInput, unknown, EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: EventFormData) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      reset();
      router.refresh();
    } else {
      alert("作成に失敗しました");
    }
  };

  return (
    <div className="mb-6 rounded border p-4 max-w-xl">
      <h2 className="mb-2 text-lg font-bold">イベント作成</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("title")}
          placeholder="タイトル"
          className="mb-2 w-full border p-2"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}

        <textarea
          {...register("description")}
          placeholder="内容"
          className="mb-2 w-full border p-2"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}

        <input
          type="datetime-local"
          {...register("startAt")}
          className="mb-2 w-full border p-2"
        />
        {errors.startAt && (
          <p className="text-sm text-red-500">{errors.startAt.message}</p>
        )}

        <input
          type="datetime-local"
          {...register("endAt")}
          className="mb-2 w-full border p-2"
        />
        {errors.endAt && (
          <p className="text-sm text-red-500">{errors.endAt.message}</p>
        )}

        <input
          {...register("location")}
          placeholder="場所"
          className="mb-2 w-full border p-2"
        />

        <input
          type="number"
          {...register("capacity")}
          placeholder="参加上限人数"
          className="mb-2 w-full border p-2"
        />
        {errors.capacity && (
          <p className="text-sm text-red-500">{errors.capacity.message}</p>
        )}

        <button className="rounded bg-blue-500 px-4 py-2 text-white">
          作成
        </button>
      </form>
    </div>
  );
}
