import { App, Button } from 'antd';

import { quickAddFakeUser, removeFakeUsers } from '@/faker/wechat/user';

const QuickOperations = () => {
  const { message } = App.useApp();
  return (
    <div className="flex space-x-1">
      <Button
        onClick={() => {
          quickAddFakeUser(50);
          message.success('添加成功');
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
