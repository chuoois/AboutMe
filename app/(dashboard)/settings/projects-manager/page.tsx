import dynamic from 'next/dynamic';

// Dynamic import: Projects Manager is a heavy client component (500+ lines)
// Only loaded when the user navigates to this page
const ProjectManager = dynamic(
  () => import("@/components/dashboard-components/Projects-manager"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 rounded-full animate-spin border-gray-600 border-t-white" />
          <p className="text-gray-500 text-sm">Loading project manager...</p>
        </div>
      </div>
    ),
  }
);

export default function ProjectsManagerPage() {
  return <ProjectManager />;
}