import { Button, Tooltip } from 'antd';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentDataSourceState, DATA_SOURCE_TYPE_LABEL } from '@/state/globalConfig';

import DataSourceManagerDrawer from './DataSourceManagerDrawer';

const DataSourceManage = () => {
  const [open, setOpen] = useState(false);
  const { id, name, type } = useRecoilValue(currentDataSourceState);

  return (
    <>
      <div className="col-span-1 flex flex-col space-y-1">
        <Tooltip title={id} placement="topLeft">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">ID：{id}</span>
        </Tooltip>
        {type === 'local' && <div>名字：{name}</div>}
        <div>类型：{DATA_SOURCE_TYPE_LABEL[type]}</div>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          管理数据源
        </Button>
      </div>
      <DataSourceManagerDrawer open={open} setOpen={setOpen} />
    </>
  );
};

export default DataSourceManage;
