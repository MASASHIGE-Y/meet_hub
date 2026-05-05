"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Event = {
  id: string;
  title: string;
  description: string | null;
};

type EditFormProps = {
  event: Event;
};

const editEventSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().max(140, "説明は140文字以内で入力してください"),
});

type EditEventFormData = z.infer<typeof editEventSchema>;

export default function EditForm({ event }: EditFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      title: event.title,
      description: event.description ?? "",
    },
  });

  const onSubmit = async (data: EditEventFormData) => {
    const response = await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(await response.json());
      return;
    }

    router.push(`/events/${event.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-2">
      <input {...register("title")} className="border p-2 w-full" />
      {errors.title && (
        <p className="text-sm text-red-500">{errors.title.message}</p>
      )}

      <textarea {...register("description")} className="border p-2 w-full" />
      {errors.description && (
        <p className="text-sm text-red-500">{errors.description.message}</p>
      )}

      <button className="bg-black text-white px-4 py-2">更新</button>
    </form>
  );
}
