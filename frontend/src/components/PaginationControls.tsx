import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  currentPageIndex: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
}

export default function PaginationControls({
  currentPageIndex,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (currentPageIndex <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages - 1);
      } else if (currentPageIndex >= totalPages - 4) {
        pages.push('ellipsis');
        for (let i = totalPages - 5; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('ellipsis');
        for (let i = currentPageIndex - 1; i <= currentPageIndex + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {pageNumbers.map((pageNum, idx) => {
        if (pageNum === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="text-retro-amber retro-heading text-xl px-2"
            >
              ...
            </span>
          );
        }

        const isActive = pageNum === currentPageIndex;

        return (
          <Button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={isActive}
            variant="outline"
            className={`
              min-w-[3rem] h-12 px-4
              border-3 retro-subheading transition-all
              ${
                isActive
                  ? 'bg-retro-magenta border-retro-magenta text-white retro-glow-magenta'
                  : 'bg-card/90 border-retro-teal text-retro-teal hover:bg-retro-teal/20 hover:text-retro-magenta hover:border-retro-magenta'
              }
              disabled:opacity-100
            `}
          >
            {pageNum + 1}
          </Button>
        );
      })}
    </div>
  );
}
