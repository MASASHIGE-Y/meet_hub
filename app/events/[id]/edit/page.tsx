import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPage({ params }: Props) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) return notFound();

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">イベント編集</h1>
      <EditForm event={event} />
    </main>
  );
}
