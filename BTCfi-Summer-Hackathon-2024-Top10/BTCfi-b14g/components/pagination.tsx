import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const createPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      // show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }

    return pageNumbers;
  };

  const pageNumbers = createPageNumbers();

  return (
    <Pagination className="mt-4">
      <PaginationContent
        className={cn({
          'cursor-pointer': currentPage !== 1,
        })}
      >
        <PaginationItem onClick={() => handlePageChange(currentPage - 1)}>
          <PaginationPrevious />
        </PaginationItem>
        {pageNumbers.map((page, index) => (
          <PaginationItem key={`Page-${index}`}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => {
                  if (currentPage === page) return;
                  handlePageChange(+page);
                }}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem
          onClick={() => handlePageChange(currentPage + 1)}
          className={cn({
            'cursor-pointer': currentPage !== totalPages,
          })}
        >
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
