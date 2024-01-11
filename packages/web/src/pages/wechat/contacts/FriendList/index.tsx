import { MYSELF_ID } from '@/faker/wechat/user';
import { MetaDataType } from '@/state/detectedNode';
import { TNeedGroupDataItem } from '@/state/profile';
import UserAvatar from '@/wechatComponents/User/UserAvatar';
import UserName from '@/wechatComponents/User/UserName';

import { UniversalList } from './UniversalComponent';

type Props = {
  data: TNeedGroupDataItem[];
};

const FriendList = ({ data }: Props) => {
  return (
    <UniversalList>
      {data.map(({ id, name }) => (
        <UniversalList.CanBeDetectedItem
          metaData={
            id === MYSELF_ID
              ? {
                  type: MetaDataType.MyProfile,
                  treeItemDisplayName: '我自己',
                }
              : {
                  type: MetaDataType.FirendProfile,
                  index: id,
                  treeItemDisplayName: () => `好友（${name}）`,
                }
          }
          textPrev={<UserAvatar size="small" id={id} className="mr-3" />}
          key={id}
        >
          <UserName id={id} className="text-black" />
        </UniversalList.CanBeDetectedItem>
      ))}
    </UniversalList>
  );
};

export default FriendList;
