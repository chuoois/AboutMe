export interface AppItem {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
  link: string;
}

export const DOCK_APPS: AppItem[] = [
  { id: 'home', label: 'Home', icon: 'bxs-home', colorClass: 'from-blue-400 to-blue-600', link: '/' },
  { id: 'projects', label: 'Projects', icon: 'bxs-folder-open', colorClass: 'from-green-400 to-emerald-500', link: '/projects' },
  { id: 'skills', label: 'Skills', icon: 'bxs-graduation', colorClass: 'from-purple-500 to-indigo-600', link: '/skills' },
  { id: 'certification', label: 'Certification', icon: 'bxs-certification', colorClass: 'from-red-500 to-pink-600', link: '/certification' },
  { id: 'github', label: 'GitHub', icon: 'bxl-github', colorClass: 'from-gray-600 to-slate-800', link: 'https://github.com/chuoois' },
  { id: 'settings', label: 'Settings', icon: 'bxs-cog', colorClass: 'from-yellow-400 to-orange-500', link: '/settings' },
];

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  link: string;
}

export const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: 'projects',
    label: 'Projects',
    icon: 'bxs-folder-open',
    color: 'bg-gradient-to-br from-green-400 to-emerald-500',
    link: '/settings/projects-manager',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: 'bxs-graduation',
    color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    link: '/settings/skills-manager',
  },
  {
    id: 'certification',
    label: 'Certifications',
    icon: 'bxs-certification',
    color: 'bg-gradient-to-br from-red-500 to-pink-600',
    link: '/settings/certifications-manager',
  },
];
