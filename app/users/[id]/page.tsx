import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import UserEventList from "./UserEventList";
import UserProfileTabs from "./UserProfileTabs";
import UserProfileHeader from "./UserProfileHeader";
import { authOptions } from "@/lib/auth";
import {
  getBookmarkedEventsByUserId,
  getCommentedEventsByUserId,
  getCreatedEventsByUserId,
  getParticipatedEventsByUserId,
} from "@/lib/event";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

type UserProfileTab = "created" | "participated" | "bookmark" | "comments";

const tabs: UserProfileTab[] = [
  "created",
  "participated",
  "bookmark",
  "comments",
];

export default async function UserProfilePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab } = await searchParams;

  const currentTab: UserProfileTab = tabs.includes(tab as UserProfileTab)
    ? (tab as UserProfileTab)
    : "created";

  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];

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

  if (currentTab === "created") {
    events = await getCreatedEventsByUserId(profileUser.id);
  }

  if (currentTab === "participated") {
    events = await getParticipatedEventsByUserId(profileUser.id);
  }

  if (currentTab === "bookmark") {
    events = await getBookmarkedEventsByUserId(profileUser.id);
  }

  if (currentTab === "comments") {
    events = await getCommentedEventsByUserId(profileUser.id);
  }

  return (
    <main className="p-8">
      <UserProfileHeader
        profileUser={profileUser}
        currentUser={currentUser}
        isFollowing={isFollowing}
      />

      <UserProfileTabs userId={id} currentTab={currentTab} />

      <UserEventList events={events} />
    </main>
  );
}
