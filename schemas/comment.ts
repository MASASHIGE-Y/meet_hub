import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "コメントを入力してください"),
});

export type CommentFormData = z.infer<typeof commentSchema>;
