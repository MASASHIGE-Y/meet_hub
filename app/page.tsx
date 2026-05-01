import { prisma } from "@/lib/prisma";
import AuthButton from "./components/AuthButton";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EventCreateForm from "./components/EventCreateForm";

type Props = {
  searchParams: Promise<{
    tab?: string;
    page?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const { tab, page } = await searchParams;
  const session = await getServerSession(authOptions);

  const currentPage = Number(page ?? "1");
  const pageSize = 5;

  let user = null;

  if (session?.user?.email) {
    user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (user && !user.isOnboarded) {
      redirect("/register");
    }
  }

  const where =
    tab === "following" && user
      ? {
          creator: {
            followers: {
              some: {
                followerId: user.id,
              },
            },
          },
        }
      : undefined;

  const events = await prisma.event.findMany({
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

  const totalCount = await prisma.event.count({
    where,
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="p-8 space-y-6">
      <EventCreateForm />
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">meet_hub</h1>
        <AuthButton userId={user?.id} />
      </header>

      <section>
        <div className="mb-4 flex gap-2">
          <Link
            href="/"
            className={`rounded px-4 py-2 ${
              tab !== "following"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            おすすめ
          </Link>

          <Link
            href="/?tab=following"
            className={`rounded px-4 py-2 ${
              tab === "following"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            フォロー中
          </Link>
        </div>

        <h2 className="text-xl font-bold">
          {tab === "following" ? "フォロー中のイベント" : "おすすめイベント"}
        </h2>

        {events.length === 0 ? (
          <p className="mt-4">まだイベントはありません</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {events.map((event) => (
              <li key={event.id} className="rounded border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Link
                    href={`/users/${event.creator.id}`}
                    className="mb-2 flex items-center gap-2 hover:underline"
                  >
                    {event.creator.image && (
                      <img
                        src={event.creator.image}
                        alt={event.creator.name ?? "user avatar"}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span>{event.creator.name ?? "Unknown user"}</span>
                  </Link>
                </div>

                <Link href={`/events/${event.id}`}>
                  <h3 className="text-lg font-bold hover:underline cursor-pointer">
                    {event.title}
                  </h3>
                </Link>

                <p className="mt-1 text-sm">{event.description}</p>

                <p className="mt-2 text-sm text-gray-600">
                  日時:{" "}
                  {event.startAt
                    ? new Date(event.startAt).toLocaleString()
                    : "未設定"}{" "}
                  ~{" "}
                  {event.endAt
                    ? new Date(event.endAt).toLocaleString()
                    : "未設定"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  場所: {event.location ?? "未設定"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  参加人数: {event.participations.length} /{" "}
                  {event.capacity ?? "未設定"}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex gap-2">
          {currentPage > 1 && (
            <Link
              href={`/?${tab === "following" ? "tab=following&" : ""}page=${
                currentPage - 1
              }`}
              className="rounded bg-gray-200 px-4 py-2 text-black"
            >
              前へ
            </Link>
          )}

          <span className="px-4 py-2">
            {currentPage} / {totalPages || 1}
          </span>

          {currentPage < totalPages && (
            <Link
              href={`/?${tab === "following" ? "tab=following&" : ""}page=${
                currentPage + 1
              }`}
              className="rounded bg-gray-200 px-4 py-2 text-black"
            >
              次へ
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
