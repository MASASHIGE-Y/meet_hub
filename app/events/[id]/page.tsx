import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CommentForm from "./CommentForm";
import ParticipationButton from "./ParticipationButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BookmarkButton from "./BookmarkButton";

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
    ? event.participations.some((p) => p.user.id === user.id)
    : false;

<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">{event.title}</h1>

      <div className="mt-4 flex items-center gap-2">
        {event.creator.image && (
          <img
            src={event.creator.image}
            alt={event.creator.name ?? "user avatar"}
            className="h-8 w-8 rounded-full"
          />
        )}
        <span>{event.creator.name}</span>
      </div>

      <p className="mt-4">{event.description}</p>

      <p className="mt-4 text-gray-600">{event.date.toDateString()}</p>

      <p className="mt-4">場所: {event.location ?? "未設定"}</p>
      <p className="mt-2">定員: {event.capacity ?? "未設定"}</p>

      <p className="mt-2">
        開始:{" "}
        {event.startAt ? new Date(event.startAt).toLocaleString() : "未設定"}
      </p>

      <p className="mt-2">
        終了: {event.endAt ? new Date(event.endAt).toLocaleString() : "未設定"}
      </p>

      <ParticipationButton
        eventId={event.id}
        isParticipating={isParticipating}
      />

      <BookmarkButton eventId={event.id} isBookmarked={isBookmarked} />

      <h2 className="mt-8 text-xl font-bold">コメント</h2>

      <CommentForm eventId={event.id} />

      <ul className="mt-4 space-y-2">
        {event.comments.map((comment) => (
          <li key={comment.id} className="border p-2 rounded">
            <p className="text-sm text-gray-500">{comment.user.name}</p>
            <p>{comment.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
