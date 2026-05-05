import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findUserByEmail } from "@/lib/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import z from "zod";

const registerSchema = z.object({
  birthDate: z.string().min(1, "生年月日を入力してください"),
  bio: z.string().max(140, "自己紹介文は140文字以内です"),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const { birthDate, bio } = result.data;

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      birthDate: new Date(birthDate),
      bio,
      isOnboarded: true,
    },
  });

  return NextResponse.json({ message: "Registered" });
}
