import { Divider, Drawer } from 'antd';
import { Dispatch, SetStateAction } from 'react';

import DataSourceList from './DataSourceList';
import NewDataSource from './NewDataSource';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const DataSourceManagerDrawer = ({ open, setOpen }: Props) => {
  return (
    <Drawer
      title="管理数据源"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      placement="left"
      width={892}
    >
      <div className="flex flex-col">
        <NewDataSource />
        <Divider />
        <DataSourceList />
      </div>
    </Drawer>
  );
};

export default DataSourceManagerDrawer;
