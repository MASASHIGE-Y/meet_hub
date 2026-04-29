import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// POST
export async function POST(req: Request, { params }: Props) {
  const { id } = await params;

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

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const participation = await prisma.participation.create({
    data: {
      userId: user.id,
      eventId: id,
    },
  });

  if (event.creatorId !== user.id) {
    await prisma.notification.create({
      data: {
        userId: event.creatorId,
        message: `${user.name}さんがあなたのイベントに参加しました`,
        isRead: false,
      },
    });
  }

  return NextResponse.json(participation);
}

// DELETE
export async function DELETE(req: Request, { params }: Props) {
  const { id } = await params;

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

  await prisma.participation.delete({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId: id,
      },
    },
  });

  return NextResponse.json({ message: "Participation deleted" });
}
