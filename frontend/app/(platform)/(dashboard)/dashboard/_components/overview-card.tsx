import { IconBadge } from '@/components/icon-badge';
import { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  icon: LucideIcon;
  label: string;
  totalItems: number;
  variant?: 'default' | 'success';
}

export const OverviewCard = ({ icon, label, totalItems = 0, variant }: OverviewCardProps) => {
  return (
    <div className="h-[120px] border rounded-md flex items-center justify-between gap-x-3 py-6 px-5 bg-white shadow-sm">
      <div className="block">
        <p className="font-medium mb-4">{label}</p>
        <p className="text-2xl text-sky-600 text-md font-semibold">{totalItems}</p>
      </div>
      <div className="block">
        <IconBadge variant={variant} icon={icon} />
      </div>
    </div>
  );
};
