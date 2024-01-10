import { ComponentProps, memo } from 'react';
import { useRecoilValue } from 'recoil';
import { twMerge } from 'tailwind-merge';

import { h } from '@/components/HashAssets';
import { friendState, IProfile } from '@/state/profile';

interface Props {
  id: IProfile['id'];
  size?: 'default' | 'small' | 'large' | 'middle';
  toProfile?: boolean;
}

const SIZE_MAP = {
  small: 'h-9 w-9 rounded',
  default: 'h-10 w-10 rounded',
  middle: 'h-12 w-12 rounded',
  large: 'h-16 w-16 rounded-md',
};

const UserAvatar = ({ id, size = 'default', className, ...rest }: Props & Omit<ComponentProps<typeof h.img>, 'size'>) => {
  const { avatarInfo } = useRecoilValue(friendState(id));

  return <h.img src={avatarInfo} className={twMerge('object-cover object-center', SIZE_MAP[size as keyof typeof SIZE_MAP], className)} {...rest} />;
};

export default memo(UserAvatar);
