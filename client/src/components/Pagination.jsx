export default function Pagination({ currentPage, totalPages, onPageChange, previousPage, nextPage }) {
  if (!nextPage && !previousPage) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-10  ">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!previousPage}
        className="px-4 py-2 rounded-lg border border-blue-200 text-sm font-medium text-gray-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>

      <span className="px-4 py-2 font-medium text-gray-600">
        {currentPage} of {totalPages}{" "}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!nextPage}
        className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
}
