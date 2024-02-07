import { App, Button } from 'antd';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { exportDBById } from '@/dataSource';
import { deleteDataSource, uploadDataSource } from '@/services';
import { dataSourceListState, IDataSourceItem } from '@/state/globalConfig';

type Props = {
  record: IDataSourceItem;
};

const ShareOperation = ({ record }: Props) => {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const setDataSourceList = useSetRecoilState(dataSourceListState);

  const { shareKey, shareId, id } = record;
  const shared = !!shareKey;

  const deleteShare = async () => {
    if (!shareId) return;
    try {
      await deleteDataSource(shareId);
      setDataSourceList((prev) => prev.map((item) => (item.id === record.id ? { ...item, shareId: undefined, shareKey: undefined } : item)));
      message.success('取消分享成功');
    } catch (err) {
      console.error(err);
      message.error('取消分享失败');
    }
  };

  const createShare = async () => {
    const file = await exportDBById(id);
    try {
      const res = await uploadDataSource({
        data: localStorage.getItem(id) ?? '{}',
        file,
      });
      const { shareKey, shareId } = res.data;
      setDataSourceList((prev) => prev.map((item) => (item.id === id ? { ...item, shareKey, shareId } : item)));
      message.success('分享成功');
    } catch (err) {
      console.error(err);
      message.error('分享失败');
    }
  };

  const handleClick = async () => {
    setLoading(true);
    if (shared) {
      await deleteShare();
    } else {
      await createShare();
    }
    setLoading(false);
  };

  return (
    <Button type="link" loading={loading} className="px-2 py-1" onClick={handleClick}>
      {shared ? '取消分享' : '分享'}
    </Button>
  );
};

export default ShareOperation;
