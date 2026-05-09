import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "タイトルは必須です"),
    description: z.string().max(140, "内容は140文字以内で入力してください"),
    startAt: z.string().min(1, "開始日時は必須です"),
    endAt: z.string().min(1, "終了日時は必須です"),
    location: z.string().optional(),
    capacity: z.coerce.number().min(1, "参加上限人数は1以上で入力してください"),
  })
  .refine((data) => new Date(data.startAt) < new Date(data.endAt), {
    message: "終了日時は開始日時より後にしてください",
    path: ["endAt"],
  });

export type EventFormInput = z.input<typeof eventSchema>;
export type EventFormData = z.output<typeof eventSchema>;

export const updateEventSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().max(140, "説明は140文字以内で入力してください"),
});
