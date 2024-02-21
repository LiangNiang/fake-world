import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { addFakeUser, MYSELF_ID, quickAddFakeUser } from '@/faker/wechat/user';
import { dialogueListState } from '@/state/dialogueState';
import { friendsIdsState, friendState, IProfile } from '@/state/profile';

type Props = SelectProps<IProfile['id'] | IProfile['id'][]> & {
  /** 是否过滤对话列表已经存在的对话 */
  filterExisting?: boolean;
  /** 是否在下拉菜单显示快速新建好友菜单 */
  withQuickAdd?: boolean;
  /** 是否在选项里包含自己 */
  withMyself?: boolean;
};

export const FriendItem = ({ id, className }: { id: IProfile['id']; className?: string }) => {
  const { nickname, wechat, remark } = useRecoilValue(friendState(id));
  return <div className={className}>{`${remark ?? nickname}（${wechat}）`}</div>;
};

const FriendSelect = ({ value, onChange, filterExisting, withQuickAdd, withMyself, ...rest }: Props) => {
  const [quickAddNickname, setQuickAddNickname] = useState('');
  const friendIds = useRecoilValue(friendsIdsState);
  const usedIds = [...friendIds];
  if (!withMyself) {
    usedIds.splice(friendIds.indexOf(MYSELF_ID), 1);
  }
  const existingFriends = useRecoilValue(dialogueListState).map((v) => v.friendId);
  const selectOptions: DefaultOptionType[] = usedIds.map((friend) => ({
    label: <FriendItem id={friend} />,
    value: friend,
    disabled: filterExisting && existingFriends.includes(friend),
  }));

  const quickAddFriend = () => {
    if (!quickAddNickname) return;
    addFakeUser({ nickname: quickAddNickname });
    setQuickAddNickname('');
  };

  return (
    <Select
      options={selectOptions}
      value={value}
      onChange={onChange}
      dropdownRender={
        withQuickAdd
          ? (menu) => (
              <>
                {menu}
                <Divider className="my-2" />
                <div className="flex justify-between px-1 pb-2">
                  <Input
                    value={quickAddNickname}
                    placeholder="好友昵称"
                    onChange={(ev) => setQuickAddNickname(ev.target.value)}
                    onKeyDown={(ev) => {
                      ev.stopPropagation();
                      if (ev.key === 'Enter') {
                        quickAddFriend();
                      }
                    }}
                  />
                  <Button type="text" icon={<PlusCircleOutlined />} onClick={quickAddFriend}>
                    快速增加好友
                  </Button>
                  <Button
                    type="text"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      quickAddFakeUser();
                    }}
                  >
                    快速增加20个好友
                  </Button>
                </div>
              </>
            )
          : undefined
      }
      {...rest}
    />
  );
};

export default FriendSelect;
