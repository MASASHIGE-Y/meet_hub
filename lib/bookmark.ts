import { prisma } from "@/lib/prisma";

export async function getBookmarksByUserId(userId: string) {
  return prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
