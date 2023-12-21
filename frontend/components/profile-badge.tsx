import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ProfileBadgeProps {
  src: string;
  name: string;
}

export const ProfileBadge = ({ src, name }: ProfileBadgeProps) => {
  return (
    <div className="flex flex-row items-center">
      <Avatar>
        <AvatarImage src={src ? src : '/assets/default-profile.png'} alt={name} />
        <AvatarFallback>
          <AvatarImage src="/assets/default-profile.png" alt={name} />
        </AvatarFallback>
      </Avatar>
      <p className="font-medium ml-3">{name}</p>
    </div>
  );
};
