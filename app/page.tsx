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
    <main className="p-8 space-y-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">meet_hub</h1>
        <AuthButton userId={user?.id} />
      </header>

      <section>
        <EventTabs tab={tab} />

        <h2 className="text-xl font-bold">
          {tab === "following" ? "フォロー中のイベント" : "おすすめイベント"}
        </h2>

        <EventList events={events} />

        <Pagination
          tab={tab}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </section>
    </main>
  );
}
