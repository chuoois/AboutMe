'use client';

import type { Pagination } from '@/types';

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function PaginationBar({ pagination, onPageChange, itemLabel = 'items' }: PaginationBarProps) {
  return (
    <div className="h-9 bg-[#252525] border-t border-white/10 flex items-center justify-between px-4 text-xs select-none shrink-0">
      <div className="text-gray-500 font-mono">
        {pagination.total} {itemLabel} <span className="text-gray-700">|</span> {pagination.limit} per page
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
            >
              <i className='bx bx-chevron-left text-lg' />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
            >
              <i className='bx bx-chevron-right text-lg' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
