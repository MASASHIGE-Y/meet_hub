"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  birthDate: z.string().min(1, "生年月日は必須です"),
  bio: z.string().max(140, "自己紹介文は140文字以内で入力してください"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("登録しました");
      router.push("/");
    } else {
      alert("登録に失敗しました");
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>生年月日</label>
          <input
            type="date"
            {...register("birthDate")}
            className="border p-2 w-full"
          />
          {errors.birthDate && (
            <p className="text-sm text-red-500">{errors.birthDate.message}</p>
          )}
        </div>

        <div>
          <label>自己紹介</label>
          <textarea {...register("bio")} className="border p-2 w-full" />
          {errors.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all"
        >
          登録する
        </button>
      </form>
    </main>
  );
}
