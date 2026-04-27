import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const bio = formData.get("bio") as string;
  const birthDate = formData.get("birthDate") as string;

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      bio,
      birthDate: birthDate ? new Date(birthDate) : null,
    },
  });

  return NextResponse.redirect("http://localhost:3000/dashboard");
}
