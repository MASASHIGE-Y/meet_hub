"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schema = z.object({
  bio: z.string().max(200),
  birthDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type ProfileEditUser = {
  id: string;
  bio: string | null;
  birthDate: Date | string | null;
};

export default function ProfileEditForm({ user }: { user: ProfileEditUser }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: user.bio ?? "",
      birthDate: user.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : "",
    },
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    if (!isDirty) return;
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setMessage("更新しました！");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      <div>
        <label>自己紹介</label>
        <textarea
          {...register("bio")}
          defaultValue={user.bio ?? ""}
          className="border p-2 w-full"
        />
        {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
      </div>

      <div>
        <label>生年月日</label>
        <input
          type="date"
          {...register("birthDate")}
          defaultValue={
            user.birthDate
              ? new Date(user.birthDate).toISOString().split("T")[0]
              : ""
          }
          className="border p-2 w-full"
        />
      </div>

      <button
        disabled={!isDirty}
        className="bg-blue-500 text-white px-4 py-2 cursor-pointer hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        更新する
      </button>
      {message && <p className="text-green-600">{message}</p>}
    </form>
  );
}
