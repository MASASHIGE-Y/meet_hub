import { prisma } from "../lib/prisma";

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: "seed-user1@example.com" },
    update: {},
    create: {
      name: "Seed User 1",
      email: "seed-user1@example.com",
      isOnboarded: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "seed-user2@example.com" },
    update: {},
    create: {
      name: "Seed User 2",
      email: "seed-user2@example.com",
      isOnboarded: true,
    },
  });

  const loginUser = await prisma.user.upsert({
    where: { email: "da12ran2berl8.remuni38@gmail.com" },
    update: {},
    create: {
      name: "Masashige",
      email: "da12ran2berl8.remuni38@gmail.com",
      isOnboarded: true,
    },
  });

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: user1.id,
        followingId: user2.id,
      },
    },
    update: {},
    create: {
      followerId: user1.id,
      followingId: user2.id,
    },
  });

  console.log("Seed done");

  const room = await prisma.room.create({
    data: {
      users: {
        connect: [{ id: loginUser.id }, { id: user1.id }],
      },
      messages: {
        create: [
          {
            content: "こんにちは！",
            senderId: loginUser.id,
          },
          {
            content: "こんにちは！よろしくお願いします！",
            senderId: user1.id,
          },
        ],
      },
    },
  });

  console.groupCollapsed("Seed room created:", room.id);

  await prisma.notification.create({
    data: {
      userId: loginUser.id,
      message: "テスト通知です！",
      isRead: false,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
