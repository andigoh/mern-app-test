import { ProfileBadge } from '@/components/profile-badge';
import { Button } from '@/components/ui/button';
import { FormPopover } from './form-popover';
import { IUser } from '@/middleware/auth';

interface ProfileFormProps {
  user: IUser['user'];
  token: string;
}

export const ProfileForm = ({ user, token }: ProfileFormProps) => {
  return (
    <div>
      <h2 className="text-black font-medium">Profile</h2>
      <div className="flex flex-row py-4 items-center gap-x-4">
        <ProfileBadge name={user?.name} src={user?.image ? user.image : '/assets/default-profile.png'} />
        <FormPopover sideOffset={10} value={user?.name} token={token}>
          <Button variant="transparent" className="text-sky-500 hover:underline">
            Change
          </Button>
        </FormPopover>
      </div>
    </div>
  );
};
