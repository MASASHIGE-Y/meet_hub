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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
