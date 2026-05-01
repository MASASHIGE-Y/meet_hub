import Link from "next/link";

type Props = {
  tab?: string;
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ tab, currentPage, totalPages }: Props) {
  return (
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
  );
}
