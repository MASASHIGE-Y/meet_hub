import { prisma } from "@/lib/prisma";

export async function getEventsByUserId(userId: string) {
  return prisma.event.findMany({
    where: {
      creatorId: userId,
    },
    include: {
      bookmark: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
