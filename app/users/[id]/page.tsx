import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import FollowButton from "./FollowButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  const profileUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!profileUser) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
      })
    : null;

  const follow = currentUser
    ? await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: profileUser.id,
          },
        },
      })
    : null;

  const isFollowing = !!follow;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{profileUser.name}</h1>

      {profileUser.image && (
        <img
          src={profileUser.image}
          alt={profileUser.name ?? "user avatar"}
          className="h-16 w-16 rounded-full mt-4"
        />
      )}

      <p className="mt-4">{profileUser.bio}</p>

      {currentUser?.id !== profileUser.id && (
        <FollowButton userId={profileUser.id} isFollowing={isFollowing} />
      )}
    </main>
  );
}
