import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const schema = z.object({
    bio: z.string().max(140, "bioは140文字以内"),
    birthDate: z.string().optional(),
  });

  const bio = formData.get("bio") as string;
  const birthDate = formData.get("birthDate") as string;

  const result = schema.safeParse({ bio, birthDate });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 },
    );
  }

  const { bio: validBio, birthDate: validBirthDate } = result.data;

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      bio: validBio,
      birthDate: validBirthDate ? new Date(validBirthDate) : null,
    },
  });

  return NextResponse.redirect("http://localhost:3000/dashboard");
}
