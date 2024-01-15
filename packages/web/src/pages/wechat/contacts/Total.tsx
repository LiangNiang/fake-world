import { memo } from 'react';
import { useRecoilValue } from 'recoil';

import { friendsIdsState } from '@/state/profile';

const Total = () => {
  const allFriends = useRecoilValue(friendsIdsState);
  return <div className="my-3 flex items-center justify-center text-black/60">{allFriends.length - 1} 个朋友</div>;
};

export default memo(Total);
