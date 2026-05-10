"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { profileSchema, type ProfileFormData } from "@/schemas/profile";

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
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: user.bio ?? "",
      birthDate: user.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : "",
    },
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (data: ProfileFormData) => {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 space-y-6 rounded-2xl bg-white p-8 shadow-sm"
    >
      <div>
        <label className="text-sm font-medium text-slate-700">自己紹介</label>
        <textarea
          {...register("bio")}
          defaultValue={user.bio ?? ""}
          className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        {errors.bio && (
          <p className="mt-2 text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">生年月日</label>
        <input
          type="date"
          {...register("birthDate")}
          defaultValue={
            user.birthDate
              ? new Date(user.birthDate).toISOString().split("T")[0]
              : ""
          }
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <button
        disabled={!isDirty}
        className="rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        更新する
      </button>

      {message && (
        <p className="text-sm font-medium text-green-600">{message}</p>
      )}
    </form>
  );
}
