"use client";

import { SimpleEvent } from "@/types/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateEventSchema } from "@/schemas/event";
import { z } from "zod";

type EditFormProps = {
  event: SimpleEvent;
};

type EditEventFormData = z.infer<typeof updateEventSchema>;

export default function EditForm({ event }: EditFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditEventFormData>({
    resolver: zodResolver(updateEventSchema),
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
