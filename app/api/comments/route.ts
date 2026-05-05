import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unquthorized", { status: 401 });
  }

  const { content, eventId } = await req.json();

  const user = await findUserByEmail(session.user.email);

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      eventId,
      userId: user.id,
    },
  });

  return Response.json(comment);
}
