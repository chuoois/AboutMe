import dynamic from 'next/dynamic';

const SkillsManager = dynamic(
  () => import("@/components/dashboard-components/Skills-manager"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 rounded-full animate-spin border-gray-600 border-t-white" />
          <p className="text-gray-500 text-sm">Loading skills manager...</p>
        </div>
      </div>
    ),
  }
);

export default function SkillsManagerPage() {
  return <SkillsManager />;
}