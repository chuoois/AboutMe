export type Project = {
  id: number;
  title: string;
  icon: string | null;
  description: string;
  tags: string[];
  live_demo_url?: string | null;
  git_url?: string | null;
  color?: string;
  created_at?: string;
};
