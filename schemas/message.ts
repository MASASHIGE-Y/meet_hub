import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(1, "メッセージを入力してください"),
});

export type MessageFormData = z.infer<typeof messageSchema>;
