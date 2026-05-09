import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(200, "bioは200文字以内"),
  birthDate: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
