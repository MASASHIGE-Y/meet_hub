import { prisma } from "@/lib/prisma";
import AuthButton from "./components/AuthButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EventTabs from "./components/EventTabs";
import Pagination from "./components/Pagination";
import EventList from "./components/EventList";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";
import { getEvents } from "@/lib/event";

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
    user = await findUserByEmail(session.user.email);

    if (user && !user.isOnboarded) {
      redirect("/register");
    }
  }

  let where = undefined;

  if (tab === "following" && user) {
    where = {
      creator: {
        followers: {
          some: {
            followerId: user.id,
          },
        },
      },
    };
  }

  const events = await getEvents({
    where,
    currentPage,
    pageSize,
  });

  const totalCount = await prisma.event.count({
    where,
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-blue-600">meet_hub</p>

            <h1 className="text-3xl font-bold text-slate-900">
              イベントで人とつながる
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              勉強会・交流会・プロジェクトのイベントを見つけよう
            </p>
          </div>

          <AuthButton userId={user?.id} />
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <EventTabs tab={tab} />

          <h2 className="mt-6 mb-4 text-xl font-bold text-slate-800">
            {tab === "following" ? "フォロー中のイベント" : "おすすめイベント"}
          </h2>

          <EventList events={events} />

          <div className="mt-8">
            <Pagination
              tab={tab}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
