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

export async function getEventDetailById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      creator: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      participations: {
        include: { user: true },
      },
    },
  });
}

export async function getCreatedEventsByUserId(userId: string) {
  return prisma.event.findMany({
    where: {
      creatorId: userId,
    },
  });
}

export async function getParticipatedEventsByUserId(userId: string) {
  return prisma.event.findMany({
    where: {
      participations: {
        some: {
          userId,
        },
      },
    },
  });
}

export async function getBookmarkedEventsByUserId(userId: string) {
  return prisma.event.findMany({
    where: {
      bookmark: {
        some: {
          userId,
        },
      },
    },
  });
}

export async function getCommentedEventsByUserId(userId: string) {
  return prisma.event.findMany({
    where: {
      comments: {
        some: {
          userId,
        },
      },
    },
  });
}

import { Prisma } from "@prisma/client";

export async function getEvents({
  where,
  currentPage,
  pageSize,
}: {
  where?: Prisma.EventWhereInput;
  currentPage: number;
  pageSize: number;
}) {
  return prisma.event.findMany({
    where,
    include: {
      creator: true,
      participations: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
}
