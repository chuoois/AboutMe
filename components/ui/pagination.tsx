'use client';

import type { Pagination } from '@/types';

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function PaginationBar({ pagination, onPageChange, itemLabel = 'items' }: PaginationBarProps) {
  return (
    <div className="h-9 bg-[#f5f5f7] border-t border-black/10 flex items-center justify-between px-4 text-xs select-none shrink-0">
      <div className="text-[#86868b] font-mono">
        {pagination.total} {itemLabel} <span className="text-gray-300">|</span> {pagination.limit} per page
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-[#86868b]">Page {pagination.page} of {pagination.totalPages}</span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent text-[#1d1d1f] transition-colors"
            >
              <i className='bx bx-chevron-left text-lg' />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent text-[#1d1d1f] transition-colors"
            >
              <i className='bx bx-chevron-right text-lg' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
