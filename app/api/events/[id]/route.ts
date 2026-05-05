import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import z from "zod";

const updateEventSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().max(140, "説明は140文字以内で入力してください"),
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  await prisma.event.delete({
    where: {
      id,
      creatorId: user.id, // 自分のだけ消す
    },
  });

  return NextResponse.json({ message: "Deleted" });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("PATCH API called");

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

  const body = await req.json();

  const result = updateEventSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 },
    );
  }

  const { title, description } = result.data;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.creatorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
    },
  });

  return NextResponse.json(updatedEvent);
}
