'use client';

import { Layout, Settings } from 'lucide-react';
import { SidebarItem } from './sidebar-item';

const routes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: Settings,
    label: 'Account Settings',
    href: '/account',
  },
];

export const SidebarRoutes = () => {
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
      ))}
    </div>
  );
};
