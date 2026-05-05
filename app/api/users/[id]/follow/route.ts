import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// POST/フォロー
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

  // フォロー対象ユーザー取得
  const targetUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 自分自身チェック
  if (targetUser.id === user.id) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 },
    );
  }

  await prisma.follow.create({
    data: {
      followerId: user.id,
      followingId: id,
    },
  });

  return NextResponse.json({ message: "Followed" });
}

// DELETE/フォロー解除
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

  // フォロー対象ユーザー取得
  const targetUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: id,
      },
    },
  });

  return NextResponse.json({ message: "Unfollowed" });
}
