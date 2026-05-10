import { z } from "zod";

export const registerSchema = z.object({
  birthDate: z.string().min(1, "生年月日を入力してください"),
  bio: z.string().max(140, "自己紹介文は140文字以内です"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
