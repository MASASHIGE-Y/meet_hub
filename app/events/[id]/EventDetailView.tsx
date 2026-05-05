import CommentForm from "./CommentForm";
import ParticipationButton from "./ParticipationButton";
import BookmarkButton from "./BookmarkButton";
import FollowButton from "@/app/users/[id]/FollowButton";
import DmButton from "@/app/users/[id]/DmButton";
import Link from "next/link";
import Image from "next/image";
type User = {
  id: string;
  name: string | null;
  image: string | null;
};

type EventWithRelations = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: string | null;
  capacity: number | null;
  startAt: Date | null;
  endAt: Date | null;
  creatorId: string;
  creator: User;
  comments: {
    id: string;
    content: string;
    user: User;
  }[];
  participations: {
    id: string;
    user: User;
  }[];
};

type Props = {
  event: EventWithRelations;
  user: User | null;
  isParticipating: boolean;
  isBookmarked: boolean;
  isFollowingCreator: boolean;
};

export default function EventDetailView({
  event,
  user,
  isParticipating,
  isBookmarked,
  isFollowingCreator,
}: Props) {
  return (
    <>
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          ← トップへ戻る
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">{event.title}</h1>

      <Link
        href={`/users/${event.creator.id}`}
        className="mt-4 flex items-center gap-2 hover:underline"
      >
        {event.creator.image && (
          <Image
            src={event.creator.image}
            alt={event.creator.name ?? "user avatar"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span>{event.creator.name ?? "Unknown user"}</span>
      </Link>

      {user?.id !== event.creatorId && (
        <>
          <FollowButton
            userId={event.creatorId}
            isFollowing={isFollowingCreator}
          />

          <DmButton userId={event.creatorId} />
        </>
      )}

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

      <h2 className="mt-8 text-xl font-bold">参加者</h2>

      <ul className="mt-4 space-y-2">
        {event.participations.length === 0 ? (
          <p>参加者はまだいません</p>
        ) : (
          event.participations.map((participation) => (
            <li key={participation.id} className="flex items-center gap-2">
              {participation.user.image && (
                <Image
                  src={participation.user.image}
                  alt={participation.user.name ?? "user avatar"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span>{participation.user.name ?? "Unknown user"}</span>
            </li>
          ))
        )}
      </ul>

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
    </>
  );
}
