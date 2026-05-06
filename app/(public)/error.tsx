'use client';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md rounded-mac-window bg-mac-dark-window/90 backdrop-blur-mac border border-mac-dark-border shadow-mac-window-dark p-8 text-center">
        <i className="bx bx-error-circle text-6xl text-red-400 mb-4 block" />
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-gray-400 text-sm mb-6">{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-95"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}
