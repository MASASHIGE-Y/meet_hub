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

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { userId } = await req.json();

  // 既存ルームを探す
  const existingRoom = await prisma.room.findFirst({
    where: {
      users: {
        every: {
          id: {
            in: [currentUser.id, userId],
          },
        },
      },
    },
    include: {
      users: true,
    },
  });

  if (existingRoom) {
    return NextResponse.json({ roomId: existingRoom.id });
  }

  // 新規作成
  const room = await prisma.room.create({
    data: {
      users: {
        connect: [{ id: currentUser.id }, { id: userId }],
      },
    },
  });

  return NextResponse.json({ roomId: room.id });
}
