import { Button, Tooltip } from 'antd';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentDataSourceState, DATA_SOURCE_TYPE_LABEL } from '@/state/globalConfig';

import DataSourceManagerModal from './DataSourceManagerModal';

const DataSourceManage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, name, type } = useRecoilValue(currentDataSourceState);

  return (
    <>
      <div className="col-span-1 flex flex-col space-y-1">
        <Tooltip className="line-clamp-1" title={id}>
          ID：{id}
        </Tooltip>
        <div>名字：{name}</div>
        <div>类型：{DATA_SOURCE_TYPE_LABEL[type]}</div>
        <Button
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          管理数据源
        </Button>
      </div>
      <DataSourceManagerModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default DataSourceManage;
