"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormData = {
  birthDate: string;
  bio: string;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const res = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      //成功したらdashboardへ
      router.push("/dashboard");
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
        </div>

        <div>
          <label>自己紹介</label>
          <textarea {...register("bio")} className="border p-2 w-full" />
        </div>

        <button type="submit" className="bg-black text-white px-4 py-2">
          登録する
        </button>
      </form>
    </main>
  );
}
