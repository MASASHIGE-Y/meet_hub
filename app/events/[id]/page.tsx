import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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
    },
  });

  if (!event) {
    notFound();
  }

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
    </main>
  );
}
