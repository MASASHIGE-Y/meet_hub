import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { profileSchema } from "@/schemas/profile";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const result = profileSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 },
    );
  }

  const { bio, birthDate } = result.data;

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      bio,
      birthDate: birthDate ? new Date(birthDate) : null,
    },
  });

  return NextResponse.json({ message: "Profile updated" });
}
