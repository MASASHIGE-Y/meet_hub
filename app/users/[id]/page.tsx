import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import UserEventList from "./UserEventList";
import UserProfileTabs from "./UserProfileTabs";
import UserProfileHeader from "./UserProfileHeader";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function UserProfilePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab } = await searchParams;

  const profileUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!profileUser) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
      })
    : null;

  const follow = currentUser
    ? await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: profileUser.id,
          },
        },
      })
    : null;

  const isFollowing = !!follow;

  const currentTab = tab ?? "created";

  const createdEvents = await prisma.event.findMany({
    where: { creatorId: profileUser.id },
  });

  const participatedEvents = await prisma.event.findMany({
    where: {
      participations: {
        some: { userId: profileUser.id },
      },
    },
  });

  const bookmarkedEvents = await prisma.event.findMany({
    where: {
      bookmark: {
        some: { userId: profileUser.id },
      },
    },
  });

  const commentedEvents = await prisma.event.findMany({
    where: {
      comments: {
        some: { userId: profileUser.id },
      },
    },
  });

  return (
    <main className="p-8">
      <UserProfileHeader
        profileUser={profileUser}
        currentUser={currentUser}
        isFollowing={isFollowing}
      />

      <UserProfileTabs userId={id} currentTab={currentTab} />

      {currentTab === "created" && <UserEventList events={createdEvents} />}
      {currentTab === "participated" && (
        <UserEventList events={participatedEvents} />
      )}
      {currentTab === "bookmark" && <UserEventList events={bookmarkedEvents} />}
      {currentTab === "comments" && <UserEventList events={commentedEvents} />}
    </main>
  );
}
