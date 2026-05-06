export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 rounded-full animate-spin border-gray-600 border-t-white" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
