import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { usePagination } from "@/hooks/use-pagination"
import { Link } from "@inertiajs/react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  paginationItemsToDisplay?: number
}

export default function CardsPagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  })

  return (
    <nav className="flex  w-full justify-between mt-8">
        <Link
            href="#"
            className="text-sm font-medium text-gray-800 hover:text-gray-600"
            >
            View All
        </Link>
      <ul className="flex items-center space-x-1">
        <li>
          <button
            className={`flex items-center justify-center w-8 h-8  transition-colors `}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
        </li>

        {/* Left ellipsis */}
        {showLeftEllipsis && (
          <li className="px-2 text-gray-400">
            <span>...</span>
          </li>
        )}

        {/* Page numbers */}
        {pages.map((page) => (
          <li key={page}>
            <button
              className={`flex items-center justify-center w-8 h-8  text-sm font-medium transition-colors `}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Right ellipsis */}
        {showRightEllipsis && (
          <li className="px-2 text-gray-400">
            <span>...</span>
          </li>
        )}

        {/* Next button */}
        <li>
          <button
            className={`flex items-center justify-center w-8 h-8  transition-colors `}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
