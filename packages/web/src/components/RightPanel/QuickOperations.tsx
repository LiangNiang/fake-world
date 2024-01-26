import { App, Button } from 'antd';
import { getRecoil } from 'recoil-nexus';

import { quickAddFakeUser, removeFakeUsers } from '@/faker/wechat/user';
import { friendsIdsState } from '@/state/profile';

const QuickOperations = () => {
  const { message } = App.useApp();
  return (
    <div className="flex space-x-1">
      <Button
        onClick={() => {
          requestIdleCallback(() => {
            if (getRecoil(friendsIdsState).length > 300) {
              message.error('好友数量超出限制，可在底部修改好友数量显示');
              return;
            }
            quickAddFakeUser(50);
            message.success('添加成功');
          });
        }}
      >
        随机添加50个好友
      </Button>
      <Button
        onClick={() => {
          removeFakeUsers();
          message.success('删除成功');
        }}
      >
        删除所有随机添加好友
      </Button>
    </div>
  );
};

export default QuickOperations;
