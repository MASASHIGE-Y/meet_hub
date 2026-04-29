import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();

  const message = await prisma.message.create({
    data: {
      content: body.content,
      roomId: body.roomId,
      senderId: user.id,
    },
  });

  await prisma.room.update({
    where: { id: body.roomId },
    data: {
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(message);
}
