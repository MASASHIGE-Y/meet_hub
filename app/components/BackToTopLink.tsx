import Link from "next/link";

export default function BackToTopLink() {
  return (
    <div className="mb-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:underline"
      >
        ← トップへ戻る
      </Link>
    </div>
  );
}
