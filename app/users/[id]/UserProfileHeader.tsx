type Props = {
  profileUser: {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    birthDate: Date | null;
  };
  currentUser: {
    id: string;
  } | null;
  isFollowing: boolean;
};

import FollowButton from "./FollowButton";
import DmButton from "./DmButton";
import Link from "next/link";
import BackToTopLink from "@/app/components/BackToTopLink";

export default function UserProfileHeader({
  profileUser,
  currentUser,
  isFollowing,
}: Props) {
  return (
    <div>
      <BackToTopLink />
      <h1 className="text-2xl font-bold">{profileUser.name}</h1>

      {profileUser.image && (
        <img
          src={profileUser.image}
          alt={profileUser.name ?? "user avatar"}
          className="w-16 h-16 rounded-full mt-4"
        />
      )}

      {profileUser.birthDate && (
        <p className="text-sm text-gray-500 mt-2">
          生年月日：{new Date(profileUser.birthDate).toLocaleDateString()}
        </p>
      )}

      <p className="mt-4">{profileUser.bio}</p>

      {currentUser?.id === profileUser.id && (
        <Link
          href="/profile/edit"
          className="mt-2 inline-block rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
        >
          プロフィール編集
        </Link>
      )}

      {currentUser?.id !== profileUser.id && (
        <div className="mt-2 flex gap-2">
          <FollowButton userId={profileUser.id} isFollowing={isFollowing} />
          <DmButton userId={profileUser.id} />
        </div>
      )}
    </div>
  );
}
