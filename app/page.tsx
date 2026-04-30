import { prisma } from "@/lib/prisma";
import AuthButton from "./components/AuthButton";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (user && !user.isOnboarded) {
      redirect("/register");
    }
  }
  const events = await prisma.event.findMany({
    include: {
      creator: true,
    },
  });

  return (
    <main className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">meet_hub</h1>
        <AuthButton />
      </header>

      <section>
        <h2 className="text-xl font-bold">おすすめイベント</h2>

        {events.length === 0 ? (
          <p className="mt-4">まだイベントはありません</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {events.map((event) => (
              <li key={event.id} className="rounded border p-4">
                <div className="mb-2 flex items-center gap-2">
                  {event.creator.image && (
                    <img
                      src={event.creator.image}
                      alt={event.creator.name ?? "user avatar"}
                      className="h-8 w-8 rounded-full"
                    />
                  )}

                  <Link href={`/users/${event.creator.id}`}>
                    <span className="font-semibold hover:underline cursor-pointer">
                      {event.creator.name ?? "Unknown user"}
                    </span>
                  </Link>
                </div>

                <Link href={`/events/${event.id}`}>
                  <h3 className="text-lg font-bold hover:underline cursor-pointer">
                    {event.title}
                  </h3>
                </Link>

                <p className="mt-1 text-sm">{event.description}</p>

                <p className="mt-2 text-sm text-gray-600">
                  {event.date.toDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
