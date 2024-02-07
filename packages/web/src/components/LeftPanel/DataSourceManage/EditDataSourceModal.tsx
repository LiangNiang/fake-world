import { CheckOutlined, CopyOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { App, Button, Input, InputRef, Modal } from 'antd';
import copy from 'copy-to-clipboard';
import { saveAs } from 'file-saver';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { exportDBById } from '@/dataSource';
import { DATA_SOURCE_TYPE_LABEL, dataSourceListState, IDataSourceItem } from '@/state/globalConfig';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  dataSourceId: IDataSourceItem['id'];
};

const EditDataSourceModal = ({ open, setOpen, dataSourceId }: Props) => {
  const [dataSourceList, setDataSourceList] = useRecoilState(dataSourceListState);
  const { id, name, type } = dataSourceList.find((v) => v.id === dataSourceId)!;
  const { message } = App.useApp();
  const [isEditName, setIsEditName] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const isLocal = type === 'local';

  return (
    <Modal open={open} maskClosable onCancel={() => setOpen(false)} okButtonProps={{ hidden: true }} title="编辑数据源">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span>ID: {id}</span>
          <Button
            icon={<CopyOutlined />}
            onClick={() => {
              copy(id);
              message.success('已将 ID 复制到剪贴板');
            }}
            type="text"
          />
        </div>
        <div>类型：{DATA_SOURCE_TYPE_LABEL[type]}</div>

        <div className="grid grid-cols-2 items-center gap-3">
          {isLocal && (
            <div className="flex flex-nowrap items-center space-x-1">
              <div className="flex items-center">
                <span className="shrink-0">名字：</span>
                {isEditName ? <Input ref={inputRef} defaultValue={name} className="inline-block" /> : <span>{name}</span>}
              </div>
              <Button
                icon={isEditName ? <CheckOutlined /> : <EditOutlined />}
                type="text"
                onClick={() => {
                  if (isEditName) {
                    const value = inputRef.current?.input?.value ?? '';
                    setDataSourceList((prev) => prev.map((item) => (item.id === id ? { ...item, name: value } : item)));
                    setIsEditName(false);
                  } else {
                    setIsEditName(true);
                    setTimeout(() => {
                      inputRef.current?.focus();
                    });
                  }
                }}
              />
            </div>
          )}
          <div>
            数据库：
            <Button
              icon={<DownloadOutlined />}
              type="text"
              onClick={() => {
                exportDBById(id)
                  .then((file) => {
                    if (file === null) throw new Error('数据库为空，无需导出');
                    saveAs(file, `${id}.db`);
                    message.success('数据库已导出');
                  })
                  .catch((e) => {
                    message.warning(e?.message || '导出失败');
                  });
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditDataSourceModal;
