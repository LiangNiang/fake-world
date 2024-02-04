import { CheckOutlined, CopyOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { App, Button, Input, InputRef } from 'antd';
import copy from 'copy-to-clipboard';
import { exportDB } from 'dexie-export-import';
import { saveAs } from 'file-saver';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import { DBManager } from '@/dataSource';
import { currentDataSourceState, DATA_SOURCE_TYPE_LABEL } from '@/state/globalConfig';

const CurrentDataSource = () => {
  const [{ id, name, type }, setCurrentDataSource] = useRecoilState(currentDataSourceState);
  const { message } = App.useApp();
  const db = DBManager.getInstace().getCurrentDBInstance();
  const [isEditName, setIsEditName] = useState(false);
  const inputRef = useRef<InputRef>(null);

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-lg font-semibold">当前数据源详情</div>
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
                setCurrentDataSource((prev) => ({ ...prev, name: value }));
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
        <div>
          数据库：
          <Button
            icon={<DownloadOutlined />}
            type="text"
            onClick={async () => {
              const imagesCount = await db.images.count();
              const isEmptyDB = imagesCount === 0;
              if (isEmptyDB) {
                message.warning('数据库为空，无需导出');
              } else {
                const exportedDB = await exportDB(db);
                if (exportedDB !== null) {
                  saveAs(exportedDB, `${id}.db`);
                  message.success('数据库已导出');
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentDataSource;
