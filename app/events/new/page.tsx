import BackToTopLink from "@/app/components/BackToTopLink";
import EventCreateForm from "@/app/components/EventCreateForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EventNewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <main className="p-8">
      <BackToTopLink />
      <EventCreateForm />
    </main>
  );
}
