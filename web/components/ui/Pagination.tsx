import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageCount: number;
  from: number; // premier élément affiché (1-based)
  to: number; // dernier élément affiché
  total: number;
  onPageChange: (page: number) => void;
}

const buttonBase =
  'flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors';

export default function Pagination({
  page,
  pageCount,
  from,
  to,
  total,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-[#667085]">
        {from}–{to} sur {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Page précédente"
          className={`${buttonBase} bg-[#F6F7F9] text-[#172033] hover:bg-[#EFE9FC] disabled:pointer-events-none disabled:opacity-40`}
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map(
          (number) => (
            <button
              key={number}
              type="button"
              onClick={() => onPageChange(number)}
              aria-label={`Page ${number}`}
              aria-current={number === page ? 'page' : undefined}
              className={`${buttonBase} ${
                number === page
                  ? 'bg-[#172033] text-white'
                  : 'bg-[#F6F7F9] text-[#172033] hover:bg-[#EFE9FC]'
              }`}
            >
              {number}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Page suivante"
          className={`${buttonBase} bg-[#F6F7F9] text-[#172033] hover:bg-[#EFE9FC] disabled:pointer-events-none disabled:opacity-40`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}
