import { SidebarRoutes } from './sidebar-routes';

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="h-[65px] flex items-center justify-center px-6 border-b">
        <div className="text-2xl font-semibold text-neutral-700">MERN App</div>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
