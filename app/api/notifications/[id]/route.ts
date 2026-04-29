import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, { params }: Props) {
  const { id } = await params;

  const notification = await prisma.notification.update({
    where: { id },
    data: {
      isRead: true,
    },
  });

  return NextResponse.json(notification);
}
