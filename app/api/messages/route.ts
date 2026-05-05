import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";

// POST
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();

  // room.usersに自分が含まれるか確認
  const room = await prisma.room.findUnique({
    where: {
      id: body.roomId,
    },
    include: {
      users: true,
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const isMember = room.users.some((roomUser) => roomUser.id === user.id);

  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
