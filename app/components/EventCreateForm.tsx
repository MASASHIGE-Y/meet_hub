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
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">イベント作成</h2>
        <p className="mt-2 text-sm text-slate-600">
          勉強会・交流会・プロジェクトなどのイベントを登録できます。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input
          {...register("title")}
          placeholder="タイトル"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}

        <textarea
          {...register("description")}
          placeholder="内容"
          className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}

        <input
          type="datetime-local"
          {...register("startAt")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        {errors.startAt && (
          <p className="text-sm text-red-500">{errors.startAt.message}</p>
        )}

        <input
          type="datetime-local"
          {...register("endAt")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        {errors.endAt && (
          <p className="text-sm text-red-500">{errors.endAt.message}</p>
        )}

        <input
          {...register("location")}
          placeholder="場所"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <input
          type="number"
          {...register("capacity")}
          placeholder="参加上限人数"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        {errors.capacity && (
          <p className="text-sm text-red-500">{errors.capacity.message}</p>
        )}

        <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
          作成
        </button>
      </form>
    </div>
  );
}
