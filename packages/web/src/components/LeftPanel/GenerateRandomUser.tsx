import { DeleteOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import { getRecoil } from 'recoil-nexus';

import { quickAddFakeUser, removeFakeUsers } from '@/faker/wechat/user';
import { friendsIdsState } from '@/state/profile';

const GenerateRandomUser = () => {
  const { message, modal } = App.useApp();

  return (
    <Button.Group>
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
        + 50
      </Button>
      <Button
        onClick={() => {
          modal.confirm({
            title: '删除所有随机添加好友',
            content: '确定删除所有随机添加好友？',
            onOk: () => {
              removeFakeUsers();
              message.success('删除成功');
            },
          });
        }}
        danger
        icon={<DeleteOutlined />}
      ></Button>
    </Button.Group>
  );
};

export default GenerateRandomUser;
