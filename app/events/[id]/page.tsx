import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import EventDetailView from "./EventDetailView";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      creator: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      participations: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  // ログインユーザー取得
  const session = await getServerSession(authOptions);

  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
      })
    : null;

  // 参加済み判定
  const isParticipating = user
    ? event.participations.some(
        (participation: { user: { id: string } }) =>
          participation.user.id === user.id,
      )
    : false;

  // ブックマーク機能
  const bookmark = user
    ? await prisma.bookmark.findUnique({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId: event.id,
          },
        },
      })
    : null;

  const isBookmarked = !!bookmark;

  // フォロー機能
  const follow = user
    ? await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: event.creatorId,
          },
        },
      })
    : null;

  const isFollowingCreator = !!follow;

  return (
    <main className="p-8">
      <EventDetailView
        event={event}
        user={user}
        isParticipating={isParticipating}
        isBookmarked={isBookmarked}
        isFollowingCreator={isFollowingCreator}
      />
    </main>
  );
}
